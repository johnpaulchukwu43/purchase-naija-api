const mongoose = require('./baseMongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
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
        if (password.length < 3 || password.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

const passwordValidate = [
    {
        validator: passwordLengthChecker, message : 'Password must be between 3 and 50 characters'
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


const adminSchema = new Schema ({
    username: { type: String, required: true, unique: true, validate: usernameValidate } ,
    password: { type: String, required: true, validate: passwordValidate }
});

// hash the password

adminSchema.pre('save', function (next) {
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

adminSchema.methods.comparePassword = function(password,cb){
    return bcrypt.compare(password,this.password,cb);
};

adminSchema.methods.hashPassword = function(password,cb){
    bcrypt.hash(password, salt, (err, hash) => {
        if (err){
            console.log("hashing error"+err);
            cb({success:false,error:err});
        }else{
            cb({success:true,hashedPassword:hash});
        }
    });
};

module.exports = mongoose.model('admin', adminSchema);
