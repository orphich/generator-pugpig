// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var gateway = require('gateway');
var phpEnabled = true;             // PHP on/off variable - set to false if PHP not needed

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var phpOption = false;

  if (phpEnabled) {
    grunt.util.spawn({
      cmd: 'command',
      args: ['-v', 'php-cgi']
    }, function(err, result) {
      var phpPathCheck = new RegExp('(.*)/php-cgi');
      if (phpPathCheck.test(result + '')) {
        grunt.log.write('php-cgi found! server will run with PHP support \nphp-cgi path: ' + result);
        phpOption = true;
      } else {
        grunt.log.error('php-cgi not found - grunt server will run without PHP support \nphp-cgi check output: ' + result);
        phpOption = false;
      }
    });
  }

  // configurable paths
  var cms = <% if ( templateType === 'Drupal' ) { %>'drupal'<% } else if ( templateType === 'Wordpress' ) { %>'wordpress'<% } else { %>'YOUR_CMS'<% } %>,
    distRoot = 'dist',
    yeomanConfig = {
      app: 'app',
      dist: {
        'static': distRoot + '/pugpig-<%= publication %>-static',
        'theme': distRoot + '/pugpig-<%= publication %>-theme'
      },
      buildtime: '2014-01-01T00:12:00+00:00'
    };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      sass: {
        files: ['<%%= yeoman.app %>/styles/**/*.{scss,sass}'],
        tasks: ['sass']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%%= yeoman.app %>/static/*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            if (phpOption) {
              grunt.log.write('trying to run with php...');
              return [
                lrSnippet,
                gateway(__dirname + '/app', {
                  '.php': 'php-cgi'
                }),
                mountFolder(connect, '.tmp'),
                mountFolder(connect, yeomanConfig.app)
              ];
            } else {
              grunt.log.write('phpOption: ' + phpOption);
              return [
                lrSnippet,
                mountFolder(connect, '.tmp'),
                mountFolder(connect, yeomanConfig.app)
              ];
            }
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      'static': {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist['static'])
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>/static'
      }
    },
    clean: {
      'static': {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= yeoman.dist.static %>/*',
            '!<%%= yeoman.dist.static %>/.git*'
          ]
        }]
      },
      theme: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= yeoman.dist.theme %>/*',
            '!<%%= yeoman.dist.theme %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/styles',
          src: [
            '**/*.sass',
            '!**/_*.sass'
          ],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },
    imagemin: {
      'static': {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%%= yeoman.dist.static %>/images'
        }]
      },
      theme: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%%= yeoman.dist.theme %>/images'
        }]
      }
    },
    svgmin: {
      'static': {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= yeoman.dist.static %>/images'
        }]
      },
      theme: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= yeoman.dist.theme %>/images'
        }]
      }
    },
    cssmin: {
      'static': {
        expand: true,
        cwd: '.tmp/styles',
        src: [
          '*.css',
          '!_*.css'
        ],
        dest: '<%%= yeoman.dist.static %>/styles',
        ext: '.css'
      },
      theme: {
        expand: true,
        cwd: '.tmp/styles',
        src: [
          '*.css',
          '!_*.css'
        ],
        dest: '<%%= yeoman.dist.theme %>/styles',
        ext: '.css'
      }
    },
    copy: {
      'static': {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist.static %>',
          src: [
            '*.{ico,png,txt,xml,manifest}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}',
            'static/**/*',
            'fonts/*'
          ]
        }]
      },
      theme: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist.theme %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp,gif}',
            'styles/*.css',
            'fonts/*'
          ]
        }]
      },
      drupal: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist.theme %>',
          src: [
            '<%= publication %>.info'
          ]
        }]
      },
      wordpress: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist.theme %>',
          src: [
            'style.css'
          ]
        }]
      }
    },
    concurrent: {
      server: [
        'sass'
      ],
      'static': [
        'sass',
        'imagemin:static',
        'svgmin:static'
      ],
      theme: [
        'sass',
        'imagemin:theme',
        'svgmin:theme'
      ]
    },
    replace: {
      drupal: {
        src: ['<%%= yeoman.dist.theme %>/<%= publication %>.info'],
        overwrite: true,
        replacements: [{
          from: /version\s*=\s*".*?"/g,
          to: "version =\"7.x-<%%= grunt.config('meta-version').toString().replace(/\.([^\.]*)$/g, '_$1') %>\""
        }]
      },
      wordpress: {
        src: ['<%%= yeoman.dist.theme %>/style.css'],
        overwrite: true,
        replacements: [{
          from: /Version: [0-9]*\.[0-9]*\.[0-9]*/g,
          to: "Version: <%%= grunt.config('meta-version') %>"
        }]
      },
      'static_date': {
        src: [ '<%%= yeoman.app %>/opds-vars.php' ],
        overwrite: true,
        replacements: [{
          from: /define\s*\(\s*'BUILD_DATE'\s*,\s*'[^']*'\s*\)\s*;/g,
          to: 'define(\'BUILD_DATE\', \'<%%= yeoman.buildtime %>\');'
        }]
      }//,
      // 'static_version_php': {
      //     src: ['<%%= yeoman.dist.static %>/opds-vars.php', ],
      //     overwrite: true,
      //     replacements: [{
      //     from: /\$version\s*=\s*".*?"\s*;/g,
      //     to: "$version = \"<%%= grunt.config('meta-version') %>\";"
      //   }]
      // },
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:static:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    <% if ( templateType === 'Static' ) { %>//<% }%>'build:theme',
    'build:static'
  ]);

  grunt.registerTask('build:theme', [
    'clean:theme',
    'concurrent:theme',
    'copy:theme',
    'copy:' + cms,
    'cssmin:theme',
    'describe',
    'replace:' + cms
  ]);

  grunt.registerTask('build:static', [
    'clean:static',
    'concurrent:static',
    'copy:static',
    'cssmin:static'
  ]);

  // TODO: npm module that performs this task
  grunt.registerTask('describe', 'Describes current git commit', function (prop) {

    var done = this.async();

    grunt.log.write('Describe current commit: ');

    grunt.util.spawn({
      cmd: 'git',
      args: [ 'describe', '--tags', '--abbrev=0', '--match', '[0-9]*' ]
    }, function (err, result) {

      var latestVersion = err ? '0.0.0' : result.toString().trim();

      grunt.util.spawn({
        cmd : 'git',
        args : [ 'describe', '--tags', '--abbrev=0', '--exact-match', 'HEAD' ]
      }, function (err, result) {

        if (err || latestVersion !== result) {
          latestVersion = latestVersion + '_dev';
        }

        grunt.util.spawn({
          cmd : 'git',
          args : [ 'diff', '--shortstat' ]
        }, function (err, result) {
          if (err) {
            grunt.log.error(err);
            return done(false);
          }

          if ( result.toString().trim().length ) {
            latestVersion = latestVersion + '_local';
          }

          grunt.config(prop || 'meta-version', latestVersion);

          grunt.log.ok(latestVersion);

          done( latestVersion );

        });

      });

    });

  });

  grunt.registerTask('default', [
    'build'
  ]);

};
