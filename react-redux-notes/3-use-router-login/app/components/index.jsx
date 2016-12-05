import React from 'react';

const Index = React.createClass({
  render() {
    return (
    	<div className="container body">
			Hello World!
		</div>
    );
  },
	componentDidMount() {
		$('body').attr('class', 'nav-md')
		$('.right_col').css('min-height', $(window).height())
	}
});

module.exports = Index;