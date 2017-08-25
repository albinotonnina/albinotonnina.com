'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    grunt.initConfig({

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

        config: {
            // Configurable paths
            app: 'app',
            dist: 'dist',
            tmp: '.tmp'
        },

        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['babel', 'browserify'],
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
                tasks: ['replace'],
                options: {
                    livereload: true
                }
            },
            json: {
                files: 'src/svg/*.json',
                tasks: ['copy:dist']
            },
            sass: {
                files: ['src/svg/*/*.scss', 'src/*/*.scss'],
                tasks: ['concat:css', 'sass:dev', 'sass:styles'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: 'src/svg/*/*.html',
                tasks: ['copy:html']
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

        connect: {
            options: {
                port: 3000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
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
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

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

        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/scripts/lib.js',
                        '<%= config.dist %>/styles/main.css',
                        '<%= config.dist %>/styles/fonts/{,*/}*.*',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },

        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/index.html'
        },

        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

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
                dest: '.tmp/animation.scss'
            },
            skrollr: {
                src: ['node_modules/skrollr-stylesheets/dist/skrollr.stylesheets.min.js', 'node_modules/skrollr/dist/skrollr.min.js', 'src/libs/skrollr.menu.min.js'],
                dest: '<%= config.app %>/scripts/skrollr.js'
            }
        },

        sass: {
            dist: {
                files: {
                    '<%= config.dist %>/styles/animation.css': '.tmp/animation.scss'
                }
            },
            dev: {
                files: {
                    '<%= config.app %>/styles/animation.css': '.tmp/animation.scss'
                }
            },
            styles: {
                files: {
                    '<%= config.app %>/styles/main.css': 'src/styles/main.scss'
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            '*.{ico,png,jpg,txt}',
                            'images/**/*.svg',
                            'svg/{,*/}*.html',
                            'scripts/*.js',
                            '{,*/}*.html',
                            'styles/fonts/{,*/}*.*'
                        ]
                    }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            html: {
                expand: true,
                dot: true,
                cwd: 'src/svg',
                dest: '<%= config.app %>/svg/',
                src: '{,*/}*.html'
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
                src: ['src/svg/scene6/scene.svg'],
                dest: '<%= config.app %>/svg/scene6/',
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
                    from: '../../../app/images/invincible.jpg',
                    to: 'images/invincible.jpg'
                }, {
                    from: '../../../app/images/157evxw_th.gif',
                    to: 'images/157evxw_th.gif'
                }]
            },
            svgfonts7: {
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

        modernizr: {
            dist: {
                cache: true,
                devFile : false,
                dest: '<%= config.app %>/scripts/vendor/modernizr.js',
                tests: [
                    'svgclippaths',
                    'inlinesvg'
                ],
                crawl: false,
                uglify: false
            }

        },

        babel: {
            options: {
                sourceMap: true,
                presets: [[
                    'env', {
                        debug: true,
                        targets: {
                            browsers: ['last 2 versions', 'safari >= 7']
                        }
                    }
                ]]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: '**/*.js',
                        dest: '.tmp/'
                    }
                ]
            }
        },

        browserify: {
            dist: {
                src: ['.tmp/scripts/index.js'],
                dest: '<%= config.app %>/scripts/lib.js'
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'copy:styles',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'replace',
        'useminPrepare',
        'copy:styles',
        'svgmin',
        'imagemin',
        'babel',
        'browserify',
        'concat',
        'sass',
        'modernizr',
        'copy:dist',
        'copy:html',
        'uglify',
        'rev',
        'usemin',
        'cssmin',
        'usebanner'
    ]);

};
