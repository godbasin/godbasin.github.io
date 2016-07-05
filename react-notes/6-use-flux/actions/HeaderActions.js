import AppDispatcher from '../dispatcher/AppDispatcher.js';

var HeaderActions = {
  clockRender: function (callback) {
    AppDispatcher.dispatch({
      actionType: 'CLOCK_RENDER',
      callback: callback
    });
  },
};

module.exports = HeaderActions;
