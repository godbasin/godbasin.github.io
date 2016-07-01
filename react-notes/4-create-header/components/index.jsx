import React from 'react';
import Header from  './header.jsx'; //login自定义组件

const Index = React.createClass({
  render() {
    return <Header active="index"></Header>;
  }
});

module.exports = Index;