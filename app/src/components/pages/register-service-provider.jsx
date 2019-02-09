import React, {Component} from 'react';

import Breadcrumb from "../common/breadcrumb";
import connect from "react-redux/es/connect/connect";
import {SignUpServiceProviderRequest} from "../../actions/AuthActions";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import PasswordField from "../common/form/PasswordField";
import FormField from "../common/form/FormField";
import EmailField from "../common/form/EmailField";

class RegisterServiceProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businessName: '',
            billingAddress: '',
            phoneNumber: '',
            email: '',
            password: '',
            email_value:'',
            businessName_value:'',
            billingAddress_value:'',
            phoneNumber_value:'',
            password_value:'',
            isLoading: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    onSubmit(e)     {
        e.preventDefault();
        this.setState({ isLoading: true});
        let requestBody = {
            "email": this.state.email_value,
            "password": this.state.password_value,
            "businessName": this.state.businessName_value,
            "billingAddress": this.state.billingAddress_value,
            "phoneNumber": this.state.phoneNumber_value,
        };
        this.props.SignUpServiceProviderRequest(requestBody);
        this.setState({ isLoading: false});
        let response = this.props.response;
        console.log(response);
        if(response.error){
            toast.error(response.error.message)
        }else{

            toast.info('Successfully Created Service Provider Account', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            this.context.router.history.push('/');
        }
    }

    onChange(e) {
        this.setState({
            value:{[e.target.name]: e.target.value}
        });
    }

    // higher-order function that returns a state change watch function
    // sets the corresponding state property to true if the form field has no errors
    fieldStateChanged = field => state => this.setState({
        [field]: state.errors.length === 0,
        [field+"_value"]:state.value
    });

    // state change watch functions for each field
    emailChanged = this.fieldStateChanged('email');
    businessNameChanged= this.fieldStateChanged('businessName');
    billingAddressChanged= this.fieldStateChanged('billingAddress');
    phoneNumberChanged= this.fieldStateChanged('phoneNumber');
    passwordChanged = this.fieldStateChanged('password');



    render() {

        const  {email, password, businessName, billingAddress, phoneNumber} = this.state;
        const formValidated = billingAddress && businessName && password && email && phoneNumber;

        // validation function for the fullname
        // ensures that fullname contains at least two names separated with a space
        const validateFullname = value => {
            const regex = /^[a-z]{2,}$/i;
            if (!regex.test(value)) throw new Error('Invalid Name:  should be at least two characters');
        };

        const validateAddress = value => {
            const regex = /^[a-zA-Z0-9\s,'-]*$/;
            if (!regex.test(value)) throw new Error('Invalid Address');
        };
        const validatePhoneNumber = value =>{
            const regex =/^\d{11,}$/;
            if (!regex.test(value)) throw new Error('Invalid PhoneNumber: Phone Number must be 11 digits ');

        };
        return (
            <div>
                <Breadcrumb title={'create Service Provider Account'}/>
                {/*Regsiter section*/}
                <section className="register-page section-b-space">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3>Join Us Today !</h3>
                                <div className="theme-card">
                                    <form className="theme-form" onSubmit={this.onSubmit}>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                {/** Render the fullname form field passing the name validation fn **/}
                                                <FormField type="text" fieldId="firstName"  onChange={this.onChange} label="Business Name" placeholder="Enter Business Name"
                                                           validator={validateFullname} onStateChanged={this.businessNameChanged} required />
                                            </div>

                                            <div className="col-md-6">
                                                <FormField type="text" fieldId="billingAddress"  label="billingAddress" placeholder="Enter billingAddress"
                                                           validator={validateAddress} onStateChanged={this.billingAddressChanged} required />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                {/** Render the email field component **/}
                                                <EmailField fieldId="email" label="Email" placeholder="Enter Email Address" onStateChanged={this.emailChanged} required />
                                            </div>
                                            <div className="col-md-6">
                                                <FormField type="text" fieldId="phoneNumber"  label="phoneNumber" placeholder="Enter phoneNumber"
                                                           validator={validatePhoneNumber} onStateChanged={this.phoneNumberChanged} required />
                                            </div>


                                            {/** Show the form button only if all fields are valid **/}
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                {/** Render the password field component using thresholdLength of 7 and minStrength of 3 **/}
                                                <PasswordField fieldId="password" label="Password"
                                                               placeholder="Enter Password"
                                                               onStateChanged={this.passwordChanged} thresholdLength={7}
                                                               minStrength={3} required/>
                                            </div>

                                        </div>
                                        <div className="form-row">
                                            <button type="button" disabled={this.state.isLoading || !formValidated} className="btn btn-solid" onClick={this.onSubmit}>create Account</button>

                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

RegisterServiceProvider.propTypes = {
    SignUpServiceProviderRequest: PropTypes.func.isRequired
};
RegisterServiceProvider.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        response: state.auth
    };
};



export default connect(mapStateToProps, {SignUpServiceProviderRequest})(RegisterServiceProvider);
