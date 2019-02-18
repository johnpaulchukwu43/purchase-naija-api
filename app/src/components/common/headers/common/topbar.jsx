import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual'
import PropTypes from 'prop-types';
import {connect} from "react-redux";


class TopBar extends Component {



    render() {
        const {translate} = this.props;
        return (
            <div className="top-header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="header-contact">
                                <ul>
                                    <li>{translate('topbar_title', { theme_name: ' Purchase Naija' })}</li>
                                    <li><i className="fa fa-phone" aria-hidden="true"></i>{translate('call_us')}:  +234 808 638 8339</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 text-right">
                            <ul className="header-dropdown">
                                <li className="mobile-wishlist compare-mobile"><Link to={`${process.env.PUBLIC_URL}/compare`}><i className="fa fa-random" aria-hidden="true"></i>{translate('compare')}</Link></li>
                                <li className="mobile-wishlist"><Link to={`${process.env.PUBLIC_URL}/wishlist`}><i className="fa fa-heart" aria-hidden="true"></i>{translate('wishlist')}</Link></li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


TopBar.contextTypes = {
    router: PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps)(withTranslate(TopBar));
