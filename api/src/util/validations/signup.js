import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import passwordValidator  from 'password-validator'

export default function validateInput(data) {
    // noinspection JSPotentiallyInvalidConstructorUsage
    const min_error ='min';
    const uppercase_error ='uppercase';
    const lowercase_error ='lowercase';
    const digits_error ='digits';



  	


    let errors = {};
    const MIN_SIZE =7;
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Valid Email field is required';
    }


    if (!Validator.isAlpha(data.firstName)) {
        errors.firstName ='First name can be characters only';
    }

    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First name field is required';
    }

    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = 'lastName field is required';
    }

    if (!Validator.isAlpha(data.lastName)) {
        errors.lastName ='Last name can be characters only';
    }

   
    if(data.password<MIN_SIZE) {
        errors.password = 'invalid password';
	//todo make sure Password must contain Minimum of 8 Characters,1 Uppercase,1 Lowercase and Minimum of 1 digit
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}
