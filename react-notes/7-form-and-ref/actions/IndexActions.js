import AppDispatcher from '../dispatcher/AppDispatcher.js';

var IndexActions = {

  setLoading: function (state, callback) {
    AppDispatcher.dispatch({
      actionType: 'INDEX_SET_LOADING',
      state: state,
      callback: callback,
    });
  },
  
  focusInput: function (refs, name) {
    AppDispatcher.dispatch({
      actionType: 'INDEX_FOCUS_INPUT',
      refs: refs,
      name: name,
    });
  },
  
  setInput: function (name, event, callback) {
    AppDispatcher.dispatch({
      actionType: 'INDEX_SET_INPUT',
      name: name,
      event: event,
      callback: callback,
    });
  },

};

module.exports = IndexActions;
