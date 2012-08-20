#!/bin/sh
uglifyjs µ.js | grep -v vim > µ.min.js
cat underscore-1.3.3.min.js µ.min.js > full.µ.js
