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
import { Container, Row, Col } from 'reactstrap';
const spawn = window.require('child_process').spawn; 

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            isonerror: false,
            alertmsg: "",
            configview: false,
            toptips: {
            }
        }
    }

    showHelp = (msgstr) => {
        if(this.props.showHelp){
            this.props.showHelp(msgstr);
        }
    }

    launchExe = () => {
        spawn('start', ['C:\\Windows\\System32\\notepad.exe'], {detached: true});
    }

    render() {
        // const ap = this.props.appData;
        return (
            <div>   <Container fluid={true} style={{marginTop: 20, padding:0}}>                  
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <h5>Success! information saved successfully</h5>
                                    <hr />
                                    <legend style={{marginLeft:-10}} >Next steps:</legend>
                                    <ol className="rounded-list" style={{paddingLeft:15}}>
                                        <li><a href="#">Identify a few pilot test users and complete pilot testing</a></li>
                                        <li><a href="#">Add all entitiled users to appropriate directory groups</a></li>
                                        <li><a href="#">Validate results in <i>test-mode</i> before running the tool outside of test-mode</a></li>
                                        <li><a href="#">Setup a <i>scheduled task</i> for ongoing execution of User Sync</a></li>
                                    </ol>
                                    <legend style={{marginLeft:-10}} >Run in test-mode</legend>
                                    <div>
                                        Runing in test-mode only compare users in Admin Console and does not apply the changes.
                                        <pre>
                                            python ./user-sync.pex --process-groups --users mapped --test-mode
                                        </pre>
                                    </div>
                                </div>
                            </Col>
                        </Row>                
                    </Container>
                
            </div>
        );
    }

    componentDidMount() {
        this.showHelp("");
    }
}