import _ from 'lodash'
import bcrypt from 'bcrypt'
import {ObjectID} from 'mongodb'
import jwt from 'jsonwebtoken';
import {Auth} from "./auth";

const saltRounds = 10;


class User{



    constructor(app){
        this.app = app;
        this.model = {
            firstName : null,
            lastName:null,
            billingAddress1:null,
            billingAddress2:null,
            phoneNumber:null,
            email:null,
            password:null,
            isAdmin : null,
            createdAt: null,
            updatedAt:null,
        };

    }


    initWithObject(obj){

        this.model.firstName = _.trim(_.get(obj, 'firstName', null));
        this.model.lastName = _.toLower(_.trim(_.get(obj, 'lastName', null)));
        this.model.billingAddress1 = _.get(obj, 'billingAddress1', null);
        this.model.billingAddress2 = _.get(obj, 'billingAddress2', null);
        this.model.phoneNumber = _.get(obj, 'phoneNumber', null);
        this.model.email = _.get(obj, 'email', null);
        this.model.password = _.get(obj, 'password', null);
        this.model.isAdmin = _.get(obj, 'isAdmin', false);
        this.model.createdAt = new Date();
        return this;
    }

    /*
    validate request when creating  new users
     */
    validate(cb = () => {}){
        const MIN_PASSWORD_LENGTH = 3;


        let errors = [];


        const model = this.model;
        const db = this.app.db;


        if(model.password.length < MIN_PASSWORD_LENGTH  ){

            errors.push({
                message: "Password should more than 8 characters."
            });
        }

        this.findUserByEmail(model.email, (err, user) => {


            if(err || user){

                errors.push({message: "Email already exists."});
            }


            return cb(errors);
        });



    }

    findUserByEmail(email = null, callback = () => {}){
        const db = this.app.db;

        const query = {
            email: email
        };
        db.collection('users').find(query).limit(1).toArray((err, result) => {
            return callback(err, _.get(result, '[0]', null));
        });


    }

    /*
        call back for creating new users
     */
    create(cb){
        let model = this.model;
        const db = this.app.db;
        const hashPassword = bcrypt.hashSync(model.password, saltRounds);
        model.password = hashPassword;

        this.validate((errors) => {



            let messages = [];

            if(errors.length > 0){

                _.each(errors, (err) => {

                    messages.push(err.message);
                });

                return cb(_.join(messages, ','), null);

            }

            db.collection('users').insertOne(model, (err, result) => {
                return cb(err, model);
            });

        });

    }

    /*
        Handle user login
     */
    login(email, password, callback = () => {}){

        const app = this.app;

        let error = null;
        // let user = {name: "A", email: "test@gmail.com"};

        console.log("Email: ", email, "password:", password);

        if(!email || !password){

            error = {message: "Email or password is required."};
            return callback(error, null);
        }

        this.findUserByEmail(email, (err, user) => {


            if(err === null && user){
                //compare the password gotten from user and the one already saved in db
                const passwordCheck = bcrypt.compareSync(password, user.password);

                if(passwordCheck){

                    // create new token and return this token key for user and use it for later request.
                    const auth = new Auth(app);

                    auth.createToken(user,(err, token) => {
                        if(err){
                            error = {message: "An error login your account"};
                            return cb(error, null);
                        }
                        delete user.password;
                        return callback(null, {token:token});
                    });
                }
                else{
                    error = {message: "Password does not match."};
                    return callback(error, null);

                }
            }
            if(err || !user){
                error = {message: "An error login your account"};

                return callback(error, null);
            }
        });


    }

}
export default User;
