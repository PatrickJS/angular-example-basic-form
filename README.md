# angular-example-basic-form
An AngularJS example for a basic signup form example 

```html
<!DOCTYPE html>
<html ng-app="App">
<head>
  <title>angular-example-basic-form</title>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-messages.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-mocks.js"></script>
  <script src="fake-server.js"></script>
  <script src="script.js"></script>

</head>
<body ng-controller="LoginController">
<h1>angular-example-basic-form</h1>
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
        <input type="email" 
          name="userEmail"
          ng-model="user.email"
          ng-model-options="{
            updateOn: 'default blur',
            debounce: {
              'default': 500,
              'blur': 0
            }
          }"
          unique-email
          autofocus
          required>
        <small ng-show="userForm.userEmail.$pending.uniqueEmail">Valliding Email...</small>
      </label>
      <div ng-if="userForm.$submitted && userForm.userEmail.$touched"
           ng-messages="userForm.userEmail.$error"
           ng-messages-multiple>
        <div ng-message="required">You did not enter your email address</div>
        <div ng-message="email">You did not enter a valid email address</div>
        <div ng-message="uniqueEmail">Your email address is already taken</div>
      </div>
    </p>

    <p>
      <label>
        Password:
        <input type="password"
          name="userPassword"
          ng-model="user.password"
          ng-minlength="6"
          validate-password-characters
          required>
      </label>
      <div ng-if="userForm.$submitted && userForm.userPassword.$touched"
           ng-messages="userForm.userPassword.$error"
           ng-messages-multiple>
        <div ng-message="required">You did not enter your password</div>
        <div ng-message="minlength">Your password is too short</div>
        <div ng-message="passwordCharacters">Please use valid password characters</div>
      </div>
    </p>
      
    <p>
      <label>
        Confirm Password:
        <input type="password"
          name="confirmPassword" 
          ng-model="confirmPassword"
          match-password="userPassword"
          validate-password-characters
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
<br>
<center>		
  Example Built by <a href="https://twitter.com/gdi2290">@gdi2290</a>		
</center>		
<a href="https://github.com/gdi2290/angular-example-basic-form"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>

</body>
</html>

```

```javascript
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
      $window.alert('Thanks you ' + user.email + ' for signing up');
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
  
      ngModel.$validators.passwordMatch = function(modelValue, viewValue) {
        var password = modelValue || viewValue;
        var otherPassword = otherPasswordModel.$modelValue || otherPasswordModel.viewValue;
        return password === otherPassword;
      };

    } // end link
  }; // end return
})
.directive('validatePasswordCharacters', function() {

  var REQUIRED_PATTERNS = [
    // /\d+/,    //numeric values
    // /[a-z]+/, //lowercase values
    // /[A-Z]+/, //uppercase values
    // /\W+/,    //special characters
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
```
