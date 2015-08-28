// JavaScript source code
/// <reference path="http://code.jquery.com/jquery-2.1.4.min.js" />
/// <reference path="https://code.angularjs.org/1.3.17/angular.js" />

var app = angular.module("App", ['ngRoute']);

app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.when('/signin', {
          templateUrl: 'Partials/login.html',
          controller: 'LoginController',
      }).when('/home', {
          templateUrl: 'Partials/home.html',
          controller: 'HomeController',
      }).when('/guestbook', {
          templateUrl: 'Partials/guest.html',
          controller: 'GuestbookController',
      }).otherwise({
          redirectTo: '/signin'
      });
  }]);

app.factory('UserFactory', function () {
    var userName;

    return {
        SetUser: function (name) {
            userName = name;
        },
        GetUser: function () {
            return userName;
        }
    }
});

app.controller('LoginController', function ($http, $location, $timeout, $scope, UserFactory) {

    $scope.signinMessage = null;
    $scope.isUsernameEmpty = false;
    $scope.showSigninMessage = false;

    $scope.HideUsernameHelpBlock = function () {
        $scope.isUsernameEmpty = false;
    }

    $scope.HidePasswordHelpBlock = function () {
        $scope.isPasswordEmpty = false;
    }

    $scope.ValidateUser = function () {
        if ($scope.userName === null || $scope.userName == "" || $scope.userName === undefined)
            $scope.isUsernameEmpty = true;

        if ($scope.password === null || $scope.password == "" || $scope.password === undefined) {
            $scope.isPasswordEmpty = true;
            return;
        } else {
            $('#signin-message').show();
            $scope.signinMessage = "Authorizing, please wait...";

            $http.post('http://localhost:8888/login', { "user": $scope.userName, "password": $scope.password }).then(function (response) {
                $scope.signinMessage = "Authorized... Welcome!";
                UserFactory.SetUser($scope.userName);

                $timeout(function () {
                    $location.path('/home');
                }, 1000, true);

            }, function (response) {
                $scope.signinMessage = "Unable to authorize. Please check your credentials";
            });
        }
    }
});

app.controller('HomeController', function ($scope, $http, $location, UserFactory) {
    $scope.validating = true;
    $scope.userName = UserFactory.GetUser();

    if ($scope.userName === null || $scope.userName === undefined) {
        $location.path('/login');
    } else {
        $scope.validating = false;
        $http.get('http://localhost:8888/states/abbreviations').then(
            function (response) {
                $scope.onError = false;
                $scope.stateInitials = response.data;
                $scope.ShowState('AL');

            }, function () {
                $scope.onError = true;
            });
    }

    $scope.GetButtonClass = function (i) {
        i++;
        return GetButtonClassBasedOnIndex(i);
    };

    $scope.ShowState = function (abr) {

        var url = "http://localhost:8888/states/" + abr;

        $http.get(url).then(
            function (response) {
                $scope.onError = false;
                $scope.stateAbbreviation = response.data.abbreviation;
                $scope.stateName = response.data.name;
                $scope.stateCapital = response.data.capital;
                $scope.stateCity = response.data['most-populous-city'];
                $scope.statePopulation = response.data.population;
                $scope.stateExtension = response.data['square-miles'];
                $scope.stateTimeZone1 = response.data['time-zone-1'];
                $scope.stateTimeZone2 = response.data['time-zone-2'] === "" ? null : ' and ' + response.data['time-zone-2'];
                $scope.stateDST = response.data.dst;

            }, function () {
                $scope.onError = true;
            });
    };

    $scope.logout = function () {
        UserFactory.SetUser(undefined);
        $http.get('http://localhost:8888/logout').then(function () {
            $location.path('/login');
        });
    }

});

app.controller('GuestbookController', function ($scope, $http, UserFactory, $location, $route) {
    $scope.validating = true;
    $scope.isInvalidePhone = false;
    $scope.userName = UserFactory.GetUser();

    if ($scope.userName === null || $scope.userName === undefined) {
        $location.path('/login');
    } else {
        $scope.validating = false;
        $http.get('http://localhost:8888/read').then(
            function (response) {
                $scope.onError = false;
                $scope.messages = response.data;
            }, function () {
                $scope.onError = true;
            });
    }

    $scope.PostMessage = function () {
        if ($scope.phoneOnPost !== undefined && $scope.messageOnPost !== undefined) {
            if (IsValidPhone($scope.phoneOnPost)) {
                var message = {};
                message.phone = $scope.phoneOnPost;
                message.message = $scope.messageOnPost;

                $http.post('http://localhost:8888/write', message).then(function () {
                    $route.reload('/guestbook');
                }, function () {
                    $scope.onError = true;
                });
            } else {
                $scope.isInvalidePhone = true;
            }
        }
    }

    $scope.logout = function () {
        UserFactory.SetUser(undefined);
        $http.get('http://localhost:8888/logout').then(function () {
            $location.path('/login');
        });
    }

});

function GetButtonClassBasedOnIndex(index) {

    var className;

    if (index > 6)
        index = index % 6;
    if (index == 0)
        index = 6;

    switch (index) {
        case 1:
            className = "btn-default";
            break;
        case 2:
            className = "btn-primary";
            break;
        case 3:
            className = "btn-success";
            break;
        case 4:
            className = "btn-info";
            break;
        case 5:
            className = "btn-warning";
            break;
        case 6:
            className = "btn-danger";
            break;
    }

    return className;
}

function IsValidPhone(txt) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (txt.match(phoneno)) {
        return true;
    }
    else {

        return false;
    }
}
