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
import { InputGroupAddon, UncontrolledDropdown, DropdownMenu, DropdownToggle, InputGroup, DropdownItem, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import * as Utils from './Utils';

const g_allUsersFilterOptions = {
    "default": "(&(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))",
    "openldap" : "(&(objectClass=person)(objectClass=top))"
}
const g_groupFormatOptions = {
    "default": "(&(|(objectCategory=group)(objectClass=groupOfNames)(objectClass=posixGroup))(cn={group}))",
    "ad": "(&(objectCategory=group)(cn={group}))",
    "openldap": "(&(|(objectClass=groupOfNames)(objectClass=posixGroup))(cn={group}))"
}
const g_groupMemberFilterOptions = {
    "memberof": "(memberOf={group_dn})",
    "memberof-nested": "(memberOf:1.2.840.113556.1.4.1941:={group_dn})",
    "ismemberof": "(isMemberOf={group_dn})",
    "ismemberof-nested": "(isMemberOf:1.2.840.113556.1.4.1941:={group_dn})"
}

export default class extends React.Component {
    constructor() {
        super();
        this.state = {    
            ldap: '',
            host: '',        
            isonerror: false,
            alertmsg: "",
            showpass: false,
            toptips: {
                user_email_format: "user_email_format specifies how to construct a user's email address by combining constant strings with the values of specific directory attributes.",
                group_filter_format: "group_filter_format specifies the format string used to get the distinguish name of a group given its common name (as specified in the directory to Adobe group mapping, or in the --users group \"name1,name2\" command-line argument)."
            }
        }
    }

    showHelp = (msgstr) => {
        if(this.props.showHelp){
            this.props.showHelp(msgstr);
        }
    }

    handleChange = (elname, eltype) => (e) => {
        if(eltype !== "check"){
            e.preventDefault();
        }
        const cd = this.props.configData.directory_users.connectors.ldap_data;
        if(!eltype){
            eltype = "input";
        }
        if(eltype === "number"){
            const val = parseInt(e.target.value);
            Utils.setobj(cd, elname, val);
        }
        else if(eltype === "check"){
            const val = e.target.checked;
            Utils.setobj(cd, elname, val);
        }
        else if(eltype === "input"){
            const val = e.target.value;
            Utils.setobj(cd, elname, val);
        }
        if(cd.secure_password_key_enabled){
            delete cd["password"];
        } else{
            delete cd["secure_password_key"];
        }

        if(!cd.user_username_format_enabled){
            delete cd["user_username_format"];
            delete cd["user_domain_format"];
        }

        this.setState({});
    }

    handleDDOption = (option, elname)=> (e) => {
        e.preventDefault();

        const ldap = this.props.configData.directory_users.connectors.ldap_data;
        if(elname === "all_users_filter"){
            ldap[elname] = g_allUsersFilterOptions[option];
        }
        else if(elname === "group_filter_format"){
            ldap[elname] = g_groupFormatOptions[option];
        }
        else if(elname === "group_member_filter_format"){
            ldap[elname] = g_groupMemberFilterOptions[option];        
        }

        this.setState({});
    }

    handleHost = (e)=>{
        const newHost = e.target.value;
        this.setState(prevState=> {
            const ldapHost = this.props.configData.directory_users.connectors.ldap_data;
            ldapHost.host = prevState.ldap + "://" + newHost;
    
            return{
                    host: newHost
                }
            })
            }     

    handleLdap = (e)=> {
    const ldapSelect = e.target.value;
    this.setState(prevState=> {
        const ldapHost = this.props.configData.directory_users.connectors.ldap_data;
        const ldap = ldapSelect + "://";
        ldapHost.host = ldap + prevState.host;

        return{
                ldap: ldapSelect
            }
        })
        }     

    handleSubmit = (e) => {
        e.preventDefault();
        var alertmsg = "Invalid or incorrect information is provided.";
        this.setState({alertmsg: alertmsg, isonerror: true});
    }

    handleShowPass = (e) => {
        e.preventDefault();
        this.setState((prev) => ({showpass: !prev.showpass}));
    }

    render() {
        const ldap = this.props.configData.directory_users.connectors.ldap_data;
        return (
            <Form>
                <div className="row form-group">
                    <legend>LDAP <small className="text-muted">Connection to your Enterprise Directory</small></legend>
                    <FormGroup className="col-sm-6">
                        <Label>Username</Label>
                        <Input type="text" value={ldap.username} onChange={this.handleChange('username')} placeholder="Enter Username" size="sm" />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>{!ldap.secure_password_key_enabled ? "Password" : "Secure Password Key" }</Label>
                        { !ldap.secure_password_key_enabled ? 
                            <InputGroup key={0}>
                                <Input 
                                    type={ !this.state.showpass ? "password" : "text" } 
                                    value={ldap.password} 
                                    onChange={this.handleChange('password')} 
                                    placeholder="Enter Password" size="sm" />
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
                            : <Input key={1} type="text" value={ldap.secure_password_key} onChange={this.handleChange('secure_password_key')} placeholder="Enter Secure Pass. Key" size="sm" />
                        }
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>Connection Protocol</Label>
                        <Input style = {{width: "50%"}}type="select" value = {this.state.ldap} onChange={this.handleLdap} size="sm">
                            <option>ldap</option>
                            <option>ldaps</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>Host</Label>
                        <Input type="text" defaultValue = {this.state.host} onChange={this.handleHost} placeholder="Enter Host" size="sm" />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>BASE_DN</Label>
                        <Input type="text" value={ldap.base_dn} onChange={this.handleChange('base_dn')} placeholder="Enter BASE_DN" size="sm" />
                    </FormGroup>
                </div>
                <div className="row form-group">
                    <legend>Advanced <small className="text-muted">Identifier, filters</small></legend>
                    <FormGroup className="col-sm-6">
                        <Label>User Identifier</Label>
                        <Input type="text" value={ldap.user_email_format} onChange={this.handleChange('user_email_format')} placeholder="Default Identifier Applied {mail}" size="sm" />
                        <Label>Optional: <i>{"{" + "userPrincipalName" + "}" }</i> as user identifier</Label>
                    </FormGroup>
                    <FormGroup className="col-sm-6" style={{marginTop:15}}>
                        <Label check size="sm" style={{marginLeft:20, height:20}}>
                            <Input type="checkbox" checked={ldap.secure_password_key_enabled} onChange={this.handleChange('secure_password_key_enabled', 'check')}  />{' '}
                            Enable Secure Password Storage
                        </Label>
                        <Label check size="sm" style={{marginLeft:20, height:20}}>
                            <Input type="checkbox" checked={ldap.user_username_format_enabled} onChange={this.handleChange('user_username_format_enabled', 'check')}  />{' '}
                            Enable Username Format (for username based login settings)
                        </Label>
                    </FormGroup>
                    {
                        ldap.user_username_format_enabled ?
                        <FormGroup className="col-sm-6">
                            <Label>Username Format</Label>
                            <Input type="text" value={ldap.user_username_format} onChange={this.handleChange('user_username_format')} placeholder="Enter Username Format" size="sm" />
                        </FormGroup> : null
                    }
                    { 
                        ldap.user_username_format_enabled ?
                        <FormGroup className="col-sm-6">
                            <Label>Domain Format</Label>
                            <Input type="text" value={ldap.user_domain_format} onChange={this.handleChange('user_domain_format')} placeholder="Enter Domain Format" size="sm" />
                        </FormGroup>: null 
                    }                   
                    <FormGroup className="col-md-12" style={{marginTop: 7}}>
                        <Label>LDAP Filter - keep variables {"{group}"} and {"{group_dn}"} </Label>
                        <InputGroup>
                            <UncontrolledDropdown addonType="prepend"> 
                                <DropdownToggle size="sm" split outline style={{width:135, borderRadius:0, borderColor:"lightgray", borderRight:0}} >
                                    <span style={{fontSize:"0.75rem"}}>All Users Filter</span>
                                </DropdownToggle>
                                <DropdownMenu style={{fontSize:"0.85rem"}}>
                                    <DropdownItem onClick={this.handleDDOption('default', 'all_users_filter')}>Default</DropdownItem>
                                    <DropdownItem onClick={this.handleDDOption('openldap', 'all_users_filter')}>Open LDAP</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <Input type="text" value={ldap.all_users_filter} onChange={this.handleChange('all_users_filter')} size="sm" />
                        </InputGroup>
                    </FormGroup>    

                    <FormGroup className="col-md-12">
                        <InputGroup>
                            <UncontrolledDropdown addonType="prepend"> 
                                <DropdownToggle size="sm" split outline style={{width:135, borderRadius:0, borderColor:"lightgray", borderRight:0}} >
                                    <span style={{fontSize:"0.75rem"}}>Group Filter</span>
                                </DropdownToggle>
                                <DropdownMenu style={{fontSize:"0.85rem"}}>
                                    <DropdownItem onClick={this.handleDDOption('default', 'group_filter_format')}>Default</DropdownItem>
                                    <DropdownItem onClick={this.handleDDOption('ad', 'group_filter_format')}>Active Directory</DropdownItem>
                                    <DropdownItem onClick={this.handleDDOption('openldap', 'group_filter_format')}>Open LDAP</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <Input type="text" value={ldap.group_filter_format} onChange={this.handleChange('group_filter_format')} size="sm" />
                        </InputGroup>
                    </FormGroup>    

                    { ldap.group_member_filter_format ?
                        <FormGroup className="col-md-12">
                            <InputGroup>
                                <UncontrolledDropdown addonType="prepend"> 
                                    <DropdownToggle size="sm" split outline style={{ width:135, borderRadius:0, borderColor:"lightgray", borderRight:0}} >
                                        <span style={{fontSize:"0.75rem"}}>Group Member Filter</span>
                                    </DropdownToggle>
                                    <DropdownMenu style={{fontSize:"0.85rem"}}>
                                        <DropdownItem onClick={this.handleDDOption('memberof', 'group_member_filter_format')}>Default (memberOf)</DropdownItem>
                                        <DropdownItem onClick={this.handleDDOption('memberof-nested', 'group_member_filter_format')}>Nested groups lookup (memberOf)</DropdownItem>
                                        <DropdownItem onClick={this.handleDDOption('ismemberof', 'group_member_filter_format')}>isMemberOf</DropdownItem>
                                        <DropdownItem onClick={this.handleDDOption('ismemberof-nested', 'group_member_filter_format')}>Nested groups lookup (isMemberOf)</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <Input type="text" value={ldap.group_member_filter_format} onChange={this.handleChange('group_member_filter_format')} size="sm" />
                            </InputGroup>
                        </FormGroup>: null
                    }    
                </div>
            </Form>
        );
    }

    componentDidMount() {
        this.showHelp("Setup read-only LDAP account on your Enterprise Directory and configure it here");
        const ldap = this.props.configData.directory_users.connectors.ldap_data;
        const hostArray = ldap.host.split('://');
        if (hostArray.length === 2)
        {
            this.setState({ldap: hostArray[0]});
            this.setState({host: hostArray[1]});
        }
        else
        {
            this.setState({ldap: "ldap://"});
            this.setState({host: "example.com"});
        }
    }
}