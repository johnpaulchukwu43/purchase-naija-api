import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual'
import { logout } from '../../../../actions/AuthActions';
import PropTypes from 'prop-types';
import {connect} from "react-redux";


class TopBar extends Component {

    logout(e) {
        e.preventDefault();
        this.props.logout();
        this.context.router.history.push('/');
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        const {translate} = this.props;

        const guestLinks = (
            <li className="onhover-dropdown mobile-account">
                Register
                <ul className="onhover-show-div">
                    <li>
                        <Link to={`${process.env.PUBLIC_URL}/pages/user/register`} data-lng="en">
                            <i className="fa fa-user" aria-hidden="true"></i>
                            Shop on Purchase Naija
                        </Link>
                    </li>
                    <li>
                        <Link to={`${process.env.PUBLIC_URL}/pages/service-provider/register`} data-lng="en">
                            <i className="fa fa-user" aria-hidden="true"></i>
                            Become a Seller
                        </Link>
                    </li>
                </ul>
            </li>

        );

        const userLinks = (
            <li className="onhover-dropdown mobile-account">
                    Account
                <ul className="onhover-show-div">
                    <li>
                        <Link to={`${process.env.PUBLIC_URL}/pages/user/login`} data-lng="en">DashBoard</Link>
                    </li>
                    <li>
                        <a href="#" onClick={this.logout.bind(this)}>Logout</a>
                    </li>
                </ul>
            </li>
        );
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
                                { isAuthenticated ? userLinks : guestLinks }
                                {
                                    !isAuthenticated &&
                                    <li className="onhover-dropdown mobile-account">
                                        <Link to={`${process.env.PUBLIC_URL}/pages/service-provider/login`} data-lng="en">
                                            <i className="fa fa-user-circle" aria-hidden="true"></i>Login
                                        </Link>
                                    </li>

                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

TopBar.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

TopBar.contextTypes = {
    router: PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps, { logout })(withTranslate(TopBar));
