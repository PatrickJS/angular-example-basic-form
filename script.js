angular.module('App', [
  'ngMessages',
  'fake-server'  // ignore me 
])
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
    form.$valid = true;
    form.$invalid = false;
    form.$error = {};
  };

  $scope.submit = function(user, form) {
    $scope.loading = true;
    Auth.signup(user)
    .then(function(data) {
      $scope.reset(form);
      console.log('User Login', user);
      // redirect etc
      // $state.go('app.home')
    })
    .catch(function(err) {
      $window.alert(err);
    })
    .finally(function() {
      $scope.loading = false;
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
    } // end return
  }; // end return

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
})
.directive('validatePasswordCharacters', function() {

  var REQUIRED_PATTERNS = [
    /\d+/,    //numeric values
    /[a-z]+/, //lowercase values
    /[A-Z]+/, //uppercase values
    /\W+/,    //special characters
    /^\S+$/   //no whitespace allowed
  ];

  return {
    require : 'ngModel',
    link : function($scope, element, attrs, ngModel) {
      ngModel.$validators.passwordCharacters = function(value) {
        var status = true;
        angular.forEach(REQUIRED_PATTERNS, function(pattern) {
          status = status && pattern.test(value);
        });
        return status;
      }; 
    } // end link
  }; // end return

})
.directive('uniqueEmail', function($http, $q) {
  return {
    require : 'ngModel',
    link : function($scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.uniqueEmail = function(modelValue, viewValue) {
        var email = modelValue || viewValue;
        return $http.post('/api/unique-email', {email: email}).then(function(res) {
          if (res.data.exists) {
            return $q.reject();
          }
          return $q.when();
        });
      }; // end async
    } // end link
  }; // end return 

});
