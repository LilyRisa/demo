
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = class Login{
    view(req, res){
        res.render('login')
    }

    success(req, res){
        res.render('success')
    }
}