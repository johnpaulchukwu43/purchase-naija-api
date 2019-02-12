import React, {Component} from 'react';

import Breadcrumb from "../common/breadcrumb";
import connect from "react-redux/es/connect/connect";
import {userSignupRequest} from "../../actions/AuthActions";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import PasswordField from "../common/form/PasswordField";
import FormField from "../common/form/FormField";
import EmailField from "../common/form/EmailField";

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            password: '',
            email: '',
            email_value:'',
            password_value:'',
            firstName_value:'',
            lastName_value:'',
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
            "firstname": this.state.firstName_value,
            "lastname": this.state.lastName_value
        };
        console.log(JSON.stringify(requestBody));
        this.props.userSignupRequest(requestBody).then(res=>{
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
            this.setState({ isLoading: false});
            let response = this.props.response;
            if (response.error) {
                toast.error(response.error.message);
            }
        });

        console.log(JSON.stringify(this.state))
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
    firstNameChanged= this.fieldStateChanged('firstName');
    lastNameChanged= this.fieldStateChanged('lastName');
    passwordChanged = this.fieldStateChanged('password');



    render() {

        const  {email, password, firstName, lastName} = this.state;
        const formValidated = firstName && lastName && password && email;

        // validation function for the fullname
        // ensures that fullname contains at least two names separated with a space
        const validateFullname = value => {
            const regex = /^[a-z]{2,}$/i;
            if (!regex.test(value)) throw new Error('Name should be at least two characters');
        };
        return (
            <div>
                <Breadcrumb title={'create account'}/>


                {/*Regsiter section*/}
                <section className="register-page section-b-space">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3>create account</h3>
                                <div className="theme-card">
                                    <form className="theme-form" onSubmit={this.onSubmit}>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                {/** Render the fullname form field passing the name validation fn **/}
                                                <FormField type="text" fieldId="firstName"  onChange={this.onChange} label="First Name" placeholder="Enter Fullname"
                                                           validator={validateFullname} onStateChanged={this.firstNameChanged} required />
                                            </div>

                                            <div className="col-md-6">
                                                <FormField type="text" fieldId="lastName"  label="Last Name" placeholder="Enter Last Name"
                                                           validator={validateFullname} onStateChanged={this.lastNameChanged} required />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-6">
                                                {/** Render the email field component **/}
                                                <EmailField fieldId="email" label="Email" placeholder="Enter Email Address" onStateChanged={this.emailChanged} required />
                                            </div>

                                            <div className="col-md-6">
                                                {/** Render the password field component using thresholdLength of 7 and minStrength of 3 **/}
                                                <PasswordField fieldId="password" label="Password"
                                                               placeholder="Enter Password"
                                                               onStateChanged={this.passwordChanged} thresholdLength={7}
                                                               minStrength={3} required/>
                                            </div>
                                            {/** Show the form button only if all fields are valid **/}
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

Register.propTypes = {
    userSignupRequest: PropTypes.func.isRequired
};
Register.contextTypes = {
    router: PropTypes.object.isRequired
};
const mapStateToProps = (state) => {
    return {
        response: state.auth
    };
};



export default connect(mapStateToProps, {userSignupRequest})(Register);
