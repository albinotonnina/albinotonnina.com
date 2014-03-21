module.exports = function(grunt) {
  grunt.initConfig({
    svgmin: {
      options: {
        plugins: [{
          removeViewBox: false
        }, {
          removeUselessStrokeAndFill: false
        }, {
          removeEmptyAttrs: false
        }, {
          cleanupIDs: false
        }, {
          convertShapeToPath: false
        }]
      },
      dist: {
        files: [{
          expand: true,
          src: ['svg/*/scene.svg'],
          dest: 'build/',
          ext: '.min.svg'
        }]
      }
    },
    uglify: {
      js: {
        files: [{
          expand: true,
          cwd: 'tmp/js',
          src: '**/*.js',
          dest: 'build/js',
          ext: '.min.js'
        }]
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['styles.css'],
        dest: 'build/css/',
        ext: '.css'
      }
    },
    replace: {
      js: {
        src: ['js/*.js'],
        dest: 'tmp/js/',
        replacements: [{
          from: 'skrollr.js',
          to: 'skrollr.min.js'
        }, {
          from: 'scene.svg',
          to: 'scene.min.svg'
        }, {
          from: 'Foo',
          to: function(matchedWord) {
            return matchedWord + ' Bar';
          }
        }]
      },
      html: {
        src: ['index.html'],
        dest: 'build/',
        replacements: [{
          from: 'lib.js',
          to: 'lib.min.js'
        }]
      },
      json: {
        src: ['src/svg/timing.json'],
        dest: 'build/svg/',
        replacements: [{
          from: '',
          to: ''
        }]
      },
      svgfonts1: {
        src: ['src/svg/scene1/scene.svg'],
        dest: 'svg/scene1/',
        replacements: [{
          from: 'font-family="\'Roboto-Thin\'"',
          to: 'font-weight="100"'
        }, {
          from: 'font-family="\'Roboto-Light\'"',
          to: 'font-weight="300"'
        }, {
          from: 'font-family="\'Roboto-Black\'"',
          to: 'font-weight="900"'
        }, {
          from: 'font-family="\'Roboto-Bold\'"',
          to: 'font-weight="900"'
        }, {
          from: 'font-family="\'Roboto-Regular\'"',
          to: 'font-weight="400"'
        }]
      },
      svgfonts2: {
        src: ['src/svg/scene2/scene.svg'],
        dest: 'svg/scene2/',
        replacements: [{
          from: 'font-family="\'Roboto-Thin\'"',
          to: 'font-weight="100"'
        }, {
          from: 'font-family="\'Roboto-Light\'"',
          to: 'font-weight="300"'
        }, {
          from: 'font-family="\'Roboto-Black\'"',
          to: 'font-weight="900"'
        }, {
          from: 'font-family="\'Roboto-Regular\'"',
          to: 'font-weight="400"'
        }]
      },
      svgfonts3: {
        src: ['src/svg/scene3/scene.svg'],
        dest: 'svg/scene3/',
        replacements: [{
          from: 'font-family="\'Roboto-Thin\'"',
          to: 'font-weight="100"'
        }, {
          from: 'font-family="\'Roboto-Light\'"',
          to: 'font-weight="300"'
        }, {
          from: 'font-family="\'Roboto-Black\'"',
          to: 'font-weight="900"'
        }, {
          from: 'font-family="\'Roboto-Regular\'"',
          to: 'font-weight="400"'
        }, {
          from: 'font-family="\'VT323-Regular\'"',
          to: ''
        }]
      },
      svgfonts4: {
        src: ['src/svg/scene4/scene.svg'],
        dest: 'svg/scene4/',
        replacements: [{
          from: 'font-family="\'Roboto-Thin\'"',
          to: 'font-weight="100"'
        }, {
          from: 'font-family="\'Roboto-Light\'"',
          to: 'font-weight="300"'
        }, {
          from: 'font-family="\'Roboto-Black\'"',
          to: 'font-weight="900"'
        }, {
          from: 'font-family="\'Roboto-Regular\'"',
          to: 'font-weight="400"'
        }]
      },
      svgfonts5: {
        src: ['src/svg/scene5/scene.svg'],
        dest: 'svg/scene5/',
        replacements: [{
          from: 'font-family="\'Roboto-Thin\'"',
          to: 'font-weight="100"'
        }, {
          from: 'font-family="\'Roboto-Light\'"',
          to: 'font-weight="300"'
        }, {
          from: 'font-family="\'Roboto-Black\'"',
          to: 'font-weight="900"'
        }, {
          from: 'font-family="\'Roboto-Regular\'"',
          to: 'font-weight="400"'
        }]
      },
      svgfonts6: {
        src: ['src/svg/menu/scene.svg'],
        dest: 'svg/menu/',
        replacements: [{
          from: 'font-family="\'Roboto-Thin\'"',
          to: 'font-weight="100"'
        }, {
          from: 'font-family="\'Roboto-Light\'"',
          to: 'font-weight="300"'
        }, {
          from: 'font-family="\'Roboto-Black\'"',
          to: 'font-weight="900"'
        }, {
          from: 'font-family="\'Roboto-Regular\'"',
          to: 'font-weight="400"'
        }]
      }
    },
    concat: {
      css: {
        src: ['src/svg/animation.scss', 'src/svg/*/animation.scss'],
        dest: 'tmp/animation.scss'
      },
      js: {
        src: ['src/libs/jquery-2.1.0.min.js', 'src/libs/modernizr.custom.40987.js', 'src/libs/jquery.scrolldepth.min.js','src/libs/async.js', 'src/app.js', 'src/svg/*/animation.js'],
        dest: 'js/lib.js'
      },
      skrollr: {
        src: ['src/libs/skrollr.stylesheets.min.js', 'src/libs/skrollr.min.js', 'src/libs/skrollr.menu.min.js', 'src/libs/skrollr.ie.min.js', 'src/libs/skrollr.helpers.js'],
        dest: 'js/skrollr.js'
      }
    },
    sass: {
      dist: {
        files: {
          'build/css/animation.css': 'tmp/animation.scss'
        }
      },
      dev: {
        files: {
          'css/animation.css': 'tmp/animation.scss'
        }
      }
    },
    copy: {
      timing: {
        src: 'src/svg/timing.json',
        dest: 'svg/timing.json',
        flatten: true,
        filter: 'isFile'
      },
      favicon: {
        src: 'favicon.ico',
        dest: 'build/favicon.ico',
        flatten: true,
        filter: 'isFile'
      },
      normalize: {
        src: 'css/normalize.css',
        dest: 'build/css/normalize.css',
        flatten: true,
        filter: 'isFile'
      },
      move: {
        src: 'src/libs/move.min.js',
        dest: 'js/move.min.js',
        flatten: true,
        filter: 'isFile'
      },
       png: {
        src: 'src/images/clientsplain.png',
        dest: 'images/clientsplain.png',
        flatten: true,
        filter: 'isFile'
      },
      pngbuild: {
        src: 'images/clientsplain.png',
        dest: 'build/images/clientsplain.png',
        flatten: true,
        filter: 'isFile'
      },

    },
    clean: {
      files: 'tmp'
    },
    watch: {
      css: {
        files: ['src/svg/**.scss', 'src/svg/*/*.scss'],
        tasks: ['dev'],
      },
      js: {
        files: ['src/*.js', 'src/svg/*/*.js'],
        tasks: ['dev'],
      },
      svg: {
        files: 'src/svg/*/*.svg',
        tasks: ['dev'],
      },
    },
    devserver: {
      options: {}
    }
  });



  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });


  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-devserver');


  grunt.registerTask('dist', ['dev','concat', 'sass:dist', 'svgmin', 'replace:js', 'replace:html', 'replace:json', 'uglify', 'cssmin', 'copy:favicon', 'copy:normalize', 'copy:pngbuild', 'clean']);
  grunt.registerTask('dev', ['concat', 'replace:svgfonts1', 'replace:svgfonts2', 'replace:svgfonts3', 'replace:svgfonts4', 'replace:svgfonts5', 'replace:svgfonts6', 'sass:dev', 'copy:timing','copy:move','copy:png', 'clean']);
  grunt.registerTask('default', ['dev', 'devserver']);



};