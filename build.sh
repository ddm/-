#!/bin/sh
uglifyjs aspect.js | grep -v vim > min.js
cat underscore-1.3.3.min.js min.js > full.min.js
