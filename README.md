# angular-example-basic-form
An AngularJS example for a basic signup form example 

```html
<!DOCTYPE html>
<html ng-app="App">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-messages.js"></script>
  <script src="script.js"></script>
</head>
<body ng-controller="LoginController">
  
<form autocomplete="off" novalidate
  name="userForm" 
  ng-submit="userForm.$valid && submit(user, userForm)"
  ng-disabled="loading"
>
  <fieldset>
    <legend>
      <label>
        Sign Up Free
      </label>
    </legend>
    
    <p>
      <label>
        Email:
        <input type="text" 
          name="email"
          ng-model="user.email"
          required>
      </label>
      <div ng-if="userForm.$submitted && userForm.email.$touched"
           ng-messages="userForm.email.$error">
        <div ng-message="required">You did not enter your email address</div>
      </div>    
    </p>

    <p>
      <label>
        Password:
        <input type="password"
          name="password"
          ng-model="user.password"
          ng-minlength="6"
          required>
      </label>
      <div ng-if="userForm.$submitted && userForm.password.$touched"
           ng-messages="userForm.password.$error">
        <div ng-message="required">You did not enter your password</div>
        <div ng-message="minlength">Your password is too short</div>
      </div>
    </p>
      
    <p>
      <label>
        Confirm Password:
        <input type="password"
          name="confirmPassword" 
          ng-model="confirmPassword"
          match-password="password"
          required>
      </label>
      <div ng-if="userForm.$submitted && userForm.confirmPassword.$touched"
           ng-messages="userForm.confirmPassword.$error"
           ng-messages-multiple>
        <div ng-message="required">You did not enter a confirmation password</div>
        <div ng-message="passwordMatch">Your two passwords did not match</div>
      </div>
    </p>
    
    <button type="submit" ng-disabled="loading">
      Signup
    </button>
    <input type="reset" ng-click="reset(userForm)" value="Reset">
      
  </fieldset>
</form>
 

</body>

</html>

```

```javascript
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
```
