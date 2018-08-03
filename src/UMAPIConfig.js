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
import { Button, InputGroupAddon, InputGroup, Form, FormGroup, Label, Input, UncontrolledTooltip } from 'reactstrap';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            isonerror: false,
            alertmsg: "",
            showpass: false,
            toptips: {
                ent_settings: "You must specify all five of these settings. Please see Adobe I/O Console to determine the correct settings."
            }
        }
    }

    showHelp = (msgstr) => {
        if(this.props.showHelp){
            this.props.showHelp(msgstr);
        }
    }

    handleChange = (elname, eltype)=> (e) => {
        e.preventDefault();

        const ent = this.props.configData.adobe_users.connectors.umapi_data.enterprise;
        if(!eltype){
            eltype = "input";
        }

        if(eltype === "input"){
            ent[elname] = e.target.value;
        }
        else if(eltype === "file"){
            ent[elname] = e.target.files[0].path;
        }

        this.setState({});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        var isonerror = false;
        var alertmsg = "";

        const ent = this.props.configData.adobe_users.connectors.umapi_data.enterprise;
        if(ent && ent.org_id){
            isonerror = false;
            alertmsg = "Successfully saved information.";
        } else {
            isonerror = true;
            alertmsg = "Invalid or incorrect information is provided.";
        }

        this.setState({alertmsg: alertmsg, isonerror: isonerror});
    }

    handleReload = (e) => {
        e.preventDefault();
    }

    handleShowPass = (e) => {
        e.preventDefault();
        this.setState((prev) => ({showpass: !prev.showpass}));
    }

    render() {
        const ent = this.props.configData.adobe_users.connectors.umapi_data.enterprise;

        return (
            <Form>
                <div className="row form-group">
                    <legend>Enterprise <small className="text-muted">Token from Adobe.io</small>&nbsp;<i id="tp_ent_settings" className="fa fa-question-circle"></i></legend>
                    <UncontrolledTooltip placement="bottom-start" target="tp_ent_settings">
                        {this.state.toptips.ent_settings}
                    </UncontrolledTooltip>
                    <FormGroup className="col-sm-6">
                        <Label>Organization ID</Label>
                        <Input type="text" value={ent.org_id} onChange={this.handleChange('org_id')} placeholder="Enter Org ID" size="sm" />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>Technical account ID</Label>
                        <Input type="text" value={ent.tech_acct} onChange={this.handleChange('tech_acct')} placeholder="Enter Tech Account ID" size="sm" />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>API Key (Client ID)</Label>
                        <Input type="text" value={ent.api_key} onChange={this.handleChange('api_key')} placeholder="Enter API Key" size="sm" />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>Client Secret</Label>
                        <InputGroup key={0}>
                                <Input 
                                    type={ !this.state.showpass ? "password" : "text" } 
                                    value={ent.client_secret} 
                                    onChange={this.handleChange('client_secret')} 
                                    placeholder="Enter Client Secret" 
                                    size="sm" 
                                    />
                                <InputGroupAddon addonType="append">
                                    <Button 
                                        size="sm" 
                                        style={{border:"1px solid lightgray", borderLeft: 0}} 
                                        color="secondary" outline={true}
                                        onClick={this.handleShowPass}
                                        >
                                        <span><i className={"fa " + (!this.state.showpass ? "fa-eye" : "fa-eye-slash")}></i></span>
                                    </Button>
                                </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </div>
                <div className="row form-group">
                    <legend>Certificates</legend>
                    <FormGroup className="col-sm-6">
                        <Label>Private Key Path (*.key)</Label>
                        <Input type="file" size="sm" defaultValue="" onChange={this.handleChange('priv_key_path','file')} accept=".key"/> 
                        <span>{ent.priv_key_path ? "Path: " + ent.priv_key_path : ""}</span>
                    </FormGroup>                    
                </div>
            </Form>
        );
    }

    componentDidMount() {
        this.showHelp("Generate a self-assigned certificate or use certificate from your Certficate Authority and upload to Adobe.io to get UMAPI token information");
    }
}