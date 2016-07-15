'use strict';

describe('Directive: appHeader', function () {
  // load the controller's module  
  beforeEach(module('angularTestApp'));
  beforeEach(module('views'));

  var element, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    // Compile a piece of HTML containing the directive
    element =  $compile("<header app-header></header>")(scope);    
    // fire all the watches, so the scope expression 1 will be evaluated
    scope.$digest();
  }));

  it('should contains 1 Godbasin brand', function () {
    // Check that the compiled element contains the templated content
    expect($(element).find('.navbar-brand').length).toEqual(1);
    expect($(element).find('.navbar-brand').text()).toContain("Godbasin");
  });
  
  it('should have 1 navbar-header and 1 navbar-collapse', function () {    
    expect($(element).find('.navbar-header').length).toEqual(1);
    expect($(element).find('.navbar-collapse').length).toEqual(1);
  });
  
  it('should have 2 menus and 1 usermenu', function () {
    expect(scope.menus.length).toEqual(2);
    expect(scope.usermenus.length).toEqual(1);
  });
  
  it('should hide asidemenus when init', function () {
  	var menu = $(element).find('.dropdown-menu');
    expect(menu.width()).toEqual(0);
    expect(menu.height()).toEqual(0);
  });
  
  it('should show asidemenus when click .dropdown-toggle', function () {
    var toggle = $(element).find('.dropdown-toggle');
    var spyEvent = spyOnEvent(toggle, 'click');
    $(element).find('.dropdown-toggle').trigger('click');
    expect(spyEvent).toHaveBeenTriggered();
  });
});