import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import passwordValidator  from 'password-validator'

export default function validateInput(data) {
   // noinspection JSPotentiallyInvalidConstructorUsage
    const min_error ='min';
    const uppercase_error ='uppercase';
    const lowercase_error ='lowercase';
    const digits_error ='digits';

    const error_messages = ['Minimum of 8 Characters','Must Contain Uppercase','Must Contain Lowercase','Minimum of 1 digit'];
    let schema = new passwordValidator();
   schema.is().min(8)
       .has().uppercase()
       .has().lowercase()
       .has().digits();

  let errors = {};
  if (!Validator.isEmail(data.email)) {
    errors.identifier = 'This field is required';
  }

  // if (schema.validate(data.password,{list:true}).length !== 0) {
  //     let list_errors = schema.validate(data.password,{list:true});
  //   errors.password = 'This field is required';
  // }
    if(data.password.length <7){
        errors.password = 'This field is required';
    }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
