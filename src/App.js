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

import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { Alert, Button, Navbar, NavbarBrand, Container, Row, Col } from 'reactstrap';
import Home from './Home';
import USTConfig from './USTConfig';
import UMAPIConfig from './UMAPIConfig';
import LDAPConfig from './LDAPConfig';
import Summary from './Summary';
import ConfigHandler from './ConfigHandler';
import Globals from './Globals';
import { openexternal } from './Utils';
const fs = window.require('fs');
const configHandler = new ConfigHandler();

export default class extends Component {
  constructor() {
    super();

    this.state = {
      isonerror: false,
      alertmsg: "",
      selected: 0,
      cancontinue: false,
      configData: {},
      appData: {
        fi_ust_conf_path: 'No file chosen',
        countries: Globals.Countries
      },
      wizsteps: [
        { idx: 0, title: "Home", icon: "fa-home" },
        { idx: 1, title: "User Management API", icon: "fa-cloud-upload", },
        { idx: 2, title: "Enterprise Directory", icon: "fa-sitemap" },
        { idx: 3, title: "User Sync Settings", icon: "fa-cogs" },
        { idx: 4, title: "Summary & Next Steps", icon: "fa-check-circle" }
      ],
      helpstring: "",
      wrongFile: false, // If wrong file chosen wrongFile set to true and set dyanamic label in Home compoenent set to fileSelectPlaceHolder below
      fileSelectPlaceHolder: "No file chosen", // Placeholder title for dynamic label in Home component if wrong file selected shows no file chosen
      showBackOnView: false
    }
  }

  onAlertDismiss = () => {
    this.setState({ alertmsg: "", isonerror: false });
  }

  handleSubmit() {
    var alertmsg = "Invalid or incorrect information is provided.";
    this.setState({ alertmsg: alertmsg, isonerror: true });
  }

  onNext = (e) => {
    e.preventDefault();

    const s = this.state;
    if (s.selected === s.wizsteps.length - 1) {
      const ans = window.confirm("Do you want to exit?");
      if (ans) {
        window.close();
      }
    }
    else if (s.selected > 0) {
      const configfile = s.appData.fi_ust_conf_path;
      const cd = this.processConfigDataForServer(s.configData);
      const ausers = cd.adobe_users;
      const dusers = cd.directory_users;

      let isok = false;
      if (s.selected === 1) {
        const ent = ausers.connectors.umapi_data.enterprise;
        if (ent.api_key && ent.client_secret && ent.org_id && ent.tech_acct
          && ent.priv_key_path) {
          isok = true;
        }
      }
      else if (s.selected === 2) {
        const ldap = dusers.connectors.ldap_data;
        if (ldap.host && ldap.username && (ldap.password || ldap.secure_password_key) && ldap.base_dn
          && ldap.all_users_filter && ldap.user_email_format && ldap.group_filter_format) {
          isok = true;
        }
      }
      else if (s.selected === 3) {
        if(!dusers.default_country_code){
          isok = window.confirm("No default country code defined. Do you still like to continue?");
        }
        else{
          isok = true;
        }
        
        if (isok && dusers.user_identity_type
          && cd.limits.max_adobe_only_users > 0) {
          if (dusers.groups.length === 0) {
            isok = window.confirm("No groups mappings are defined. Do you still like to continue?");
          }
          else {
            isok = true;
          }
        }
      }

      if (isok) {
        const stage = s.selected === 1 ? "umapi" :
          s.selected === 2 ? "ldap" : "ust";

        configHandler.saveConfigFile(configfile, cd, stage, () => {
          this.setState(prevState => ({
            selected: prevState.selected < prevState.wizsteps.length - 1 ? ++prevState.selected : prevState.selected,
            cancontinue: true
          }));
          console.log("Saved.");
        });

        this.setState(prevState => ({
          configview: false,
          cancontinue: false
        }));
        console.log("Saving data...");
      }
      else {
        alert("Invalid information provided.\r\nPlease fill in all required information.")
      }
    }
    else {
      this.setState(prevState => ({
        selected: prevState.selected < prevState.wizsteps.length - 1 ? ++prevState.selected : prevState.selected,
        configview: false,
        cancontinue: true
      }));
    }
  }

  onBack = () => {
    this.setState(prevState => ({
      selected: prevState.selected > 0 ? --prevState.selected : prevState.selected,
      configview: false,
      showBackOnView: false
    }));
  }

  showHelp = (msgstr) => {
    this.setState({ helpstring: msgstr });
  }

  onLoadConfig = () => {
    if(this.state.appData.fi_ust_conf_path) {
      configHandler.loadConfigFile(this.state.appData.fi_ust_conf_path, (data, isonerr) => {
      // If there is an error loading we show user alert and then we set wrongFile to true which resets the dynamic label in the home component, also resets config data so we don't store
      // in correct data and disables the continue button until correct file selected. Else sets correct config data, enables continue button and resets dynamic label in home component to show correct file path
      if (isonerr) {
        alert("Looks like there was a problem loading the user sync configuration file. Please make sure you are selecting \"user-sync-config.yml\" as your configuration file");
        this.setState(prevState => ({
          wrongFile: true,
          configData: {}, 
          cancontinue: false
        }));
      } else {
        this.setState({
          configData: data,
          cancontinue: true,
          wrongFile: false
        });
      }
    });}
  }

