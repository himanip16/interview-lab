#!/bin/bash

# comment.sh


set -e

find . \
  \( -path "./.git" -o \
     -path "./node_modules" -o \
     -path "./.next" -o \
     -path "./dist" -o \
     -path "./build" -o \
     -path "./coverage" -o \
     -path "./out" \) -prune \
  -o -type f -print | while read -r file
do
    rel="${file#./}"
    ext="${file##*.}"

    case "$ext" in
        js|jsx|ts|tsx|java|kt|kts|go|rs|c|cc|cpp|h|hpp|cs|swift|php)
            comment="// $rel"
            ;;
        py|rb|sh|bash|yml|yaml|toml|properties|env)
            comment="# $rel"
            ;;
        sql)
            comment="-- $rel"
            ;;
        css|scss|sass|less)
            comment="/* $rel */"
            ;;
        html|xml|svg)
            comment="<!-- $rel -->"
            ;;
        *)
            continue
            ;;
    esac

    first_line=$(head -n 1 "$file")

    if [[ "$first_line" == *"$rel"* ]]; then
        continue
    fi

    tmp=$(mktemp)

    if [[ "$first_line" == '#!'* ]]; then
        head -n 1 "$file" > "$tmp"
        echo "" >> "$tmp"
        echo "$comment" >> "$tmp"
        echo "" >> "$tmp"
        tail -n +2 "$file" >> "$tmp"
    else
        echo "$comment" > "$tmp"
        echo "" >> "$tmp"
        cat "$file" >> "$tmp"
    fi

    mv "$tmp" "$file"
    echo "Updated $rel"
done

echo "Done."