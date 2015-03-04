angular.module('fake-server', [
  'ngMockE2E'
])
.config(function($provide) {
  // Fake Delay
  $provide.decorator('$httpBackend', function($delegate) {
    var proxy = function(method, url, data, callback, headers) {
      var interceptor = function() {
        var _this = this;
        var _arguments = arguments;
        setTimeout(function() {
          callback.apply(_this, _arguments);
        }, 888);
      };
      return $delegate.call(this, method, url, data, interceptor, headers);
    };
    for(var key in $delegate) {
      proxy[key] = $delegate[key];
    }
    return proxy;
  });
})
.run(function($httpBackend) {
  $httpBackend.whenPOST('/api/signup')
  .respond(function(method, url, res) {
     console.log('Success Signup');
     return [200, {success: true}, {}];
  });
  
  $httpBackend.whenPOST('/api/unique-email')
  .respond(function(method, url, res) {
    var data = angular.fromJson(res);
    
    if (data.email === 'github@gdi2290.com') {
      console.log('Not Unique Email', data);
      return [200, {exists: true}, {}];  
    } else {
      console.log('Unique Email', data);
      return [200, {exists: false}, {}];
    }     
  });  
})    
