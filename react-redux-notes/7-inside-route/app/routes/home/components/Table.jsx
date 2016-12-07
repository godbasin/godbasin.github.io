import React, { Component, PropTypes } from 'react'

export class Table extends Component {
    render() {
        const { title, number } = this.props
        const tEles = () => {
            const hRows = [];
            const bRows = [];
            let bdRows = [];
            for (let i = 0; i < number; i++) {
                hRows.push(<th key={i}>{"表格头部"}</th>);
                bdRows = [];
                for (let j = 0; j < number; j++) {
                    bdRows.push(<td key={j}>{"表格内容"}</td>);
                }
                bRows.push(<tr key={i}>{bdRows}</tr>);
            }
            return (
                <table className="table">
                    <thead><tr>{hRows}</tr></thead>
                    <tbody>{bRows}</tbody>
                </table>
            )
        }
        return (
            <div>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="x_panel">
                        <div className="x_title">
                            <h2>{title} <small></small></h2>
                            <div className="clearfix"></div>
                        </div>
                        <div className="x_content">
                            {tEles()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Table