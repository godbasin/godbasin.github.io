import AppDispatcher from '../dispatcher/AppDispatcher.js';

var IndexActions = {

  setLoading: function (state, callback) {
    AppDispatcher.dispatch({
      actionType: 'INDEX_SET_LOADING',
      state: state,
      callback: callback,
    });
  },

};

module.exports = IndexActions;
