#!/usr/bin/env bash
#
# find_and_move.sh
#
# Two utilities in one script:
#   find  - search for a file by name (or partial name) under a root directory
#   move  - move a folder (or file) from one path to another, creating
#           destination parent directories if needed
#
# Usage:
#   # Find a file (partial match, case-insensitive, by default)
#   ./find_and_move.sh find . "InterviewEngine.ts"
#   ./find_and_move.sh find . "evaluator"
#
#   # Find with exact filename match
#   ./find_and_move.sh find . "InterviewEngine.ts" --exact
#
#   # Move a folder or file (when you already know the exact path)
#   ./find_and_move.sh move "src/modules/interview/evaluators" "src/modules/interview/services/evaluators"
#
#   # Dry run (preview without moving)
#   ./find_and_move.sh move "src/modules/interview/evaluators" "src/modules/interview/services/evaluators" --dry-run
#
#   # ONE COMMAND: find something by name anywhere under root, then move it.
#   # If a folder itself matches, its own contents are NOT listed separately
#   # (moving the folder already takes everything inside it).
#   # If there's still more than one genuine match, you'll be prompted interactively.
#   ./find_and_move.sh auto . "evaluators" "src/modules/interview/services/evaluators"
#   ./find_and_move.sh auto . "evaluators" "src/modules/interview/services/evaluators" --dry-run
#
#   # Matching checks the FULL relative path (not just the filename), so you can
#   # disambiguate by including part of the parent path:
#   ./find_and_move.sh auto . "lib/logger.ts" "src/shared/logger/logger.ts"
#   ./find_and_move.sh auto . "modules/interview/engine" "src/modules/interview/engine"
#
#   # Delete all empty folders under a root (recursively; removing a nested
#   # empty folder can make its parent empty too, so this handles that).
#   # Skips node_modules/.next/dist/build/.git/coverage even if they're empty.
#   ./find_and_move.sh clean .
#   ./find_and_move.sh clean . --dry-run
#
#   # Reorganize the project into a target folder structure (defined in
#   # TARGET_PATHS below). For each target folder:
#   #   - already exists at that exact path  -> left alone
#   #   - exists somewhere else (exact folder-name match) -> MOVED into place
#   #   - doesn't exist anywhere              -> created empty
#   # NEVER deletes anything. Matching is exact basename (case-insensitive),
#   # not substring, so "app" will never accidentally match "application".
#   ./find_and_move.sh restructure .
#   ./find_and_move.sh restructure . --dry-run

set -euo pipefail

PRUNE_DIRS=("node_modules" ".next" "dist" "build" ".git" "coverage")

# Target folder structure for the 'restructure' subcommand.
# Order matters: parents are listed before their children, so that if a
# parent folder gets moved wholesale, its children usually already land in
# the right place and don't need separate handling.
TARGET_PATHS=(
    "src/app"
    "src/modules/interview"
    "src/modules/interview/application"
    "src/modules/interview/domain"
    "src/modules/interview/engine"
    "src/modules/interview/prompt"
    "src/modules/interview/repositories"
    "src/modules/interview/evaluators"
    "src/modules/interview/infra"
    "src/modules/interview/services"
    "src/modules/interview/dto"
    "src/modules/interview/types"
    "src/components"
    "src/shared/logger"
    "src/shared/config"
    "src/shared/prisma"
    "src/shared/utils"
    "src/content/rubrics"
    "src/content/marketing"
    "prisma"
    "scripts"
    "tests"
)

usage() {
    echo "Usage:"
    echo "  $0 find <root_dir> <name> [--exact]"
    echo "  $0 move <src> <dst> [--dry-run]"
    echo "  $0 auto <root_dir> <name> <dst> [--dry-run]   # find + move in one shot"
    echo "  $0 clean <root_dir> [--dry-run]                # delete all empty folders"
    echo "  $0 restructure <root_dir> [--dry-run]           # reorganize into target structure, never deletes"
    exit 1
}

build_prune_expr() {
    local expr=()
    for d in "${PRUNE_DIRS[@]}"; do
        expr+=(-path "*/$d" -o)
    done
    # remove trailing -o
    unset 'expr[${#expr[@]}-1]'
    echo "${expr[@]}"
}

