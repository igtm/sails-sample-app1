/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    // 一覧表示。user全ての配列を取得
    index: function(req, res, next){
        User.find(function  (err, users){
            if(err) return next(err);
            res.view({
                users: users
            });
        });
    },
    // 個別ページ id -> そのidのuserオブジェクトをviewへ送り描画
    show: function(req, res, next){
        User.findOne(req.param('id'), function (err, user){
            if(err) return next(err);
            if(!user) return next();
            res.view({
                user:user
            });
        });
    },

	'new': function(req,res){
        res.view();
    },
    // createメソッドをオーバーライド
    create: function(req, res, next){
        User.create(req.params.all(), function (err, user){
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
            });
            // socket送信！！
            User.publishCreate(user, req.socket);
            res.redirect('/user/show/'+user.id);
            //res.json(user);

            //req.session.flash = {};
        });
    },
    // 編集画面　id -> そのidのuserオブジェクトをviewへ送り描画
    edit: function(req, res){
        User.findOne(req.param('id'), function (err, user){
            if(err) return next(err);
            if(!user) return next();
            res.view({
                user: user
            });
        });
    },
    update: function(req, res, next){
        User.update(req.param('id'), req.params.all(), function(err){
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
        User.findOne(req.param('id'), function (err, user){
            if(err)return next(err);
            if(!user) return next("User doesn't exist.");
            User.destroy(req.param('id'), function (err){
                if(err) return next(err);
            });
            // 消えましたよ〜と皆に伝えます。
            User.publishDestroy(req.param('id'),req.socket); // req.socketってのは自分
            res.redirect('/user');

        });
    },
    subscribe: function(req, res, next){
        User.find(function(err, users){
            if(err) return next(err);

            // subscribe this socket to the User model classroom
            //User.subscribe(req.socket); <- 今や使えなくなってる watchを使えばいいが、config/blueprints/autowatch:trueでOK!
            User.watch(req.socket);
            // subscribe this socket to the User  instance room
            User.subscribe(req.socket, users);
        });
        // this will avoid a waring from the socket for tyring to render HTML over the socket
        res.send(200);
    }
};

