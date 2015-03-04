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
