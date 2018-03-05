import React from 'react';
import { InputGroup, InputGroupButton, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Alert, UncontrolledTooltip } from 'reactstrap';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        var str = this.props.configData ? JSON.stringify(this.props.configData, undefined, 2) : "...";

        return (
        <div className="form">
            <div className="row">
                <legend>Configuration <small>Data View</small></legend>
                <div className="col-sm-12">
                    <div style={{ border: "1px solid lightgray", backgroundColor:"whitesmoke", padding: 15, margin: "15px 0px", borderRadius: 4, fontSize: "0.75rem", overflowY:"hidden", overflowX:"hidden" }}>
                        <pre>
                            {str} 
                        </pre>            
                    </div>
                </div>
            </div>
        </div>);
    }

    componentDidMount() {        
    }
}