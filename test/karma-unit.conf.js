module.exports = function(config) {
  config.set({
    files : [
      'app/components/jquery/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-resource/resource.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/components/google-jsapi/google-jsapi.js',
      'app/components/moment/moment.js',
      'app/scripts/homePage.js',
      'app/scripts/app.js',
      'test/unit/**/*.js',
      'app/templates/*.html'
    ],
    preprocessors: {
      'app/templates/*.html': 'ng-html2js'
    },
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
