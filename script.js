angular.module('App', [
  'ngMessages',
  'fake-server'// ignore me 
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
  }

  $scope.submit = function(user, form) {
    $scope.loading = true;
    Auth.signup(user)
    .then(function(data) {
      $scope.reset(form);
      console.log('User Login', user);
      // don't use alerts bro
      $window.alert(user.name + 'thank you for signning up')
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
    }
  };
})
.directive('matchPassword', function() {
  // this is my module angular-password
  // https://github.com/gdi2290/angular-password
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
