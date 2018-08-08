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
import { Container, Row, Col, Input } from 'reactstrap';
import FileView from './FileView';
import {openexternal} from './Utils';

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

    handleChange = (elname)=> (e) => {
        e.preventDefault();

        const ap = this.props.appData;
        if(elname.indexOf("txt_") !== -1){
            ap[elname] = e.target.value;
        }
        else if(elname.indexOf("fi_") !== -1){
            ap[elname] = e.target.files[0].path;

            if(this.props.onLoadConfig)
                this.props.onLoadConfig();
        }

        this.setState({});
    }

    showHelp = (msgstr) => {
        if(this.props.showHelp){
            this.props.showHelp(msgstr);
        }
    }

    onConfigView = (e) =>{
        this.setState(prevState => ({
          configview: !prevState.configview
        }));  
    }

    render() {
        const ap = this.props.appData;
        const configloaded = this.props.configData && Object.keys(this.props.configData).length > 0;

        return (
            <div>
                { !this.state.configview ? 
                    <Container fluid={true} style={{marginTop: 20, padding:0}}>                  
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <h5>Welcome to User Sync Configuration Wizard</h5>
                                    <hr/>
                                    <legend style={{marginLeft:-10}} >Before you continue <small>check following are available</small></legend>
                                    <ol className="rounded-list" style={{paddingLeft: 15}}>
                                        <li><a href="#" onClick={()=> openexternal('https://adobe-apiplatform.github.io/user-sync.py/en/success-guide/setup_adobeio.html')}>Get User Management API token from <span style={{color:'blue'}}>Adobe.io</span></a></li>
                                        <li><a href="#" onClick={()=> openexternal('https://adobe-apiplatform.github.io/user-sync.py/en/success-guide/identify_server.html')}>Setup a readonly LDAP service account on your Enterprise Directory</a></li>
                                        <li><a href="#" onClick={()=> openexternal('https://adobe-apiplatform.github.io/user-sync.py/en/success-guide/layout_products.html')}>Define the User Identity Type & User Groups Mappings for User Sync</a></li>
                                    </ol>
                                    <legend style={{marginLeft:-10}}>Configuration File <small>select user-sync-config.yml</small></legend>
                                    <p>
                                        { 
                                            !configloaded ? 
                                            <div>
                                                <Input type="file" size="sm" defaultValue="" onChange={this.handleChange('fi_ust_conf_path')} accept=".yml" />
                                            </div> : 
                                            <div>
                                                <span>{ap.fi_ust_conf_path}</span>&nbsp;<a onClick={this.onConfigView} href="#">View</a>
                                            </div>
                                        }
                                    </p>
                                </div>
                            </Col>
                        </Row>                
                    </Container>
                    : <FileView configData={this.props.configData} />
                }
            </div>
        );
    }

    componentDidMount() {
        this.showHelp("This wizard helps you configure the Adobe.io token, enterprise directory information and directory group mappings. Please select the user sync configuration file (user-sync-config.yml) to continue.");
    }
}