import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

export default class extends React.Component {
    render() {
        return (
            <div>
                <Breadcrumb style={{padding:"0.5rem 0.5rem"}}>
                    <BreadcrumbItem><a href="#">Home</a></BreadcrumbItem>
                    <BreadcrumbItem active>User Sync Tool Configurations</BreadcrumbItem>
                </Breadcrumb>
            </div>
        );
    }
}