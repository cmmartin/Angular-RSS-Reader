module.exports = function(config) {
  config.set({
    files : [
      'app/components/jquery/jquery.js',
      'app/components/angular/angular.js',
      'app/components/angular-route/angular-route.js',
      'app/components/angular-animate/angular-animate.js',
      'app/components/angular-resource/resource.js',
      'app/components/angular-mocks/angular-mocks.js',
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
