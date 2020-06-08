//File to display and parse the most recent log

import React from "react";

const fs = window.require('fs');

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            log: ""
        }
    }
    render(){
        return (<div className="form">
        <div className="row">
            <legend>Log View </legend>
            <div className="col-sm-12">
                <div style={{ border: "1px solid lightgray", backgroundColor:"whitesmoke", padding: "15px 15px 0px 15px", margin: "15px 0px", borderRadius: 4, fontSize: "0.75rem", overflowY:"hidden", overflowX:"hidden" }}>
                    <pre style = {{height: 240}}>
                            {this.state.log}
                    </pre>            
                </div>
            </div>
        </div>
    </div>);
    }
    componentDidMount() {     
        let today = new Date();
        let date;
        let month = today.getMonth()+1;
        let day = today.getDate();
        if(month <= 10 && day >= 10){
            date=today.getFullYear() +"-" + "0" + parseInt(month) + "-" + day;
        }
        else if(day <= 10 && month >= 10){
            date=today.getFullYear() +"-" + parseInt(month) + "-" + "0" + day;
        }
        else if(day <= 10 && month <= 10){
            date=today.getFullYear() +"-" + "0" + parseInt(month) + "-" + "0" + day;
        }
        else{
            date=today.getFullYear() +"-" + parseInt(month) + "-" + day;
        }
        let logTemp;
        try {
            let file = "C:\\Program Files\\Adobe\\Adobe User Sync Tool2\\logs\\" + date + ".log";
           logTemp =  fs.readFileSync(file,"utf8",function (data) {
                return data;
              }
            )
            let str = logTemp.lastIndexOf("Start Run");
            logTemp = logTemp.substring(str);
            str = "============ ";
            logTemp = str.concat(logTemp);
            this.setState({log: logTemp}); 
        } catch (error) {
            this.setState({log: "No logs today"})            
        }
    }
}