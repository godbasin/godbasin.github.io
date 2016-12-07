import React, { Component, PropTypes } from 'react'
import Table from '../components/Table.jsx'

export class Task extends Component {
  render() {
    return (
      <div>
       <Table title={'任务管理'} number={7} />
      </div>
    )
  }
}

export default Task
