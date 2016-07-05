import React from 'react';
import { Panel, PanelGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import HeaderController from  './HeaderController.jsx'; //login自定义组件
import IndexStore from '../stores/IndexStore.js'; 
import IndexActions from '../actions/IndexActions.js'; 
import Index from './Index.jsx'; 

const IndexController = React.createClass({
	getDefaultProps : function () {
	   return { asidemenus: IndexStore.getAsidemenus()};
	},
	changeState: function(){
		this.setState({loading: IndexStore.getLoading()});
	},
	setLoading: function(state){
		IndexActions.setLoading(state, this.changeState);
	},
	getInitialState: function() {
		return {loading: IndexStore.getLoading()};
	},
  render() {
    return (
    	<div className="container-fluid row">
    		<HeaderController active="index"></HeaderController>
			<Index asidemenus={this.props.asidemenus} loading={this.state.loading} setLoading={this.setLoading}  />
		</div>
    );
  }
});

module.exports = IndexController;