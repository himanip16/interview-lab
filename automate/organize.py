#!/usr/bin/env python3
"""
organize.py — reorganize a project directory to match a target `tree` layout.

Usage:
    python organize.py plan      desired_tree.txt
    python organize.py apply     desired_tree.txt [--dry-run] [--yes]
    python organize.py visualize desired_tree.txt
    python organize.py diff      desired_tree.txt

Input format: paste the exact output of `tree` (unicode box-drawing
characters, one or more root entries, optional trailing "N directories,
M files" summary line — that line is ignored).

Safety guarantees:
    * Never deletes a file or folder.
    * Never overwrites a file or folder.
    * Never merges two folders.
    * Only ever MOVEs things or CREATEs new (empty) directories.

A node is treated as a FILE if its name contains a "." (e.g. "client.ts"),
or if it ends with an explicit trailing "/" it is forced to be a
DIRECTORY. Any node with children in the tree is always a directory,
regardless of its name. Leaf names with no dot (e.g. "logger", "utils")
are treated as directories to create.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath
from typing import Dict, List, Optional, Tuple

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------

DEFAULT_EXCLUDES = {
    ".git", "node_modules", "__pycache__", ".venv", "venv", ".mypy_cache",
    ".pytest_cache", "dist", "build", ".next", ".turbo", ".idea", ".vscode",
    "organize.py", "rollback.sh", ".rollback.py",
}

USE_COLOR = sys.stdout.isatty() and os.environ.get("NO_COLOR") is None


def c(text: str, code: str) -> str:
    if not USE_COLOR:
        return text
    return f"\033[{code}m{text}\033[0m"


def green(t):  return c(t, "32")
def yellow(t): return c(t, "33")
def cyan(t):   return c(t, "36")
def red(t):    return c(t, "31")
def bold(t):   return c(t, "1")
def dim(t):    return c(t, "2")


# --------------------------------------------------------------------------
# Tree parsing
# --------------------------------------------------------------------------

CONNECTOR_RE = re.compile(r"(├── |└── )")
SUMMARY_RE = re.compile(r"^\d+\s+directories?,?\s*\d+\s+files?\.?\s*$")


class TreeNode:
    __slots__ = ("name", "is_dir_forced", "children", "parent")

    def __init__(self, name: str, is_dir_forced: bool = False):
        self.name = name
        self.is_dir_forced = is_dir_forced
        self.children: List["TreeNode"] = []
        self.parent: Optional["TreeNode"] = None

    def add_child(self, child: "TreeNode") -> None:
        child.parent = self
        self.children.append(child)

    @property
    def is_dir(self) -> bool:
        if self.children:
            return True
        if self.is_dir_forced:
            return True
        return "." not in self.name

    @property
    def path(self) -> str:
        parts = []
        node = self
        while node is not None:
            parts.append(node.name)
            node = node.parent
        return "/".join(reversed(parts))

    def __repr__(self):
        return f"<{'DIR' if self.is_dir else 'FILE'} {self.path}>"


def _parse_line(line: str) -> Tuple[Optional[int], Optional[str], bool]:
    """Return (depth, name, forced_dir) or (None, None, False) to skip the line."""
    raw = line.rstrip("\n").rstrip()
    if not raw.strip():
        return None, None, False
    if SUMMARY_RE.match(raw.strip()):
        return None, None, False

    m = CONNECTOR_RE.search(raw)
    if m:
        depth = (m.start() // 4) + 1
        name = raw[m.end():].strip()
    else:
        depth = 0
        name = raw.strip()

    if not name:
        return None, None, False

    forced_dir = name.endswith("/")
    name = name.rstrip("/")
    # strip trailing comments like "file.ts  # something" is NOT standard
    # tree output, so we leave names untouched otherwise.
    return depth, name, forced_dir


def parse_tree(text: str) -> List[TreeNode]:
    """Parse `tree`-style text into a forest of TreeNodes (one per root entry)."""
    roots: List[TreeNode] = []
    stack: List[Tuple[int, TreeNode]] = []

    for line in text.splitlines():
        depth, name, forced_dir = _parse_line(line)
        if name is None:
            continue

        node = TreeNode(name, is_dir_forced=forced_dir)

        if depth == 0:
            roots.append(node)
            stack = [(0, node)]
            continue

        while stack and stack[-1][0] >= depth:
            stack.pop()

        if stack:
            stack[-1][1].add_child(node)
        else:
            # malformed indentation; treat as a new root
            roots.append(node)

        stack.append((depth, node))

    return roots


def iter_nodes(roots: List[TreeNode]):
    stack = list(roots)
    while stack:
        node = stack.pop(0)
        yield node
        stack = list(node.children) + stack


def render_tree(roots: List[TreeNode]) -> str:
    lines: List[str] = []

    def _render(node: TreeNode, prefix: str, is_last: bool, is_root: bool):
        if is_root:
            lines.append(node.name)
        else:
            connector = "└── " if is_last else "├── "
            lines.append(prefix + connector + node.name)
        new_prefix = prefix if is_root else prefix + ("    " if is_last else "│   ")
        for i, child in enumerate(node.children):
            _render(child, new_prefix, i == len(node.children) - 1, False)

    for i, root in enumerate(roots):
        _render(root, "", True, True)
        if i != len(roots) - 1:
            lines.append("")

    return "\n".join(lines)


# --------------------------------------------------------------------------
# Filesystem index
# --------------------------------------------------------------------------

class FsIndex:
    """An index of every directory and file under a root, excluding noise."""

    def __init__(self, root: Path, excludes: Optional[set] = None):
        self.root = root
        self.excludes = excludes or DEFAULT_EXCLUDES
        self.dirs: List[str] = []   # relative posix paths
        self.files: List[str] = []
        self.dirs_by_name: Dict[str, List[str]] = {}
        self.files_by_name: Dict[str, List[str]] = {}
        self._scan()

    def _scan(self):
        for dirpath, dirnames, filenames in os.walk(self.root):
            dirnames[:] = [d for d in dirnames if d not in self.excludes and not d.startswith(".git")]
            rel_dir = os.path.relpath(dirpath, self.root)
            rel_dir = "" if rel_dir == "." else rel_dir.replace(os.sep, "/")

            for d in dirnames:
                rel = f"{rel_dir}/{d}" if rel_dir else d
                self.dirs.append(rel)
                self.dirs_by_name.setdefault(d, []).append(rel)

            for f in filenames:
                if f in self.excludes:
                    continue
                rel = f"{rel_dir}/{f}" if rel_dir else f
                self.files.append(rel)
                self.files_by_name.setdefault(f, []).append(rel)

    def dir_exists(self, rel_path: str) -> bool:
        return rel_path in self.dirs or rel_path == ""

    def file_exists(self, rel_path: str) -> bool:
        return rel_path in self.files

    def find_by_name(self, name: str, is_dir: bool) -> List[str]:
        table = self.dirs_by_name if is_dir else self.files_by_name
        return list(table.get(name, []))


# --------------------------------------------------------------------------
# Planning
# --------------------------------------------------------------------------

@dataclass
class PlanItem:
    action: str            # "skip" | "move" | "create" | "ignore" | "ambiguous"
    node: TreeNode
    target: str
    source: Optional[str] = None
    candidates: List[str] = field(default_factory=list)


class Planner:
    def __init__(self, index: FsIndex, auto_yes: bool = False, interactive: bool = True):
        self.index = index
        self.auto_yes = auto_yes
        self.interactive = interactive
        self.plan: List[PlanItem] = []
        self.used_sources: set = set()
        self.needs_review: List[PlanItem] = []

    def _is_under_used(self, path: str) -> bool:
        for used in self.used_sources:
            if path == used or path.startswith(used + "/"):
                return True
        return False

    def _consume_subtree(self, path: str):
        self.used_sources.add(path)

    def build(self, roots: List[TreeNode]) -> List[PlanItem]:
        for root in roots:
            self._process(root, parent_actual="")
        return self.plan

    def _process(self, node: TreeNode, parent_actual: Optional[str]):
        target = node.path
        is_dir = node.is_dir

        # 1. Does it already exist naturally under the parent's actual location?
        natural = None
        if parent_actual is not None:
            natural = f"{parent_actual}/{node.name}" if parent_actual else node.name
            exists_natural = (
                self.index.dir_exists(natural) if is_dir else self.index.file_exists(natural)
            )
            if exists_natural:
                item = PlanItem(action="skip", node=node, target=target, source=natural)
                self.plan.append(item)
                for child in node.children:
                    self._process(child, parent_actual=natural)
                return

        # 2. Search globally by name for a match elsewhere.
        candidates = [
            p for p in self.index.find_by_name(node.name, is_dir)
            if p != target and not self._is_under_used(p)
        ]

        if len(candidates) == 1:
            source = candidates[0]
            self._consume_subtree(source)
            item = PlanItem(action="move", node=node, target=target, source=source)
            self.plan.append(item)
            # Children travel with the moved directory, but any declared
            # child that does NOT already exist inside the moved source
            # still needs to be created (or found/moved from elsewhere) —
            # so we keep recursing, using the source as the new "actual"
            # parent location for the natural-existence check.
            for child in node.children:
                self._process(child, parent_actual=source)
            return

        if len(candidates) > 1:
            resolved = self._resolve_ambiguous(node, candidates)
            if resolved is None:
                item = PlanItem(action="ambiguous", node=node, target=target, candidates=candidates)
                self.plan.append(item)
                self.needs_review.append(item)
                return
            source = resolved
            self._consume_subtree(source)
            item = PlanItem(action="move", node=node, target=target, source=source)
            self.plan.append(item)
            for child in node.children:
                self._process(child, parent_actual=source)
            return

        # 3. Doesn't exist anywhere.
        if is_dir:
            item = PlanItem(action="create", node=node, target=target)
            self.plan.append(item)
            for child in node.children:
                self._process(child, parent_actual=target)
        else:
            item = PlanItem(action="ignore", node=node, target=target)
            self.plan.append(item)

    def _resolve_ambiguous(self, node: TreeNode, candidates: List[str]) -> Optional[str]:
        if self.auto_yes or not self.interactive:
            return None
        print()
        kind = "folder" if node.is_dir else "file"
        print(f'Found multiple {kind}s named "{node.name}"\n')
        for i, cand in enumerate(candidates, 1):
            print(f"  [{i}] {cand}")
        print(f"  [0] skip — I'll handle this one manually")
        while True:
            try:
                choice = input(f"\nChoose destination for {target_hint(node)}: ").strip()
            except EOFError:
                print("\nNo input available — skipping for manual review.")
                return None
            if choice.isdigit():
                idx = int(choice)
                if idx == 0:
                    return None
                if 1 <= idx <= len(candidates):
                    return candidates[idx - 1]
            print("Please enter a valid number.")


def target_hint(node: TreeNode) -> str:
    return node.path


# --------------------------------------------------------------------------
# Rendering the plan
# --------------------------------------------------------------------------

def print_plan(plan: List[PlanItem]) -> None:
    moves_dir = [p for p in plan if p.action == "move" and p.node.is_dir]
    moves_file = [p for p in plan if p.action == "move" and not p.node.is_dir]
    creates = [p for p in plan if p.action == "create"]
    skips = [p for p in plan if p.action == "skip"]
    ambiguous = [p for p in plan if p.action == "ambiguous"]

    width = 58
    print("=" * width)
    print(bold("PROJECT REORGANIZATION").center(width))
    print("=" * width)

    if moves_dir:
        print()
        print(bold("MOVE DIRECTORY"))
        print("-" * 15)
        for p in moves_dir:
            print(f"{p.source}\n    {dim('↓')}\n{green(p.target)}\n")

    if moves_file:
        print(bold("MOVE FILE"))
        print("-" * 9)
        for p in moves_file:
            print(f"{p.source}\n    {dim('↓')}\n{green(p.target)}\n")

    if creates:
        print(bold("CREATE DIRECTORY"))
        print("-" * 16)
        for p in creates:
            print(cyan(p.target))
        print()

    if ambiguous:
        print(bold(yellow("AMBIGUOUS (needs manual resolution)")))
        print("-" * 36)
        for p in ambiguous:
            print(f"{p.target}  {yellow('?')}  candidates: {', '.join(p.candidates)}")
        print()

    if skips:
        print(bold("SKIP"))
        print("-" * 4)
        for p in skips:
            print(dim(p.target))
        print()

    print("=" * width)
    n_moves = len(moves_dir) + len(moves_file)
    print(f"{n_moves} move(s), {len(creates)} create(s), {len(skips)} skip(s), "
          f"{len(ambiguous)} ambiguous")
    print("=" * width)


def print_diff(plan: List[PlanItem]) -> None:
    symbols = {
        "skip": ("✓", green),
        "move": ("→", yellow),
        "create": ("+", cyan),
        "ignore": ("·", dim),
        "ambiguous": ("?", yellow),
    }
    for p in plan:
        sym, color = symbols[p.action]
        detail = ""
        if p.action == "move":
            detail = f"  (from {p.source})"
        elif p.action == "ambiguous":
            detail = f"  ({len(p.candidates)} candidates)"
        print(f"{color(sym)} {p.target}{dim(detail)}")


# --------------------------------------------------------------------------
# Execution
# --------------------------------------------------------------------------

def execute_plan(plan: List[PlanItem], root: Path) -> List[Tuple[str, str, str]]:
    """
    Execute the plan on disk. Returns a list of (kind, a, b) executed actions,
    in execution order, suitable for building a rollback script:
        ("move", source, target)
        ("create", target, "")
    """
    executed: List[Tuple[str, str, str]] = []

    # Execute in plan order (already parent-before-child from the pre-order
    # traversal). This matters: if we batched all CREATEs before all MOVEs,
    # creating a child directory would implicitly pre-create its parent via
    # mkdir(parents=True), and that parent might itself be the destination
    # of a MOVE that hasn't happened yet — blocking it. Interleaved,
    # in-order execution avoids that.
    for item in plan:
        if item.action == "create":
            dest = root / item.target
            dest.mkdir(parents=True, exist_ok=True)
            executed.append(("create", item.target, ""))
        elif item.action == "move":
            src = root / item.source
            dest = root / item.target
            if dest.exists():
                print(red(f"REFUSING to overwrite existing path: {item.target}"))
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            src.rename(dest)
            executed.append(("move", item.source, item.target))

    return executed


def write_rollback(executed: List[Tuple[str, str, str]], root: Path) -> Path:
    rollback_path = root / "rollback.sh"
    lines = [
        "#!/usr/bin/env bash",
        "# Auto-generated rollback script. Reverses the last `organize.py apply` run.",
        "set -e",
        "",
    ]
    for kind, a, b in reversed(executed):
        if kind == "move":
            source, target = a, b
            lines.append(f'mv "{target}" "{source}"')
        elif kind == "create":
            target = a
            lines.append(f'rmdir "{target}" 2>/dev/null || true  # only removes if empty')
    lines.append("")
    rollback_path.write_text("\n".join(lines))
    rollback_path.chmod(0o755)
    return rollback_path


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def load_tree(path: str) -> List[TreeNode]:
    text = Path(path).read_text()
    roots = parse_tree(text)
    if not roots:
        print(red(f"No entries could be parsed from {path}"), file=sys.stderr)
        sys.exit(1)
    return roots


def cmd_plan(args):
    roots = load_tree(args.tree_file)
    index = FsIndex(Path(args.root))
    planner = Planner(index, auto_yes=False, interactive=True)
    plan = planner.build(roots)
    print_plan(plan)


def cmd_visualize(args):
    roots = load_tree(args.tree_file)
    print(bold("Desired structure"))
    print()
    print(render_tree(roots))


def cmd_diff(args):
    roots = load_tree(args.tree_file)
    index = FsIndex(Path(args.root))
    planner = Planner(index, auto_yes=True, interactive=False)
    plan = planner.build(roots)
    print_diff(plan)


def cmd_apply(args):
    roots = load_tree(args.tree_file)
    index = FsIndex(Path(args.root))
    planner = Planner(index, auto_yes=args.yes, interactive=not args.yes)
    plan = planner.build(roots)
    print_plan(plan)

    if planner.needs_review:
        print(yellow(f"\n{len(planner.needs_review)} item(s) need manual resolution "
                      f"(run `plan` interactively, or without --yes, to resolve them)."))

    actionable = [p for p in plan if p.action in ("move", "create")]
    if not actionable:
        print(dim("\nNothing to do."))
        return

    if args.dry_run:
        print(dim("\nDry run — no changes made."))
        return

    if not args.yes:
        resp = input(f"\nApply {len(actionable)} change(s)? [y/N] ").strip().lower()
        if resp not in ("y", "yes"):
            print("Aborted.")
            return

    root = Path(args.root)
    executed = execute_plan(plan, root)
    rollback_path = write_rollback(executed, root)
    print(green(f"\nDone. {len(executed)} change(s) applied."))
    print(dim(f"Rollback script written to {rollback_path}"))


def main():
    parser = argparse.ArgumentParser(
        prog="organize.py",
        description="Reorganize a project directory to match a target `tree` layout.",
    )
    parser.add_argument("--root", default=".", help="Project root to scan/modify (default: cwd)")

    sub = parser.add_subparsers(dest="command", required=True)

    p_plan = sub.add_parser("plan", help="Show the reorganization plan (no changes made)")
    p_plan.add_argument("tree_file")
    p_plan.set_defaults(func=cmd_plan)

    p_apply = sub.add_parser("apply", help="Apply the reorganization plan")
    p_apply.add_argument("tree_file")
    p_apply.add_argument("--dry-run", action="store_true", help="Show what would happen, but do not touch the filesystem")
    p_apply.add_argument("--yes", action="store_true", help="Do not prompt for confirmation or ambiguity resolution")
    p_apply.set_defaults(func=cmd_apply)

    p_vis = sub.add_parser("visualize", help="Pretty-print the parsed desired tree")
    p_vis.add_argument("tree_file")
    p_vis.set_defaults(func=cmd_visualize)

    p_diff = sub.add_parser("diff", help="Show a compact per-node diff against the current filesystem")
    p_diff.add_argument("tree_file")
    p_diff.set_defaults(func=cmd_diff)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()