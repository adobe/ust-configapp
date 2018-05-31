import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { Alert, Button, Navbar, NavbarBrand, Container, Row, Col } from 'reactstrap';
import Home from './Home';
import USTConfig from './USTConfig';
import UMAPIConfig from './UMAPIConfig';
import LDAPConfig from './LDAPConfig';
import Summary from './Summary';
const remote = window.require('electron').remote;
const { spawn } = window.require('child_process');

const g_countries = [{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}];

export default class extends Component {
  constructor() {
    super();

    this.state = { 
      isonerror: false,
      alertmsg: "", 
      selected: 0,
      cancontinue: false,
      configData : {},
      appData: {
        fi_ust_conf_path: null,
        countries: g_countries
      },
      wizsteps: [
        {idx:0, title: "Home", icon:"fa-home"},
        {idx:1,title: "User Management API", icon:"fa-cloud-upload", },
        {idx:2,title: "Enterprise Directory", icon:"fa-sitemap"},
        {idx:3,title: "User Sync Settings", icon:"fa-cogs"},
        {idx:4,title: "Summary & Next Steps", icon:"fa-check-circle"}
      ],
      helpstring: ""
    }
  }

  onAlertDismiss = () => {
    this.setState({ alertmsg: "", isonerror: false });
  }

  handleSubmit() {
      var alertmsg = "Invalid or incorrect information is provided.";
      this.setState({alertmsg: alertmsg, isonerror: true});
  }

  onNext = (e) =>{
    e.preventDefault();

    const s = this.state;
    if(s.selected === s.wizsteps.length-1){
      const ans = window.confirm("Do you want to exit?");
      if(ans){
        window.close();
      }
    }
    else if(s.selected > 0){
      const configfile = s.appData.fi_ust_conf_path;
      const cd = this.processConfigDataForServer(s.configData);
      const ausers = cd.adobe_users;
      const dusers = cd.directory_users;

      let isok = false;
      if(s.selected === 1){
        const ent = ausers.connectors.umapi_data.enterprise;
        if(ent.api_key && ent.client_secret && ent.org_id && ent.tech_acct 
          && ent.priv_key_path){
          isok= true;
        }
      }
      else if (s.selected === 2){
        const ldap = dusers.connectors.ldap_data;
        if(ldap.host && ldap.username && (ldap.password || ldap.secure_password_key) && ldap.base_dn 
          && ldap.all_users_filter && ldap.user_email_format && ldap.group_filter_format){
          isok= true;
        }
      }
      else if(s.selected === 3){
        if(dusers.default_country_code && dusers.user_identity_type 
          && dusers.groups.length > 0 && cd.limits.max_adobe_only_users > 0){
          isok= true;
        }
      }

      if(isok){
        const stage = s.selected === 1 ? "umapi" :
                          s.selected === 2 ? "ldap" : "ust";

        this.saveConfigFile(configfile, cd, stage, ()=>{
          this.setState(prevState => ({
            selected: prevState.selected < prevState.wizsteps.length-1 ? ++prevState.selected : prevState.selected,
            cancontinue : true
          }));
          console.log("Saved.");
        });

        this.setState(prevState => ({
          configview : false,
          cancontinue : false
        }));
        console.log("Saving data...");
      }
      else{
        alert("Invalid information provided.\r\nPlease fill in all required information.")
      }
    } 
    else {
      this.setState(prevState => ({
        selected: prevState.selected < prevState.wizsteps.length-1 ? ++prevState.selected : prevState.selected,
        configview : false,
        cancontinue : true
      }));
    }
  }

  onBack = () =>{
    this.setState(prevState => ({
      selected: prevState.selected > 0 ? --prevState.selected : prevState.selected,
      configview : false
    }));  
  }
  
  showHelp = (msgstr) => {
    this.setState({helpstring: msgstr});
  }

  onLoadConfig = () => {
    this.loadConfigFile(this.state.appData.fi_ust_conf_path);
  }

  onSaveConfig = () => {
  }

