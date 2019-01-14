import _ from 'lodash'
import bcrypt from 'bcrypt'
import Auth from './auth'
import {ObjectID} from 'mongodb'

class User{
    constructor(db){
        this.db = db;
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
        }
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
    toJSON() {
        return this.model;
    }

}
export default User;
