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

import './index.css';

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
          if (e.target.value !== '') {
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
        this.props.showBack();
    }

    fileUpload = () => {
        document.getElementById("file-input").click();
    }

  render() {
    const ap = this.props.appData;
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
                  <legend style={{marginLeft:-10}}>Configuration File</legend>
                  <div>
                    {/*File Input - first it checks which label it should display if wrongFile then it will display fileSelectPlaceHolder if not then correct file path. If user would like to switch
                    files the button accesses the file input by calling the fileUpload function which then calls the hidden file input which then calls handle change*/}
                    <div className="file-input">
                        <button className="file-input-button" onClick={this.fileUpload} size="md">Choose File</button>
                        {!this.props.wrongFile ? <label className="file-input-label">{ap.fi_ust_conf_path}</label> : <label className="file-input-label">{this.props.fileSelectPlaceHolder}</label>}
                        &nbsp;&nbsp;<a className="file-input-view" onClick={this.onConfigView} href="#">View</a>
                        <Input type="file" size="md" defaultValue="" id="file-input" onChange={this.handleChange('fi_ust_conf_path')} accept=".yml" hidden />
                    </div>
                  </div>
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

  // componentDidUpdate - this life cycle method is used to to prepopulate the file by calling onLoadConfig if the path property has updated and switches between File View and home View if the back button is clicked 
  componentDidUpdate(prevProps) {
    if(prevProps.appData.fi_ust_conf_path !== this.props.appData.fi_ust_conf_path) {
      this.props.onLoadConfig();
    }

    if(prevProps.showBackOnView !== this.props.showBackOnView) {
      this.setState({configview: this.props.showBackOnView});
    }
  }
}