  render() {
    const s = this.state;

    return (
      <div>
        <Navbar color="dark" className="navbar-dark" fixed="top">
          <NavbarBrand href="#">
            <img src={logo} style={{width: 30, height: 30}} className="d-inline-block align-top" alt="" />
            <span style={{ marginLeft:10}}>User Sync Tool<small style={{ textTransform: "uppercase", color:"darkgray" }}>&nbsp;&nbsp;Configuration Wizard</small></span>
          </NavbarBrand>
        </Navbar>
        <Container fluid>
          <Row>
            <Col tag="main" sm={9} className="ml-sm-auto pt-3" role="main">
              <Container fluid={true}>              
                  <Row>
                    <Col sm={12} style={{marginTop:-10}}>
                      <ul className="progress-tracker progress-tracker--text progress-tracker--text-top">
                        {
                          s.wizsteps.map((k, i) => 
                            <li key={i} className={"progress-step " + 
                              (s.selected === i ? "is-active" : i < s.selected ? "is-complete": "") 
                            }>
                              <span className={"progress-text " + (s.selected === i ? "text-primary" :"")}>
                                <span className="progress-title"></span>
                                <small>{k.title}</small>
                              </span>
                              <span className="progress-marker"><i className={"fa "+ k.icon}></i></span>
                            </li>)
                        }                        
                      </ul>
                    </Col>      
                  </Row>
                  <Row>
                      <Col sm={12} style={{overflowX: "auto", borderRight:"1px solid lightgray", marginBottom: 30, height:330}}>
                          <Alert 
                            color={this.state.isonerror? "danger": "success"} 
                            isOpen={this.state.alertmsg?true: false} toggle={this.onAlertDismiss}
                            style={{margin:10}}
                            >
                              {this.state.alertmsg}
                          </Alert>
                          {
                            s.selected === 0 ? <Home showHelp={this.showHelp} onLoadConfig={this.onLoadConfig} configData={s.configData} appData={s.appData} /> :
                              s.selected === 1 ? <UMAPIConfig showHelp={this.showHelp} configData={s.configData} appData={s.appData} /> :
                                s.selected === 2 ? <LDAPConfig showHelp={this.showHelp} configData={s.configData} appData={s.appData} /> : 
                                  s.selected === 3 ? <USTConfig showHelp={this.showHelp} configData={s.configData} appData={s.appData} /> :
                                    <Summary showHelp={this.showHelp} configData={s.configData} />
                          }
                      </Col>
                  </Row>
              </Container>
            </Col>
            <Col sm={3} style={{padding:10, paddingRight: 15}}>
              <div style={{ marginTop:95}}>
                <span>{s.helpstring}</span>
              </div>
            </Col>
          </Row>
        </Container>
        <Navbar color="light" className="navbar-light bg-faded" fixed="bottom">
          <div>
              <Button size="sm" color="primary" style={{marginLeft:5, minWidth: 125}} onClick={this.onNext} disabled={!s.cancontinue}>
                {s.selected === 0 ? "Continue" : s.selected === s.wizsteps.length-1 ? "Close" : "Save & Continue"}
              </Button>
              {
                s.selected !== 0 ?
                  <Button color="link" size="sm"onClick={this.onBack}>Back</Button> : null
              }
          </div>
        </Navbar>
      </div>
    );
  }

  processConfigDataFromServer(cd){
    return cd;
  }

  processConfigDataForServer(cd){
    const groups = cd.directory_users.groups;
    const groups_new = [];
    for(let g in groups){
      groups_new.push({ 
        directory_group: groups[g].directory_group, 
        adobe_groups: groups[g].adobe_groups
      });
    }
    cd.directory_users.groups = groups_new;    
    return cd;
  }

  loadConfigFile(configFile){ 
    let configHandlerPath = remote.getGlobal('configHandlerPath');
    console.log("Loading config-handler from "+ configHandlerPath);

    const configHandler = spawn(configHandlerPath, ['load', '-c', configFile]);
    configHandler.stdout.on('data', (data) => {
      this.setState({ 
        configData: JSON.parse(data),
        cancontinue: true
      });
    });
    configHandler.stderr.on('data', (data) => {
      alert(`Error loading config: ${data}`);
    });
    configHandler.stdin.write('{}');
    configHandler.stdin.end();
  }

  saveConfigFile(configFile, d, connector, callback){
    let configHandlerPath = remote.getGlobal('configHandlerPath');
    //console.log(JSON.stringify(d));
    
    const configHandler = spawn(configHandlerPath, ['save', '-c', configFile, '-o', connector]);
    
    configHandler.stdout.on('data', (data) => {
      console.log(`Saved - ${data}`);
      if(callback) {
        callback();
      }
    });

    configHandler.stderr.on('data', (data) => {
      alert(`Error saving config: ${data}`);
    });

    configHandler.stdin.write(JSON.stringify(d));
    configHandler.stdin.end();
  }
}
