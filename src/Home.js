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
                                    <hr />
                                    <legend style={{marginLeft:-10}} >Before you continue</legend>
                                    <ol className="rounded-list" style={{paddingLeft: 15}}>
                                        <li><a href="#" onClick={()=> openexternal('https://console.adobe.io')}>Get User Management API token from <span style={{color:'blue'}}>Adobe.io</span></a></li>
                                        <li><a href="#">Configure the Enterprise Directory (readonly LDAP) service account </a></li>
                                        <li><a href="#">Define the User Identity Type & User Groups Mappings for User Sync</a></li>
                                    </ol>
                                    <p className="mb-0">Go to <a  href="#" onClick={()=> openexternal('https://github.com/adobe-apiplatform/user-sync.py')}>GitHub</a> for more information</p>
                                    <br/>
                                    <p>
                                        { 
                                            !configloaded ? 
                                            <div>
                                                <span>Select path to User Sync tool's configuration file (user-sync-config.yml)</span>
                                                <Input type="file" size="sm" defaultValue="" onChange={this.handleChange('fi_ust_conf_path')} accept=".yml" />
                                            </div> : 
                                            <div>
                                                <span>User Sync tool's configuration file (user-sync-config.yml)</span>
                                                <br/><span>{ap.fi_ust_conf_path}</span>&nbsp;<a onClick={this.onConfigView} href="#">View</a>
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
        this.showHelp("Configure the User Sync tool for synchronizing Adobe customer directories via the User Management API");
    }
}