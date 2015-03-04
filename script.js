// Code goes here
angular.module('App', ['ngMessages'])
  .controller('LoginController', function($scope, Auth, $window) {

    $scope.loading = false;
    $scope.user = {
      email: null,
      password: null
    };
    
    $scope.reset = function(form) {
      $scope.user = {
        email: null,
        password: null
      };
      $scope.confirmPassword = null
      form.$setPristine();
      form.$setUntouched();
      // form reset hacks
      form.$valid = true;
      form.$invalid = false;
      form.$error = {};
      $scope.loading = false;
    }

    $scope.submit = function(user, form) {
      $scope.loading = true;
      Auth.signup(user)
      .then(function(data) {
        console.log('User Login', user);
        // redirect etc
        // $state.go('app.home')
      })
      .catch(function(err) {
        $window.alert(err);
      })
      .finally(function() {
        $scope.reset(form);
      });
    };

  })
  .factory('Auth', function($q, $http) {
    var authenticated = false;
    return {
      isAuthenticated: function() {
        return authenticated;
      },
      signup: function(user) {
        return $http.post('/api/signup', {
          email: user.email,
          password: user.password
        })
        .then(function(res) {
          // do something here
          authenticated = true;
          return res.data;
        })
        .catch(function(res) {
          throw res.data;
        });
      }
    };
  })
  .directive('matchPassword', function() {
    return {
      restrict: 'A',
      require: ['^ngModel', '^form'],
      link: function(scope, element, attrs, ctrls) {
        var formController = ctrls[1];
        var ngModel = ctrls[0];
        var otherPasswordModel = formController[attrs.matchPassword];
    
        ngModel.$validators.passwordMatch = function(modelValue) {
          return (modelValue === otherPasswordModel.$modelValue);
        };

      } // end link
    }; // end return
  });
