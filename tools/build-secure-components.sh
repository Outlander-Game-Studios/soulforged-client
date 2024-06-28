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
  ./node_modules/.bin/vue-cli-service build $EXTRA_PARAMS --target lib --dest .data/engine/server/assets/operations/dist/$FILENAME/ $FILE --name index &
done

wait
