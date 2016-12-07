import React, { Component, PropTypes } from 'react'
import Table from '../../components/Table.jsx'

export class AdvancedSystem extends Component {
  render() {
    return (
      <div>
       <Table title={'高级系统配置'} number={8} />
      </div>
    )
  }
}

export default AdvancedSystem
