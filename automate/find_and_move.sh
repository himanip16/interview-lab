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
#   # Only moves if exactly one match is found; otherwise lists numbered matches.
#   ./find_and_move.sh auto . "evaluators" "src/modules/interview/services/evaluators"
#   ./find_and_move.sh auto . "evaluators" "src/modules/interview/services/evaluators" --dry-run
#
#   # Matching now checks the FULL relative path, not just the filename, so you can
#   # disambiguate by including part of the parent path:
#   ./find_and_move.sh auto . "lib/logger.ts" "src/shared/logger/logger.ts"
#   ./find_and_move.sh auto . "modules/interview/engine" "src/modules/interview/engine"
#
#   # Still ambiguous? Re-run with --pick N using the number shown in the match list:
#   ./find_and_move.sh auto . "tests" "src/tests" --pick 1

set -euo pipefail

PRUNE_DIRS=("node_modules" ".next" "dist" "build" ".git" "coverage")

usage() {
    echo "Usage:"
    echo "  $0 find <root_dir> <name> [--exact]"
    echo "  $0 move <src> <dst> [--dry-run]"
    echo "  $0 auto <root_dir> <name> <dst> [--dry-run]   # find + move in one shot"
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
    local pick=""
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run) dry_run="--dry-run" ;;
            --pick) pick="$2"; shift ;;
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

    local name_lower matches
    name_lower=$(echo "$name" | tr '[:upper:]' '[:lower:]')
    matches=$(echo "$all_paths" | awk -v n="$name_lower" 'BEGIN{IGNORECASE=1} tolower($0) ~ n')

    if [[ -z "$matches" ]]; then
        echo "No file or folder found matching '$name' under $root"
        exit 1
    fi

    local count
    count=$(echo "$matches" | wc -l | tr -d ' ')

    if [[ "$count" -gt 1 && -z "$pick" ]]; then
        echo "Found $count matches for '$name':"
        echo "$matches" | awk '{printf "  [%d] %s\n", NR, $0}'
        echo ""
        echo "Either narrow the name (e.g. include part of the parent path), or re-run with --pick N, e.g.:"
        echo "  $0 auto \"$root\" \"$name\" \"$dst\" --pick 1"
        exit 1
    fi

    local src
    if [[ -n "$pick" ]]; then
        src=$(echo "$matches" | sed -n "${pick}p")
        if [[ -z "$src" ]]; then
            echo "Error: --pick $pick is out of range (found $count matches)."
            exit 1
        fi
    else
        src="$matches"
    fi

    echo "Match found: $src"
    cmd_move "$src" "$dst" "$dry_run"
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
        pick)
            # convenience alias: pick <root> <name> <dst> <N> [--dry-run]
            [[ $# -lt 4 ]] && usage
            local r="$1" n="$2" d="$3" p="$4"
            shift 4
            cmd_auto "$r" "$n" "$d" --pick "$p" "$@"
            ;;
        *)
            usage
            ;;
    esac
}

main "$@"