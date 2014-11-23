/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    // 一覧表示。user全ての配列を取得
    index: function(req, res, next){
        User.find(function foundUsers (err, users){
            if(err) return next(err);
            res.view({
                users: users
            });
        });
    },
    // 個別ページ id -> そのidのuserオブジェクトをviewへ送り描画
    show: function(req, res, next){
        User.findOne(req.param('id'), function foundUser(err, user){
            if(err) return next(err);
            if(!user) return next();
            res.view({
                user:user
            });
        });
    },

	'new': function(req,res){
        // policies内に記述
        //res.locals.flash = _.clone(req.session.flash);
        res.view();
        //req.session.flash = {};
    },
    // createメソッドをオーバーライド
    create: function(req, res, next){
        console.log("create");
        User.create(req.params.all(), function userCreated (err, user){
            if(err){
                console.log(err);
                req.session.flash = {
                    err:err
                };

                return res.redirect('user/new');
            }
            req.session.authenticated = true;
            req.session.User = user;

            user.online = true;
            user.save(function(err, user){
                if(err) return next(err);

                res.redirect('/user/show/'+user.id);
            });

            //res.json(user);

            //req.session.flash = {};
        });
    },
    // 編集画面　id -> そのidのuserオブジェクトをviewへ送り描画
    edit: function(req, res){
        User.findOne(req.param('id'), function foundUser (err, user){
            if(err) return next(err);
            if(!user) return next();
            res.view({
                user: user
            });
        });
    },
    update: function(req, res, next){
        User.update(req.param('id'), req.params.all(), function userUpdated(err){
            if(err){
                return res.redirect('/user/edit/'+ req.param('id'));
            }
            // 追加変更（自分の情報をeditした時、sessionへの変更をする）
            if(req.session.User.id == req.param('id')){
                req.session.User = req.params.all();
            }

            res.redirect('/user/show/' + req.param('id'));
        })
    },
    destroy: function(req, res, next){
        User.findOne(req.param('id'), function foundUser(err, user){
            if(err)return next(err);
            if(!user) return next("User doesn't exist.");
            User.destroy(req.param('id'), function userDestroyed(err){
                if(err) return next(err);
            });
            res.redirect('/user');

        });
    }
};

