'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('angularTestApp'));

  var LoginCtrl, scope, rootscope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should have no username and password', function () {
    expect(scope.username.length).toBe(0);
    expect(scope.password.length).toBe(0);
  });
});
