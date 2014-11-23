module.exports = function(req, res, next){
    res.locals.flash = {};
    if(!req.session.flash) return next();

    res.locals.flash = _.clone(req.session.flash);
    return next();
    // nextはおそらくcontrollerに行ってっていうやつ。無いと動かなくなる。
};