cmd_find() {
    local root="$1"
    local name="$2"
    local exact="${3:-}"

    if [[ ! -d "$root" ]]; then
        echo "Error: root path does not exist: $root"
        exit 1
    fi

    local prune_args=(-type d \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .git -o -name coverage \) -prune)

    local matches
    if [[ "$exact" == "--exact" ]]; then
        matches=$(find "$root" "${prune_args[@]}" -o -type f -name "$name" -print)
    else
        matches=$(find "$root" "${prune_args[@]}" -o -type f -iname "*$name*" -print)
    fi

    if [[ -z "$matches" ]]; then
        echo "No files found matching '$name' under $root"
    else
        local count
        count=$(echo "$matches" | wc -l | tr -d ' ')
        echo "Found $count match(es):"
        echo "$matches" | sed 's/^/  /'
    fi
}

cmd_move() {
    local src="$1"
    local dst="$2"
    local dry_run="${3:-}"

    if [[ ! -e "$src" ]]; then
        echo "Error: source does not exist: $src"
        exit 1
    fi

    if [[ -e "$dst" ]]; then
        echo "Error: destination already exists: $dst"
        exit 1
    fi

    echo "Source:      $(realpath "$src")"
    echo "Destination: $dst"

    if [[ "$dry_run" == "--dry-run" ]]; then
        echo "[dry-run] No changes made."
        return
    fi

    mkdir -p "$(dirname "$dst")"
    mv "$src" "$dst"
    echo "Move complete."
}

cmd_auto() {
    local root="$1"
    local name="$2"
    local dst="$3"
    shift 3

    local dry_run=""
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run) dry_run="--dry-run" ;;
            *) echo "Unknown option: $1"; exit 1 ;;
        esac
        shift
    done

    if [[ ! -d "$root" ]]; then
        echo "Error: root path does not exist: $root"
        exit 1
    fi

    # Search both files AND directories, skipping noisy dirs.
    # Match against the FULL relative path (not just basename), case-insensitive,
    # so a value like "lib/logger.ts" or "modules/interview/engine" works too.
    local all_paths
    all_paths=$(find "$root" \
        -type d \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .git -o -name coverage \) -prune \
        -o \( -type f -o -type d \) -print \
        | grep -v -E "^$root$" || true)

    local name_lower raw_matches
    name_lower=$(echo "$name" | tr '[:upper:]' '[:lower:]')
    raw_matches=$(echo "$all_paths" | awk -v n="$name_lower" 'BEGIN{IGNORECASE=1} tolower($0) ~ n')

    if [[ -z "$raw_matches" ]]; then
        echo "No file or folder found matching '$name' under $root"
        exit 1
    fi

    # De-duplicate: if a matched directory contains other matches inside it,
    # drop those children and keep only the top-level folder. This avoids fake
    # ambiguity like "engine" matching both the engine/ folder and a file inside it.
    local matches
    matches=$(echo "$raw_matches" | sort | awk '
        {
            is_child = 0
            for (i = 0; i < n; i++) {
                if (index($0, parents[i] "/") == 1) { is_child = 1; break }
            }
            if (!is_child) {
                print $0
                parents[n++] = $0
            }
        }
    ')

    local count
    count=$(echo "$matches" | wc -l | tr -d ' ')

    local src
    if [[ "$count" -gt 1 ]]; then
        echo "Found $count matches for '$name':"
        echo "$matches" | awk '{printf "  [%d] %s\n", NR, $0}'
        echo ""
        if [[ -t 0 ]]; then
            read -r -p "Which one do you want? (enter number, or 'q' to cancel): " choice
            if [[ "$choice" == "q" || -z "$choice" ]]; then
                echo "Cancelled."
                exit 1
            fi
            src=$(echo "$matches" | sed -n "${choice}p")
            if [[ -z "$src" ]]; then
                echo "Error: '$choice' is not a valid option."
                exit 1
            fi
        else
            echo "Not running in an interactive terminal — narrow the name and try again."
            exit 1
        fi
    else
        src="$matches"
    fi

    echo "Selected: $src"
    cmd_move "$src" "$dst" "$dry_run"
}

