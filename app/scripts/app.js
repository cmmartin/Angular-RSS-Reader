angular.module('myApp', ['ngRoute', 'app.homePage'])

  .constant('TPL_PATH', '/Angular-RSS-Reader/templates')

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/',{
      controller : 'HomeCtrl',
      templateUrl : TPL_PATH + '/home.html'
    });
  });