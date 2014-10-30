module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
		  // define the files to lint
		  files: ['Gruntfile.js', 'www/**/*.js', 'test/**/*.js'],
		  // configure JSHint (documented at http://www.jshint.com/docs/)
		  options: {
		      // more options here if you want to override JSHint defaults
		      globals: {
		      	angular: true,
		      	console: true,
		      	module: true
		      }
		  }
		},
		watch: {
		  files: ['<%= jshint.files %>'],
		  tasks: ['jshint', 'qunit']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['jshint', 'qunit']);

  	grunt.registerTask('default', ['jshint', 'qunit']);

};