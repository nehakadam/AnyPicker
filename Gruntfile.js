module.exports = function(grunt)
{
	var sBanner = '/* ----------------------------------------------------------------------------- ' +
	'\n\n  AnyPicker - Customizable Picker for Mobile OS' +
	'\n  Version <%= pkg.version %>' + 
	'\n  Copyright (c)<%= grunt.template.today("yyyy") %> Curious Solutions LLP' +
	'\n  https://curioussolutions.in/libraries/anypicker/content/license.htm' +
	'\n  See License Information in LICENSE file.' +
	'\n\n ----------------------------------------------------------------------------- */\n\n';

	var sJSHeader = sBanner + "(function () {\n\n    \"use strict\";\n\n",
	sJSFooter = "\n\n}());\n\n",

	sArrFileSource = [
				'src/anypicker-core.js',
		      	'src/anypicker-pickercomponent.js',
		      	'src/anypicker-select.js',
		      	'src/anypicker-datetime.js'], 
	sArrCustomFileSource = [];

	grunt.initConfig(
	{

		pkg: grunt.file.readJSON('package.json'),

		concat: 
		{
			options: 
			{
		      	separator: '\n\n\n\n',
		      	stripBanners: true
		    },
		
		    basejs: 
		    {
		      	src: sArrFileSource,
		      	dest: 'src/anypicker.js',
		    
		      	options: 
				{
					nonull: true,
					banner: sJSHeader,
					footer: sJSFooter
				}
		    },

		    basecss: 
		    {
		      	src: ['src/anypicker-core.css', 'src/anypicker-pickercomponent.css'],
		      	dest: 'src/anypicker.css',
		      	
		      	options: 
				{
					nonull: true,
					banner: sBanner
				}
		    },

		    allcss: 
		    {
		      	src: ['src/anypicker-core.css', 'src/anypicker-pickercomponent.css', 'src/anypicker-ios.css', 'src/anypicker-android.css', 'src/anypicker-windows.css', 'src/anypicker-font.css'],
		      	dest: 'src/anypicker-all.css',
		      	
		      	options: 
				{
					nonull: true,
					banner: sBanner
				}
		    },

		    CustomConcat: 
		    {
		      	src: sArrCustomFileSource,
		      	dest: 'src/anypicker-custom.js',
		    
		      	options: 
				{
					nonull: true,
					banner: sJSHeader,
					footer: sJSFooter
				}
		    },

		    lang: 
		    {
		      	src: ['src/i18n/*', '!src/i18n/anypicker-i18n.js'],
		      	dest: 'src/i18n/anypicker-i18n.js',

		      	options: 
				{
					nonull: true,
					banner: sBanner
				}
		    }
		},

		copy: 
		{
		  	main: 
		  	{
		    	expand: true,
		    	cwd: 'src/',
		    	src: '**',
		    	dest: 'dist'
		  	},
		  	
		  	lang: 
		  	{
		    	expand: true,
		    	cwd: 'src/i18n',
		    	src: '**',
		    	dest: 'dist/i18n'
		  	}
		},

		uglify: 
		{
			options: 
			{
				banner: sBanner,
				mangle: true
			},

			build: 
			{
				src: 'src/anypicker.js',
				dest: 'dist/anypicker.min.js',
				nonull: true
			},

			CustomUglify: 
			{
		      	src: 'src/anypicker-custom.js',
		      	dest: 'src/anypicker-custom.min.js',
		      	nonull: true
		    }
		},
		
		cssmin: 
		{
			options: 
			{
				banner: sBanner
			},

			basecss: 
			{
				src: 'src/anypicker.css',
				dest: 'dist/anypicker.min.css',
				nonull: true
    		},

    		allcss: 
			{
				src: 'src/anypicker-all.css',
				dest: 'dist/anypicker-all.min.css',
				nonull: true
    		}
		},

		watch: 
		{
			scripts: 
			{
				files: ['src/*.js', 'src/*.css'],
				tasks: ['default']
			}
		},

		jshint: 
		{
			core: 'src/anypicker-core.js',
			pickercomp: 'src/anypicker-pickercomponent.js',
			datetime: 'src/anypicker-datetime.js',
			select: 'src/anypicker-select.js',

			main: ['src/anypicker.js'],

			options:
			{
				strict: false,

				curly: false,
			
      			eqeqeq: true,
      			eqnull: true,
      			browser: true,
				devel: true,
				//unused: true,
				//undef: true,
			
				globals: 
				{
					$: false,
        			jQuery: false,
        			define: false,
        			require: false,
        			module: false,
        			AnyPicker: true
      			},

      			force: true
			}
		},

		csslint:
		{
			core: 'src/anypicker-core.css',
			pickercomp: 'src/anypicker-pickercomponent.css',
			ios: 'src/anypicker-ios.css',
			android: 'src/anypicker-android.css',
			windows: 'src/anypicker-windows.css',

			main: ['src/anypicker.css'],

			options:
			{
				"adjoining-classes": false,
				"important": false,
				"universal-selector": false,
				"box-sizing": false,
				"box-model": false,
				"overqualified-elements": false,
				"known-properties": false,
				"fallback-colors": false,
				"font-sizes": false,
				"floats": false,
				"display-property-grouping": false,

				"unqualified-attributes": false,
				"ids": false,
				"vendor-prefix": false,
				"regex-selectors": false				
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
 	grunt.loadNpmTasks('grunt-contrib-copy'); 	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.registerTask('common', ['copy', 'uglify', 'cssmin:basecss', 'cssmin:allcss']);

  	grunt.registerTask('default', ['concat:basejs', 'concat:basecss', 'concat:allcss', 'common']);

  	grunt.registerTask('CustomConcat', ['concat:CustomConcat', 'uglify:CustomUglify', 'common']);

  	grunt.registerTask('UpdateLanguages', ['concat:lang', 'copy:lang']);

  	grunt.registerTask('AnyPickerJSConcat', function()
	{
		var sViewBannerText = "\n You can use following Modes with AnyPicker Custom File - \n";

		sArrCustomFileSource.push(sArrFileSource[0]);
		sArrCustomFileSource.push(sArrFileSource[1]);

		grunt.log.writeln("Input Modes");
		grunt.log.writeln(this.args);
	
		for(var iTempIndex = 0; iTempIndex < this.args.length; iTempIndex++)
		{
			var sModeName = this.args[iTempIndex];

			if(sViewName === "Select")
			{
				sViewBannerText += "Select \n";
				addFileToCustomArray(sArrFileSource[2]);
			}
			else if(sViewName === "DateTime")
			{
				sViewBannerText += "DateTime \n";
				addFileToCustomArray(sArrFileSource[3]);
			}
		}

		grunt.log.writeln(sViewBannerText);

		grunt.task.run('CustomConcat');
	});

	function addFileToCustomArray(sFileName)
	{
		for(iTempIndex = 0; iTempIndex < sArrCustomFileSource.length; iTempIndex++)
		{
			if(sArrCustomFileSource[iTempIndex] === sFileName)
				return true;
		}
		sArrCustomFileSource.push(sFileName);
		return true;
	}

	grunt.registerTask('lint', ['jshint:main', 'csslint:main']);

};