  onSaveConfig = () => {
  }

  showBack = () => {
    this.setState({showBackOnView: true});
  }

  render() {
    const s = this.state;

    return (
      <div>
        <Navbar color="dark" className="navbar-dark" fixed="top">
          <NavbarBrand href="#">
            <img src={logo} style={{ width: 30, height: 30 }} className="d-inline-block align-top" alt="" />
            <span style={{ marginLeft: 10 }}>User Sync Tool<small style={{ textTransform: "uppercase", color: "darkgray" }}>&nbsp;&nbsp;Configuration Wizard</small></span>
          </NavbarBrand>
        </Navbar>
        <Container fluid>
          <Row>
            <Col tag="main" sm={9} className="ml-sm-auto pt-3" role="main">
              <Container fluid={true}>
                <Row>
                  <Col sm={12} style={{ marginTop: -10 }}>
                    <ul className="progress-tracker progress-tracker--text progress-tracker--text-top">
                      {
                        s.wizsteps.map((k, i) =>
                          <li key={i} className={"progress-step " +
                            (s.selected === i ? "is-active" : i < s.selected ? "is-complete" : "")
                          }>
                            <span className={"progress-text " + (s.selected === i ? "text-primary" : "")}>
                              <span className="progress-title"></span>
                              <small>{k.title}</small>
                            </span>
                            <span className="progress-marker"><i className={"fa " + k.icon}></i></span>
                          </li>)
                      }
                    </ul>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} style={{ overflowX: "auto", borderRight: "1px solid lightgray", marginBottom: 30, height: 330 }}>
                    <Alert
                      color={this.state.isonerror ? "danger" : "success"}
                      isOpen={this.state.alertmsg ? true : false} toggle={this.onAlertDismiss}
                      style={{ margin: 10 }}
                    >
                      {this.state.alertmsg}
                    </Alert>
                    {
                      s.selected === 0 ? <Home 
                        showHelp={this.showHelp} 
                        onLoadConfig={this.onLoadConfig}
                        showBack={this.showBack} 
                        configData={s.configData} 
                        appData={s.appData} 
                        wrongFile={s.wrongFile} 
                        fileSelectPlaceHolder={s.fileSelectPlaceHolder} 
                        showBackOnView={s.showBackOnView}
                      /> :
                        s.selected === 1 ? <UMAPIConfig showHelp={this.showHelp} configData={s.configData} appData={s.appData} /> :
                          s.selected === 2 ? <LDAPConfig showHelp={this.showHelp} configData={s.configData} appData={s.appData} /> :
                            s.selected === 3 ? <USTConfig showHelp={this.showHelp} configData={s.configData} appData={s.appData} /> :
                              <Summary showHelp={this.showHelp} configData={s.configData} />
                    }
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col sm={3} style={{ padding: 10, paddingRight: 15 }}>
              <div style={{ marginTop: 95 }}>
                <span>{s.helpstring}</span>
              </div>
              <br />
              <div>
                <span>See the <a href="#" onClick={() => openexternal('https://adobe-apiplatform.github.io/user-sync.py/en/')}>docs</a> for more details</span>
              </div>
            </Col>
          </Row>
        </Container>
        <Navbar color="light" className="navbar-light bg-faded" fixed="bottom">
          <div>
            <Button size="sm" color="primary" style={{ marginLeft: 5, minWidth: 125 }} onClick={this.onNext} disabled={!s.cancontinue}>
              {s.selected === 0 ? "Continue" : s.selected === s.wizsteps.length - 1 ? "Close" : "Save & Continue"}
            </Button>
            {
              s.selected !== 0 || s.showBackOnView === true ?
                <Button color="link" size="sm" onClick={this.onBack}>Back</Button> : null
            }
          </div>
        </Navbar>
      </div>
    );
  }

  processConfigDataFromServer(cd) {
    return cd;
  }

  processConfigDataForServer(cd) {
    const groups = cd.directory_users.groups;
    const groups_new = [];
    for (let g in groups) {
      groups_new.push({
        directory_group: groups[g].directory_group,
        adobe_groups: groups[g].adobe_groups
      });
    }
    cd.directory_users.groups = groups_new;
    return cd;
  }

  // compoenentDidMount - this life cycle method sets the default file path to fi_ust_conf_path after it checks if the file exists. If the file does not exist it does nothing
  componentDidMount() {
    let path = 'C:\\Program Files\\Adobe\\Adobe User Sync Tool\\user-sync-config.yml';
    if (fs.existsSync(path)) {
      this.setState(prevState => ({
        appData: {
          ...prevState.appData,
          fi_ust_conf_path: path
        }
      }));
    }
  }
}  
