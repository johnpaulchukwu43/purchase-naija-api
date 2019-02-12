import React, {Component} from 'react';
import {connect} from 'react-redux';
import Breadcrumb from "../common/breadcrumb";
import TextFieldGroup from "../common/TextFieldGroup";
import {loginServiceProviderRequest} from "../../actions/AuthActions";
import PropTypes from 'prop-types';
import {toast} from "react-toastify";
import isEmpty from "lodash/isEmpty";
import {Link} from "react-router-dom";

class LoginServiceProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businessName: '',
            password: '',
            errors: {},
            isLoading: false,
        };

        this.onSubmit = this.onSubmit.bind(this);
        LoginServiceProvider.validateInputs = LoginServiceProvider.validateInputs.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    static validateInputs() {
        let errors = {};
        console.log("State:" + JSON.stringify(this.state));
        const name_regex = /^[a-z]{2,}$/i;
        if (!name_regex.test(this.state.businessName)) {
            errors.businessName = "businessName is required"
        }
        console.log("password length:" + this.state.password.length);
        if (this.state.password.length < 7) {
            errors.password = 'password field is required';
        }

        console.log("errors are :" + JSON.stringify(errors));
        return {
            errors,
            isValid: isEmpty(errors)
        };
    }

    isValid() {

        const {errors, isValid} = LoginServiceProvider.validateInputs();


        if (!isValid) {
            this.setState({errors});
        }

        return isValid;
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({errors: {}, isLoading: true});
            let requestBody = {"businessName": this.state.businessName, "password": this.state.password};
            this.props.loginServiceProviderRequest(requestBody).then(res=>{
                //todo handle proper routing after successful login
                this.setState({ isLoading: false});
                let response = this.props.response;
                if (response.error) {
                    toast.error(response.error.message);
                }else{
                    toast.info("Welcome");
                    this.context.router.history.push('/');
                }
            }).catch((err)=>{
            })
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }


    render() {

        const {errors, businessName, password, isLoading} = this.state;

        return (
            <div>
                <Breadcrumb title={'Login Service Provider'}/>
                {/*Login section*/}

                <section className="login-page section-b-space">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="theme-card">
                                    <form className="theme-form" onSubmit={this.onSubmit}>
                                        {errors.form && <div className="alert alert-danger">{errors.form}</div>}

                                        <TextFieldGroup
                                            field="businessName"
                                            label="businessName"
                                            value={businessName}
                                            error={errors.businessName}
                                            onChange={this.onChange}
                                        />
                                        <TextFieldGroup
                                            field="password"
                                            label="Password"
                                            value={password}
                                            error={errors.password}
                                            onChange={this.onChange}
                                            type="password"
                                        />
                                        <button className="btn btn-solid" disabled={isLoading}>Login</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-6 right-login">
                                <h3>Become a Seller Today!</h3>
                                <div className="theme-card authentication-right">
                                    <h6 className="title-font">Create Account</h6>
                                    <p>Register your business on Purchase Naija store. Registration is quick and easy.
                                        It
                                        allows you to sell you goods/services on our platform. Click
                                        register to begin.</p>

                                    <Link className="btn btn-solid"
                                          to={`${process.env.PUBLIC_URL}/pages/service-provider/register`}
                                          data-lng="en">
                                        Create an Account
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

LoginServiceProvider.propTypes = {
    loginServiceProviderRequest: PropTypes.func.isRequired
};
LoginServiceProvider.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        response: state.auth
    };
};
export default connect(mapStateToProps, {loginServiceProviderRequest})(LoginServiceProvider);