# Computes, without touching the real filesystem, the full list of empty
# folders that a clean run would remove (including cascading empties that
# only appear after nested empty folders are conceptually removed).
# Prints one path per line, or nothing if there's nothing to remove.
preview_empty_dirs() {
    local root="$1"
    local prune_args=(-type d \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .git -o -name coverage \) -prune)

    local mirror
    mirror=$(mktemp -d)/mirror
    mkdir -p "$mirror"

    while IFS= read -r d; do
        [[ -z "$d" ]] && continue
        mkdir -p "$mirror/${d#"$root"/}"
    done < <(find "$root" -mindepth 1 "${prune_args[@]}" -o -type d -print)

    while IFS= read -r f; do
        [[ -z "$f" ]] && continue
        touch "$mirror/${f#"$root"/}"
    done < <(find "$root" -mindepth 1 "${prune_args[@]}" -o -type f -print)

    while IFS= read -r pd; do
        [[ -z "$pd" ]] && continue
        mkdir -p "$mirror/${pd#"$root"/}"
        touch "$mirror/${pd#"$root"/}/.nonempty-marker" 2>/dev/null || true
    done < <(find "$root" -mindepth 1 -type d \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .git -o -name coverage \) -print)

    local removed=""
    while true; do
        local empties
        empties=$(find "$mirror" -mindepth 1 -type d -empty -print || true)
        [[ -z "$empties" ]] && break
        removed+="$empties"$'\n'
        echo "$empties" | while read -r p; do rmdir "$p" 2>/dev/null || true; done
    done

    rm -rf "$(dirname "$mirror")"

    [[ -n "$removed" ]] && echo "$removed" | sed "s|^$mirror/|$root/|" | sed '/^\s*$/d'
}

cmd_clean() {
    local root="$1"
    shift

    local dry_run=""
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run) dry_run="--dry-run" ;;
            *) echo "Unknown option: $1"; exit 1 ;;
        esac
        shift
    done

    if [[ ! -d "$root" ]]; then
        echo "Error: root path does not exist: $root"
        exit 1
    fi

    # Never touch these, even if they look empty (e.g. an empty git repo, or a
    # dependency dir that hasn't been installed yet).
    local prune_args=(-type d \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .git -o -name coverage \) -prune)

    # Portable (macOS BSD find/awk safe): compute the full list up front via
    # a directory-skeleton mirror, before touching anything real.
    local to_remove
    to_remove=$(preview_empty_dirs "$root")

    if [[ -z "$to_remove" ]]; then
        echo "No empty folders found under $root"
        return
    fi

    local count
    count=$(echo "$to_remove" | wc -l | tr -d ' ')
    echo "Found $count empty folder(s) that would be removed under $root:"
    echo "$to_remove" | sed 's/^/  /'

    if [[ "$dry_run" == "--dry-run" ]]; then
        echo "[dry-run] No changes made."
        return
    fi

    if [[ -t 0 ]]; then
        read -r -p "Delete these $count folder(s)? (y/N): " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            echo "Cancelled. No changes made."
            return
        fi
    else
        echo "Not running in an interactive terminal — re-run with --dry-run to inspect, then run interactively to confirm."
        exit 1
    fi

    local total=0
    while true; do
        local empties emp_count
        empties=$(find "$root" "${prune_args[@]}" -o -type d -empty -print | grep -v -E "^$root$" || true)
        [[ -z "$empties" ]] && break
        emp_count=$(echo "$empties" | wc -l | tr -d ' ')
        echo "$empties" | while read -r p; do
            echo "Removing: $p"
            rmdir "$p"
        done
        total=$((total + emp_count))
    done

    echo "Removed $total empty folder(s)."
}

