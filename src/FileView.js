/*
ADOBE CONFIDENTIAL

Copyright 2017 Adobe

All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

import React from 'react';

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