#!/bin/bash

# dump_project.sh


# Usage:
# ./dump.sh src/modules/interview

TARGET_DIR=${1:-src}
OUTPUT="project_dump.txt"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Directory '$TARGET_DIR' does not exist."
    exit 1
fi

echo "PROJECT STRUCTURE" > "$OUTPUT"
echo "=================" >> "$OUTPUT"

tree "$TARGET_DIR" \
  -I 'node_modules|.next|dist|build|coverage|.git' >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "FILE CONTENTS" >> "$OUTPUT"

find "$TARGET_DIR" \
  \( -name "*.ts" \
  -o -name "*.tsx" \
  -o -name "*.js" \
  -o -name "*.mjs" \
  -o -name "*.json" \
  -o -name "*.md" \
  -o -name "*.prisma" \
  -o -name "*.css" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.next/*" \
  ! -path "*/.git/*" \
  ! -path "*/coverage/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  ! -name "package-lock.json" |
while read -r file
do
    {
        echo
        echo "================================================"
        echo "FILE: $file"
        echo "================================================"
        cat "$file"
    } >> "$OUTPUT"
done

echo "Done. Output written to $OUTPUT"