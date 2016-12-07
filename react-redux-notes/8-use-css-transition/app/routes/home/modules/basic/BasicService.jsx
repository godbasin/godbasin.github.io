import React, { Component, PropTypes } from 'react'
import Table from '../../components/Table.jsx'

export class BasicService extends Component {
  render() {
    return (
      <div>
       <Table title={'基础服务配置'} number={5} />
      </div>
    )
  }
}

export default BasicService
