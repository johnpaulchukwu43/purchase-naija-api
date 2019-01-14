import _ from 'lodash'
import jwt from 'jsonwebtoken'
import common from "../lib/common";
let config = common.getConfig();



 class Auth {
	constructor(app){
		this.app = app;
		this.createToken = this.createToken.bind(this);

	}
	createToken(user, cb = () => {}){
	    const config = this.app.config;
        let token = jwt.sign(user,
            config.secret,
            {
                expiresIn: config.tokenExpiration // expires in 24 hours
            }
        );
        return cb(null,token);
	}
}

let  checkAuth = (req,res,next)=>{
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next()
            }
        });
    }
    else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }


}
module.exports={
    Auth:Auth,
    checkAuth:checkAuth
};