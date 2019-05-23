const mongoose = require('./baseMongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const auditSchema = require('./auditable');
var salt = bcrypt.genSaltSync(2);


const usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else {
        if (username.length < 7 || username.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

const validPasswordChecker = (password) => {
    if (!password){
        return false;
        } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
}

const passwordLengthChecker = (password) => {
    if(!password){
        return false;
    } else {
        if (password.length < 6 || password.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

const emailLengthChecker = (email) => {
    if(!email){
        return false;
    } else {
        if (email.length < 3 || email.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

const validEmailChecker = (email) => {
    if (!email){
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

const validPhone = (phoneNumber) => {
    if (!phoneNumber){
        return false;
    } else {
        const regExp = new RegExp(/^\d+$/);
        return regExp.test(phoneNumber);
    }
}

const passwordValidate = [
    {
        validator: passwordLengthChecker, message : 'Password must be between 6 and 50 characters'
    },
    {
        validator: validPasswordChecker, message: 'Password is invalid - Password must have a lowercase, uppercase letter, a symbol and atleast a number'
    }
];
const usernameValidate = [
    {
        validator: usernameLengthChecker, message : 'Username must be between 7 and 50 characters'
    }
];
const emailValidate = [
    {
        validator: emailLengthChecker, message : 'Email must be between 3 and 50 characters'
    },
    {
        validator: validEmailChecker, message: 'Email is invalid'
    }
];

const phoneNumberValidate = [
    {
        validator: validPhone, message : 'Phone number must contain only numbers/digits'
    }
];
var providerSchema = Object.assign({},{
    businessName: { type: String, required: true, unique: true } ,
    email: { type: String, required: true, unique: true, validate: emailValidate } ,
    billingAddress: { type: String, required: true },
    phoneNumber: { type: String, validate: phoneNumberValidate },
    status:{type:String,required:true,default:"ACTIVE"},
    password: { type: String, required: true, validate: passwordValidate }
},auditSchema);

const serviceProviderSchema = new Schema (providerSchema);

serviceProviderSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, salt, (err, hash) => {
        if (err){
            console.log(err);
            next(err);
        }else{
            this.password = hash;
            next();
        }
    });
});

serviceProviderSchema.methods.comparePassword = function(password,cb){
    return bcrypt.compare(password, this.password,cb);
};

serviceProviderSchema.methods.hashPassword= function(password,cb){
    bcrypt.hash(password, salt, (err, hash) => {
        if (err){
            console.log("hashing error"+err);
            cb({success:false,error:err});
        }else{
            cb({success:true,hashedPassword:hash});
        }
    });
};


module.exports = mongoose.model('serviceProvider', serviceProviderSchema);
