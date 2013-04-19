/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    meta: {
      version: '2.1.1'
    },
    concat: {
      dist: {
        src: ['<file_template:CREDITS>', '_.js', 'µ.js'],
        dest: 'dist/µ.full.js'
      }
    },
    min: {
      dist: {
        src: ['<file_template:CREDITS>', '<config:concat.dist.dest>'],
        dest: 'dist/µ.full.min.js'
      }
    },
    uglify: {}
  });

  grunt.registerTask('default', 'concat min');

};
