'use strict';

angular.module('myApp.mainMenu', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/mainMenu', {
            templateUrl: 'mainMenu/mainMenu.html',
            controller: 'mainMenuCtrl'
        });
    }])

    .controller('mainMenuCtrl', ['$scope', function ($scope) {
        $scope.hello = "hello!";
    }])

    .directive('dragMe', function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.draggable();
            }
        };
    });