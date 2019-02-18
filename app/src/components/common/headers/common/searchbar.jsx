import React, {Component} from 'react';
class   Search extends Component {

    constructor (props) {
        super (props)

    }

    render (){
        const searchContainer ={
            width:"100%"
        };

        return (
            <div style={searchContainer}>
                {/*Search section*/}
                <form className="">
                    <div className="input-group">

                        <input type="text" className="form-control"
                               aria-label="Amount (to the nearest Naira)"
                               placeholder="Search......" />
                        <div className="input-group-btn">
                            <button type="button" className="dropdown-toggle search-categories"
                                    data-toggle="dropdown">All Categories <span className="caret"></span></button>
                            <ul className="dropdown-menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li className="divider"></li>
                                <li><a href="#">Separated link</a></li>
                            </ul>
                        </div>
                        <div className="input-group-append">
                            <button className="btn btn-solid">
                                <i className="fa fa-lg fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Search
