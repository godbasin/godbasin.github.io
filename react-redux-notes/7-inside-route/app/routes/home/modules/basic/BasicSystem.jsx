import React, { Component, PropTypes } from 'react'
import Table from '../../components/Table.jsx'

export class BasicSystem extends Component {
  render() {
    return (
      <div>
       <Table title={'基础系统配置'} number={2} />
      </div>
    )
  }
}

export default BasicSystem
