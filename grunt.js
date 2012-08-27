/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '1.0.0ß',
      banner: '/* µ <%= meta.version %> ' +
        '(<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
        '* https://gitub.com/ddm/-\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Dimitri del@ Marmol\n' +
        'µ may be freely distributed under the MIT license\n' +
        'µ was inspired by https://github.com/raganwald/YouAreDaChef\n' +
        '-\n' +
        'Includes Underscore.js 1.3.3\n' +
        '(c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.\n' +
        'Underscore may be freely distributed under the MIT license.\n' +
        'Portions of Underscore are inspired or borrowed from Prototype,\n' +
        "Oliver Steele's Functional, and John Resig's Micro-Templating.\n" +
        'For all details and documentation:\n' +
        'http://documentcloud.github.com/underscore */'
    },
    lint: {
      files: ['grunt.js', 'µ.js', '_.js']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'µ.js', '_.js'],
        dest: 'dist/µ.full.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
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
  grunt.registerTask('default', 'concat min'); // TODO lint + Jasmine

};
