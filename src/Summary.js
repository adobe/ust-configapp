import React from 'react';
import { Container, Row, Col, InputGroup, InputGroupButton, Button, Form, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

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

    render() {
        const ap = this.props.appData;
        return (
            <div>   <Container fluid={true} style={{marginTop: 20, marginLeft:-15}}>                  
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <h5>Success! information saved successfully</h5>
                                    <hr />
                                    <legend style={{marginLeft:-10}} >Next steps:</legend>
                                    <p>1. Add <b>pilot testing users</b> and then <b>all entitiled</b> to appropriate security groups
                                    <br />2. Validate results in <b>test-mode</b> and then run User Sync without test-mode
                                    <br />3. Setup a <b>scheduled task</b> for ongoing execution of User Sync
                                    </p>
                                    <legend style={{marginLeft:-10}} >Run in test-mode</legend>
                                    <p>
                                        Runing in test-mode only compare users in Admin Console and shows changes it is going to apply
                                        <pre>
                                            python ./user-sync.pex --process-groups --users mapped --test-mode
                                        </pre>                                        
                                    </p>
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