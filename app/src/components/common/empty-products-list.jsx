
import {Component} from 'react';
import {Link} from "react-router-dom";
import React from "react";

class EmptyProductList extends Component{

    constructor(){
        super();

    }

    render(){
        return(
            <div className="row">
                <div className="col-sm-12 text-center section-b-space no-found">
                    <div className="alert custom-alert-warning" role="alert">
                        <i className="fa fa-5x fa-database"></i>
                    </div>
                    <h3>No Products here yet! </h3>
                    <p>You can browse our other categories</p>
                    <Link to={`${process.env.PUBLIC_URL}/`} class="btn btn-outline">Continue shopping</Link>
                </div>
            </div>
        )
    }
}

export default EmptyProductList;
