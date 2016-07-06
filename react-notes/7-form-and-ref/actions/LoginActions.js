import AppDispatcher from '../dispatcher/AppDispatcher.js';

var LoginActions = {

  login: function (context) {
    AppDispatcher.dispatch({
      actionType: 'LOGIN',
      context: context,
    });
  },

};

module.exports = LoginActions;
