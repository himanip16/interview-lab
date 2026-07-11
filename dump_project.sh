#!/bin/bash

OUTPUT="project_dump.txt"

echo "PROJECT STRUCTURE" > "$OUTPUT"
echo "=================" >> "$OUTPUT"

tree -I 'node_modules|.next|dist|build|coverage|.git' >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "FILE CONTENTS" >> "$OUTPUT"


find . \
  \( -name "*.ts" \
  -o -name "*.tsx" \
  -o -name "*.js" \
  -o -name "*.mjs" \
  -o -name "*.json" \
  -o -name "*.md" \
  -o -name "*.prisma" \
  -o -name "*.css" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./.git/*" \
  ! -path "./coverage/*" \
  ! -path "./dist/*" \
  ! -path "./build/*" \
  ! -name "package-lock.json" \
  | while read file
do
  echo "" >> "$OUTPUT"
  echo "================================================" >> "$OUTPUT"
  echo "FILE: $file" >> "$OUTPUT"
  echo "================================================" >> "$OUTPUT"

  cat "$file" >> "$OUTPUT"

done

echo "Done"