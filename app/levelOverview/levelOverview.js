'use strict';

angular.module('myApp.levelOverview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/levelOverview', {
    templateUrl: 'levelOverview/levelOverview.html',
    controller: 'levelOverviewCtrl'
  });
}])

.controller('levelOverviewCtrl', [function($scope) {

}]);