/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// 暗号化モジュール
var bcrypt = require('bcrypt');

module.exports = {
	'new': function(req, res, next){
        //var oldDateObj = new Date();
        //var newDateObj = new Date(oldDateObj.getTime() + 60000);
        //req.session.cookie.expires = newDateObj;
        //req.session.authenticated = true;
        //console.log(req.session);
        res.view(); //session/new
    },

    create: function(req, res, next){
        //どちらか１つが空
        if(!req.param('email') || !req.param('password')){
            var usernamePasswordRequiredError = [{name: 'usernamePasswordRequiredError',message:'You must enter both a username and password.'}];
            req.session.flash = {
                err: usernamePasswordRequiredError
            };
            console.log(req.session.flash.err);
            res.redirect('/session/new');
            return;
        }
        User.findOneByEmail(req.param('email'), function(err, user){
            if(err) return next(err);
            //emailが該当しない
            if(!user){
                var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found.'}];
                req.session.flash = {
                    err: noAccountError
                };
                return res.redirect('/session/new');
            }
            bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid){
                if(err) return next(err);
                // passwordが違う
                if(!valid){
                    var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid user and password comination.'}];
                    req.session.flash = {
                        err: usernamePasswordMismatchError
                    };
                    return res.redirect('/session/new');
                }
                // サインイン成功！
                req.session.authenticated = true;
                req.session.User = user;

                user.online = true;
                user.save(function(err, user){
                    if(err) return next(err);

                    if(req.session.User.admin){
                        return res.redirect('/user');
                    }

                    res.redirect('/user/show/'+user.id);
                });
            })
        });
    },
    destroy: function(req, res, next){
        User.update(req.session.User.id, {online: false}, function(err){
           if(err) return next(err);
        });

        req.session.destroy();
        res.redirect('/session/new');
    }
};

