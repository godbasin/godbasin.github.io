import React from 'react';
import { Panel, PanelGroup, ListGroup, ListGroupItem } from 'react-bootstrap';

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
						<div className={loading == 'setinfo' ? '' : 'hidden'}>这里是修改资料页面</div>
						<div className={loading == 'other' ? '' : 'hidden'}>这里是其他页面</div>
					</section>
				</article>
			</div>
    );
  }
});

module.exports = Index;