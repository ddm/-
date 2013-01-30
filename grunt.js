/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '1.0.2'
    },
    lint: {
      files: ['grunt.js', 'µ.js', '_.js']
    },
    concat: {
      dist: {
        src: ['<file_template:CREDITS>', 'µ.js', '_.js'],
        dest: 'dist/µ.full.js'
      }
    },
    min: {
      dist: {
        src: ['<file_template:CREDITS>', '<config:concat.dist.dest>'],
        dest: 'dist/µ.full.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: '' // TODO lint
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min'); // TODO lint + Unit test

};
