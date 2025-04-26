#!/usr/bin/env bash

EXTRA_PARAMS=""

while getopts "w:" flag; do
 case $flag in
   w)
   echo "Using watch mode"
   EXTRA_PARAMS=" --watch"
   shift
   ;;
   \?)
   # Handle invalid options
   ;;
 esac
done

if [ $# -eq 0 ]; then
  FILES=$(find .data/engine/server/assets/operations -name "*.vue")
else
  FILES="${1#`pwd`/}"
fi

for FILE in $FILES; do
  TEMP=${FILE##*/}
  FILENAME=${TEMP%.vue}
  echo "Building ${FILE}..."
  export OPERATION_SOURCE_FILE=$FILE
  yarn build $EXTRA_PARAMS  -c tools/vite.config.js --outDir .data/engine/server/assets/operations/dist/$FILENAME/
done

# wait