cmd_restructure() {
    local root="$1"
    shift

    local dry_run=""
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run) dry_run="--dry-run" ;;
            *) echo "Unknown option: $1"; exit 1 ;;
        esac
        shift
    done

    if [[ ! -d "$root" ]]; then
        echo "Error: root path does not exist: $root"
        exit 1
    fi

    local prune_expr=(-type d \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .git -o -name coverage \) -prune)

    # Full paths of every target slot, used below to make sure a folder that
    # belongs to one target slot (e.g. src/shared/prisma) never gets swept up
    # as a "match" for a different target slot that happens to share a
    # basename (e.g. top-level prisma/).
    local all_target_full=()
    local t
    for t in "${TARGET_PATHS[@]}"; do
        all_target_full+=("$root/$t")
    done

    local created=0 moved=0 skipped_ok=0 skipped_ambiguous=0

    for target in "${TARGET_PATHS[@]}"; do
        local full_target="$root/$target"

        if [[ -d "$full_target" ]]; then
            echo "OK       $target  (already in place)"
            skipped_ok=$((skipped_ok + 1))
            continue
        fi

        local base
        base=$(basename "$target")

        # Exact basename match only (case-insensitive), never substring —
        # this avoids e.g. "app" wrongly matching "application".
        local raw_matches
        raw_matches=$(find "$root" "${prune_expr[@]}" -o -type d -iname "$base" -print 2>/dev/null || true)

        # Drop any candidate that is itself one of the other target slots
        # (already correctly placed, or already created for a different
        # purpose) — never cannibalize another slot's folder.
        local matches=""
        local m
        while IFS= read -r m; do
            [[ -z "$m" ]] && continue
            local is_other_target=0
            local ot
            for ot in "${all_target_full[@]}"; do
                if [[ "$ot" != "$full_target" && "$m" == "$ot" ]]; then
                    is_other_target=1
                    break
                fi
            done
            [[ "$is_other_target" -eq 0 ]] && matches+="$m"$'\n'
        done <<< "$raw_matches"
        matches=$(echo "$matches" | sed '/^\s*$/d')

        if [[ -z "$matches" ]]; then
            echo "CREATE   $target  (new empty folder, nothing matched)"
            if [[ "$dry_run" != "--dry-run" ]]; then
                mkdir -p "$full_target"
            fi
            created=$((created + 1))
            continue
        fi

        local count
        count=$(echo "$matches" | wc -l | tr -d ' ')

        local src=""
        if [[ "$count" -gt 1 ]]; then
            echo "AMBIGUOUS for '$target' — multiple folders named '$base' found:"
            echo "$matches" | awk '{printf "  [%d] %s\n", NR, $0}'
            if [[ -t 0 ]]; then
                read -r -p "Which one should move to $target? (number, or 's' to skip): " choice
                if [[ "$choice" == "s" || -z "$choice" ]]; then
                    echo "  Skipped $target."
                    skipped_ambiguous=$((skipped_ambiguous + 1))
                    continue
                fi
                src=$(echo "$matches" | sed -n "${choice}p")
                if [[ -z "$src" ]]; then
                    echo "  Invalid choice, skipping $target."
                    skipped_ambiguous=$((skipped_ambiguous + 1))
                    continue
                fi
            else
                echo "  Not interactive — skipping $target (nothing deleted or moved)."
                skipped_ambiguous=$((skipped_ambiguous + 1))
                continue
            fi
        else
            src="$matches"
        fi

        echo "MOVE     $src  ->  $target"
        if [[ "$dry_run" != "--dry-run" ]]; then
            mkdir -p "$(dirname "$full_target")"
            mv "$src" "$full_target"
        fi
        moved=$((moved + 1))
    done

    echo ""
    if [[ "$dry_run" == "--dry-run" ]]; then
        echo "[dry-run] Summary: $moved would move, $created would be created new, $skipped_ok already correct, $skipped_ambiguous skipped (ambiguous). Nothing was changed."
    else
        echo "Summary: $moved moved, $created created new, $skipped_ok already correct, $skipped_ambiguous skipped (ambiguous). Nothing was deleted."
    fi
}

main() {
    if [[ $# -lt 1 ]]; then
        usage
    fi

    local command="$1"
    shift

    case "$command" in
        find)
            [[ $# -lt 2 ]] && usage
            cmd_find "$@"
            ;;
        move)
            [[ $# -lt 2 ]] && usage
            cmd_move "$@"
            ;;
        auto)
            [[ $# -lt 3 ]] && usage
            cmd_auto "$@"
            ;;
        clean)
            [[ $# -lt 1 ]] && usage
            cmd_clean "$@"
            ;;
        restructure)
            [[ $# -lt 1 ]] && usage
            cmd_restructure "$@"
            ;;
        *)
            usage
            ;;
    esac
}

main "$@"