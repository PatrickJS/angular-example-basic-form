angular.module('fake-server', [
  'ngMockE2E'
])
.run(function($httpBackend) {
  $httpBackend.whenPOST('/api/signup')
  .respond(function(method, url, data) {
     console.log('Success Signup');
     return [200, {success: true}, {}];
  });
})    
