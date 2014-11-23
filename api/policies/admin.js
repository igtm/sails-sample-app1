/**
 * Created by Tomokatsu on 14/11/23.
 */
// adminしか入れないようにしている。　それ以外は、session/newへエラーと共に飛ぶ。8
module.exports = function(req, res, next){
    if(req.session.User && req.session.User.admin){
        return next();
    }
    var requireAdminError = [{name:'requireAdminError',message:'You must be an admin.'}];
    req.session.flash = {
        err: requireAdminError
    };
    res.redirect('/session/new');
    return;
};