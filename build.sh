#!/bin/sh
uglifyjs aspect.js | grep -v vim | grep -v aspect | grep -v example > min.js
cat underscore-1.3.3.min.js min.js > full.min.js
