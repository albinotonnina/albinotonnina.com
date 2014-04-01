// Generated on 2014-03-22 using generator-webapp 0.4.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // pkg: grunt.file.read('package.json'),
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> by <%= pkg.author.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://<%= pkg.homepage %>/\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            '<%= pkg.author.name %>; Licensed MIT */',

        htmlbanner: '<!-- \nHello, interested visitor!\n' +
            'Why don\'t you check the source code of this site on GitHub?\n' +
            'I used several great tools like Yeoman, Bower and Grunt.\n' +
            'Hope you like it :)\n' +
            '<%= pkg.name %> by <%= pkg.author.name %>. v<%= pkg.version %> - built on <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* <%= pkg.homepage %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            '<%= pkg.author.name %>; Licensed MIT \n-->',

        // Project settings
        config: {
            // Configurable paths
            app: 'app',
            dist: 'dist'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {

            js: {
                files: ['src/{,*/}*.js'],
                tasks: ['concat:js'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles']
            },
            svg: {
                files: 'src/svg/*/*.svg',
                tasks: ['replace']
            },
            sass: {
                files: 'src/svg/*/*.scss',
                tasks: ['concat:css','sass:dev']
            },            
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= config.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= config.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },



        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/scripts/lib.js',
                        '<%= config.dist %>/styles/main.css',
                        '<%= config.dist %>/images/*.*',
                        '<%= config.dist %>/styles/fonts/{,*/}*.*',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },
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
                    cwd: '<%= config.app %>/svg',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/svg'
                }]
            }
        },
        usebanner: {
            html: {
                options: {
                    position: 'top',
                    banner: '<%= htmlbanner %>'
                },
                files: {
                    src: '<%= config.dist %>/index.html'
                }
            },
            other: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['<%= config.dist %>/scripts/*.js', '<%= config.dist %>/styles/*.css']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= config.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: [{
                    '<%= config.dist %>/scripts/skrollr.js': [
                        '<%= config.dist %>/scripts/skrollr.js'
                    ]
                }, {
                    '<%= config.dist %>/scripts/lib.js': [
                        '<%= config.dist %>/scripts/lib.js'
                    ]
                }]
            }
        },
        concat: {
            css: {
                src: ['src/svg/animation.scss', 'src/svg/*/animation.scss'],
                dest: 'tmp/animation.scss'
            },
            js: {
                src: ['<%= config.app %>/bower_components/jquery/dist/jquery.js', 'src/libs/jquery.scrolldepth.min.js', '<%= config.app %>/bower_components/async/lib/async.js', '<%= config.app %>/bower_components/move.js/move.min.js', 'src/site.js', 'src/svg/*/animation.js'],
                dest: '<%= config.app %>/scripts/lib.js'
            },
            skrollr: {
                src: ['<%= config.app %>/bower_components/skrollr-stylesheets/dist/skrollr.stylesheets.min.js', '<%= config.app %>/bower_components/bower-skrollr/skrollr.min.js', 'src/libs/skrollr.menu.min.js', '<%= config.app %>/bower_components/skrollr-ie/dis/skrollr.ie.min.js', 'src/libs/skrollr.helpers.js'],
                dest: '<%= config.app %>/scripts/skrollr.js'
            }
        },
        sass: {
            dist: {
                files: {
                    '<%= config.dist %>/styles/animation.css': 'tmp/animation.scss'
                }
            },
            dev: {
                files: {
                    '<%= config.app %>/styles/animation.css': 'tmp/animation.scss'
                }
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        'scripts/*.js',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*'
                    ]
                }, {
                    src: 'src/svg/timing.json',
                    dest: '<%= config.app %>/svg/timing.json',
                    flatten: true,
                    filter: 'isFile'
                }, {
                    src: 'src/svg/timing.json',
                    dest: '<%= config.dist %>/svg/timing.json',
                    flatten: true,
                    filter: 'isFile'
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },


        replace: {

            svgfonts1: {
                src: ['src/svg/scene1/scene.svg'],
                dest: '<%= config.app %>/svg/scene1/',
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
                dest: '<%= config.app %>/svg/scene2/',
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
                dest: '<%= config.app %>/svg/scene3/',
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
                dest: '<%= config.app %>/svg/scene4/',
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
                dest: '<%= config.app %>/svg/scene5/',
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
                dest: '<%= config.app %>/svg/menu/',
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



        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr: {
            devFile: '<%= config.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
            files: [
                '<%= config.dist %>/scripts/{,*/}*.js',
                '<%= config.dist %>/styles/{,*/}*.css',
                '!<%= config.dist %>/scripts/vendor/*'
            ],
            uglify: true
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'svgmin'
            ]
        }
    });


    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',

            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function(target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test'
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'replace',
        'useminPrepare',
        'concurrent:dist',
        'imagemin',
        'concat',
        'sass',
        'copy:dist',
        'modernizr',
        'uglify',
        'rev',
        'usemin',
        'cssmin',
        //'htmlmin',
        'usebanner'

    ]);

    grunt.registerTask('default', [

        //'newer:jshint',
        'test',
        'build'
    ]);
};