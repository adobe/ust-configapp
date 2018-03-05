import React from 'react';
import { Container, Row, Col, InputGroup, InputGroupButton, Button, Form, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import FileView from './FileView';

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
                    <Container fluid={true} style={{marginTop: 20, marginLeft:-15}}>                  
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <h5>Welcome to User Sync Configuration Wizard</h5>
                                    <hr />
                                    <p>1. Setup <b>User Management API</b> Integration from Adobe.io
                                    <br />2. Configure the <b>Enterprise Directory</b> service account
                                    <br />3. Define the <b>User Identity Type & User Groups Mappings</b> for User Sync
                                    </p>
                                    <p className="mb-0">Go to <i>https://github.com/adobe-apiplatform/user-sync.py</i> for more information</p>
                                    <p>&nbsp;</p>
                                    <legend style={{marginLeft:-10}} >Before you continue</legend>
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