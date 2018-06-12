import React from 'react';
import update from 'immutability-helper';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';
import * as Utils from './Utils';

export default class extends React.Component {
    constructor() {
        super();        
        this.state = {
            isonerror: false,
            alertmsg: "", 
            editmapidx: -1
        }
    }

    showHelp = (msgstr) => {
        if(this.props.showHelp){
            this.props.showHelp(msgstr);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        var alertmsg = "Invalid or incorrect information is provided.";
        this.setState({alertmsg: alertmsg, isonerror: true});
    }

    handleChangeMap = (elname, idx)=> (e) => {
        e.preventDefault();

        const cd = this.props.configData;
        const mp = cd.directory_users.groups[this.state.editmapidx];
        if(elname === "MAP.directory_group"){
            mp.directory_group = e.target.value;
            this.setState({});
        }
        else if(elname === "MAP.adobe_groups"){
            if(idx !== -1) {
                mp.adobe_groups[idx] = e.target.value;
                this.setState({});
            }
        }
    }

    handleChange = (elname, eltype)=> (e) => {
        if(eltype !== "check"){
            e.preventDefault();
        }

        const cd = this.props.configData;
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
        else if(eltype === "inputlist"){
            let val = e.target.value;
            if(val){
                const valarr = val.split("\n");
                if(valarr.length > 0){
                    Utils.setobj(cd, elname, valarr);
                }
            }
        }

        this.setState({});
    }

    handleAddMapping = e => {
        e.preventDefault();

        const cd = this.props.configData;
        const s = this.state;
        if(s.editmapidx === -1) {
            const mp = { 
                directory_group: "", 
                adobe_groups: [""]
            };

            cd.directory_users.groups.push(mp);            
            this.setState(prevState => ({
                editmapidx: cd.directory_users.groups.length-1
            }));
        }
    }

    handleSaveMapping = e => {
        e.preventDefault();

        this.setState({
            editmapidx: -1
        });
    }

    handleRemoveMapping = (idx) => (e) => {
        e.preventDefault();

        const cd = this.props.configData;
        cd.directory_users.groups.splice(idx, 1);
        this.setState({
            editmapidx: -1
        });
    }

    handleEditMapping = (idx) => (e) => {
        e.preventDefault();

        this.setState({
            editmapidx: idx
        });
    }

    handleAddGroup = (idx) => (e) => {
        e.preventDefault();        
    }
    
    render() {
        const s = this.state;
        const cd = this.props.configData;
        const ap = this.props.appData;
        
        return (
            <Form>
                <div className="row form-group">                                    
                    <legend>Enterprise Users</legend>
                    <FormGroup className="col-sm-6">
                        <Label>User Identity Type</Label>
                        <Input type="select" value={cd.directory_users.user_identity_type} onChange={this.handleChange('directory_users.user_identity_type')} size="sm">
                            <option>adobeID</option>
                            <option>enterpriseID</option>
                            <option>federatedID</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="col-sm-6 form-group">
                        <Label>Default Country-code</Label>
                        <Input type="select" value={cd.directory_users.default_country_code} onChange={this.handleChange('directory_users.default_country_code')} size="sm">
                            {ap.countries.map( (c, idx) => <option key={idx} value={c.Code}>{c.Name}</option>)}
                        </Input>                        
                    </FormGroup>
                </div>
                <div className="row form-group">
                    <legend>Users Groups <small>security groups mappings</small></legend>
                    <FormGroup className="col-sm-12">
                        <ListGroup>
                        <div className="container" style={{padding:0, margin:0}}>
                            <div className="row">
                                <div className="col-sm-5">
                                    <Label style={{marginLeft:5}} ><i style={{width:16}} className="fa fa-sitemap"></i>&nbsp;directory_group&nbsp;</Label>
                                </div>
                                <div className="col-sm-7">
                                    <Label><i style={{width:16}} className="fa fa-users"></i>&nbsp;adobe_groups&nbsp;</Label>
                                </div>
                            </div>

                            {
                                cd.directory_users.groups.length === 0 ?
                                    <ListGroupItem className="justify-content-between">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <span style={{color:"gray", fontSize:"0.75rem"}}>No mappings found. Click 'Add New'.</span>
                                            </div>
                                        </div>
                                    </ListGroupItem> :
                                    cd.directory_users.groups.map((mp, idx) => 
                                        s.editmapidx === idx ?
                                        <ListGroupItem key={idx} className="justify-content-between" color="warning">
                                            <div className="row">
                                                <div className="col-sm-5">
                                                    <input
                                                        style={{borderRadius:0, marginLeft:-3}}
                                                        type="text" 
                                                        placeholder="Enter Directory Group" 
                                                        value={mp.directory_group} 
                                                        onChange={this.handleChangeMap('MAP.directory_group')}
                                                    />
                                                </div>
                                                <div className="col-sm-6">
                                                    {
                                                        mp.adobe_groups.map((mp_grp, g_idx) => 
                                                            <div>
                                                                <span style={{marginRight:10}}><i className="fa fa-arrow-right"></i></span>
                                                                <span>
                                                                    <input
                                                                        style={{borderRadius:0}}
                                                                        type="text" 
                                                                        placeholder="Enter Adobe Group"
                                                                        value={mp.adobe_groups[g_idx]} 
                                                                        onChange={this.handleChangeMap('MAP.adobe_groups', g_idx)}
                                                                    />
                                                                </span>
                                                                { g_idx !== 0 ? <span style={{marginLeft:5, color:"darkgray"}}><i className="fa fa-minus-circle"></i></span> : null }                                          
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="col-sm-1 text-right">
                                                    <a href="#" onClick={this.handleSaveMapping}>
                                                        <i className="fa fa-floppy-o"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </ListGroupItem> :
                                        <ListGroupItem key={idx} className="justify-content-between">
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        {mp.directory_group}
                                                    </div>
                                                    <div className="col-sm-6">
                                                        {
                                                            mp.adobe_groups.map((mp_grp, gidx) =>
                                                                <div key={gidx}>
                                                                    <span style={{marginRight:10}}><i className="fa fa-arrow-right"></i></span>
                                                                    <span>{mp.adobe_groups[gidx]}</span>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="col-sm-1 text-right">
                                                        <UncontrolledDropdown size="sm">
                                                            <DropdownToggle tag="a" href="#">
                                                                <i className="fa fa-ellipsis-h"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{fontSize:"0.85rem"}}>
                                                                <DropdownItem onClick={this.handleEditMapping(idx)}>
                                                                    <i className="fa fa-pencil-square-o" style={{height:16, marginTop:1}}></i>&nbsp;Edit
                                                                </DropdownItem>
                                                                <DropdownItem onClick={this.handleRemoveMapping(idx)}>
                                                                    <i className="fa fa-trash-o" style={{height:16}}></i>&nbsp;Delete
                                                                </DropdownItem>
                                                                <DropdownItem onClick={this.handleAddGroup(idx)} disabled>
                                                                    <i className="fa fa-plus-circle" style={{height:16}}></i>&nbsp;Add Adobe Group
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </div>
                                                </div>                                                                      
                                        </ListGroupItem>
                                    )
                            }                            
                        </div>                            
                        </ListGroup>
                        <a href="#" style={{marginTop:5, marginLeft:5}} onClick={this.handleAddMapping}><i className="fa fa-plus-circle"></i>&nbsp;Add New</a>
                    </FormGroup>
                </div>
                <div className="row form-group">
                    <legend>Advanced <small className="text-muted">limits, logging, exclude users</small></legend>
                    <FormGroup className="col-sm-6">
                        <Label>Limit</Label>
                        <Input type="number" value={cd.limits.max_adobe_only_users} onChange={this.handleChange('limits.max_adobe_only_users', 'number')} placeholder="Limit" size="sm" />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>Log Level</Label>
                        <Input type="select" value={cd.logging.file_log_level} onChange={this.handleChange('logging.file_log_level')} size="sm">
                            <option>info</option>
                            <option>debug</option>
                        </Input>
                        <Label check size="sm" style={{marginLeft:20}}>
                            <Input type="checkbox" checked={cd.logging.log_to_file} onChange={this.handleChange('logging.log_to_file', 'check')}  />{' '}
                            Enable Logging
                        </Label>
                    </FormGroup>                        
                </div>
                <div className="row form-group">
                    <FormGroup className="col-sm-6">
                        <Label>Exclude Adobe-side identity type</Label>
                        <Input type="textarea" defaultValue={cd.adobe_users.exclude_identity_types} onChange={this.handleChange('adobe_users.exclude_identity_types', 'inputlist')} placeholder="adobeID" size="sm" />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <Label>Exclude Adobe-side Users Groups</Label>
                        <Input type="textarea" defaultValue={cd.adobe_users.exclude_adobe_groups} onChange={this.handleChange('adobe_users.exclude_adobe_groups', 'inputlist')} placeholder="Adobe-Group1&#10;Adobe-Group2" size="sm" />
                    </FormGroup>
                </div>
            </Form>
        );
    }

    componentDidMount() {
        this.showHelp("Sync settings of user groups mappings and other information");
    }
}