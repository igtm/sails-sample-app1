/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,


    attributes: {
        name: {
            type: 'string',
            required: true
        },
        title: {
            type: 'string'
        },
        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true
        },
        admin: {
            type:'boolean',
            defaultsTo:false
        },
        online: {
            type:'boolean',
            defaultsTo:false
        },
        encryptedPassword: {
            type: 'string'
        }
        /*,
         toJSON: function(){
         var obj = this.toObject();
         delete obj.password;
         delete obj.confirmation;
         delete obj.encryptedPassword;
         delete obj._csrf;
         return obj;
         }*/

    },
    beforeValidation: function(values, next){
        console.log(values);
        /*if(typeof values.adminCheck !== 'undefined'){
            console.log("first");

            if(values.admin === 'unchecked'){
                console.log("second");
                values.admin = false;
            }else if(values.admin[1] == 'on'){
                console.log("third");
                values.admin = true;
            }
        }*/
        if(values._modifyAdmin){
            values.admin = values.adminCheck === 'on';
            values.adminCheck = 'undefined';
            values._modifyAdmin = 'undefined';
            console.log(values);
        }

        next();
    },

    beforeCreate: function(values, next){
        if(!values.password || values.password != values.confirmation){
            return next({err: ["Password doesn't match password confirmation."]});
        }
        require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
            if(err) return next(err);
            values.encryptedPassword = encryptedPassword;
            next();
        })
    }
};

