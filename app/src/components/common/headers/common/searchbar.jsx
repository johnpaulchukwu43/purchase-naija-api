import React, {Component} from 'react';
class   Search extends Component {

    constructor (props) {
        super (props)

    }

    render (){


        return (
            <div>
                {/*Search section*/}
                <form className="">
                    <div className="input-group">
                        <input type="text" className="form-control"
                               aria-label="Amount (to the nearest Naira)"
                               placeholder="Search Products......" />
                        <div className="input-group-append">
                            <button className="btn btn-solid"><i
                                className="fa fa-search"></i>Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Search
