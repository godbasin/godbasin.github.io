'use strict';

describe('Controller: IndexCtrl', function () {

  // load the controller's module
  beforeEach(module('angularTestApp'));

  var IndexCtrl, scope, rootscope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IndexCtrl = $controller('IndexCtrl', {
      $scope: scope
    });
  }));

  it('should have no username and password', function () {
    expect(scope.loading).toBe('init');
    expect(scope.asidemenus.length).toBe(4);
  });
  
  it('should load photo', function () {
  	expect(scope.avatar).toBeUndefined();
    scope.loadphoto('123');
    expect(scope.avatar.length).toBe(3);
  });
});
