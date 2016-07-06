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
		return {
			loading: IndexStore.getLoading(),
			name: IndexStore.getName(),
			email: IndexStore.getEmail(),
		};
	},
	focusInput: function(name){
		IndexActions.focusInput(this.refs.index.refs, name);
	},
	changeInput: function() { //通过event获取当前事件，总是最后一个参数传入
		this.setState({
			name: IndexStore.getName(),
			email: IndexStore.getEmail(),
		});
	},
	setInput: function(name, event){
		IndexActions.setInput(name, event, this.changeInput);
	},
  render() {
    return (
    	<div className="container-fluid row">
    		<HeaderController active="index"></HeaderController>
			<Index ref="index" asidemenus={this.props.asidemenus} loading={this.state.loading} 
			setLoading={this.setLoading} setInput={this.setInput}
			focusInput={this.focusInput} email={this.state.email} name={this.state.name} />
		</div>
    );
  }
});

module.exports = IndexController;