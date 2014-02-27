module.exports = function (grunt) {

	var task = grunt.task;

    grunt.initConfig({
        pkg: grunt.file.readJSON('abc.json'),

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> ' +
            '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %> */ \n',

        clean: {
            build: {
                src: 'build/*'
            },
            cache: {
                src: 'cache/*'
            }
        },

        kmc: {
            options: {
                comboOnly: false,
                fixModuleName: true,
                comboMap: false,
                depFilePath: '../map.js',
                packages: [
                    {
                        name: '<%= pkg.name %>',
                        path: './cache/',
                        charset: 'utf-8',
                        ignorePackageNameInUri:true
                    }
                ]
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'cache/',
                        src: ['*/*.js'],
                        dest: 'build/'
                    }
                ]
            }
        },

        copy: {
             main: {
                files: [
                    {
                        expand:true,
                        cwd:'src/',
                        src: ['**/*.js'], 
                        dest: 'cache/'
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                beautify: {
                    ascii_only: true
                }
            },
            base: {
                files: {
                    'build/pages/index-min.js': ['build/pages/index.js']
                }
            }
        }
    });
    

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-kmc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    return grunt.registerTask('default', 'grunt任务', function(type) {
        task.run(['clean:build','clean:cache','copy', 'kmc', 'uglify']);
    });
};