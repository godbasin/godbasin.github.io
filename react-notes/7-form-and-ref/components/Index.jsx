import React from 'react';
import { Panel, PanelGroup, ListGroup, ListGroupItem, Form, FormGroup, Col, Button, ControlLabel, FormControl } from 'react-bootstrap';

const Index = React.createClass({
	
  render() {
  	var loading = this.props.loading;
  	var setLoading = this.props.setLoading;
  	var asidemenus = this.props.asidemenus.map(function(menu, i){
  		var menus, menusgroup; 		
  		if(menu.menus){
  			menus = menu.menus.map(function(item, j){
  				return (<ListGroupItem onClick={setLoading.bind(null,item.click)} key={j}>{ item.text }</ListGroupItem>);
  			});
  			menusgroup = (
  				<ListGroup>
  					{ menus }
  				</ListGroup>
  			);  			
  		}
  		var menuheader = (
  			<ul class="panel-title ">
					<li onClick={setLoading.bind(null,menu.click)}>
							{ menu.title }
					</li>
				</ul>
  		);
  		return (
  			<Panel collapsible defaultExpanded className="list-group" key={i} header={menuheader}>
					<div id="collapse{i}" className="panel-collapse collapse in">
						{ menusgroup }										
					</div>
				</Panel>
  		);
  	});
    return (
    	<div className="container-fluid row">
				<aside className="col-md-2 col-md-offset-1">
					<PanelGroup id="according">
						{ asidemenus }						
					</PanelGroup>
				</aside>
				<article className="col-md-7">
					<section className="index-content">
						<p className={loading == 'init' || loading == 'name' ? '' : 'hidden'}>昵称：被删</p>
						<p className={loading == 'init' || loading == 'email' ? '' : 'hidden'}>邮箱：wangbeishan@163.com</p>
						<p className={loading == 'init' || loading == 'github' ? '' : 'hidden'}>github: <a href="https://github.com/godbasin">github.com/godbasin</a></p>
						<div className={loading == 'sethead' ? '' : 'hidden'}>这里是设置头像页面</div>
						<div className={loading == 'setinfo' ? '' : 'hidden'}>
							<Form horizontal>
						    <FormGroup controlId="formHorizontalEmail">
						      <Col componentClass={ControlLabel} sm={2}>
						        邮件
						      </Col>
						      <Col sm={10}>
						        <FormControl type="email" placeholder="Email" ref="email" value={this.props.email} onChange={this.props.setInput.bind(null, 'email')} required />
						      </Col>
						    </FormGroup>						
						    <FormGroup controlId="formHorizontalName">
						      <Col componentClass={ControlLabel} sm={2}>
						        名字
						      </Col>
						      <Col sm={10}>
						        <FormControl type="text" placeholder="Name" ref="name" value={this.props.name} onChange={this.props.setInput.bind(null, 'name')} required />
						      </Col>
						    </FormGroup>						
						    <FormGroup>
						      <Col smOffset={2} sm={2}>
						        <Button onClick={this.props.focusInput.bind(null, 'email')}>focus邮件</Button>        
						      </Col>
						      <Col sm={2}>
						        <Button onClick={this.props.focusInput.bind(null, 'name')}>focus名字</Button>
						      </Col>
						    </FormGroup>
						  </Form>	
						  <p>email: {this.props.email}</p>
						  <p>name: {this.props.name}</p>
						</div>
						<div className={loading == 'other' ? '' : 'hidden'}>这里是其他页面</div>
					</section>
				</article>
			</div>
    );
  }
});

module.exports = Index;