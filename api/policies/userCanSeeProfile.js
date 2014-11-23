/**
 * Created by Tomokatsu on 14/11/23.
 */
// admin か 自分の画面である。
module.exports = function(req, res, next){
  var sessionUserMatchesId = req.session.User.id == req.param('id');
  var isAdmin = req.session.User.admin;
    if(!(sessionUserMatchesId || isAdmin)){
        var noRightsError = [{name:'noRightsError', message:'You must be an admin.'}];
        req.session.flash = {
            err: noRightsError
        };
        return res.redirect('/session/new');
    }
    return next();
};