const db = require("../config/db");
const config = require("../config/auth.config");
const User = db.user;
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt = require("bcryptjs");
module.exports = {
    forgot(req, res){
        if(req.body.password == req.body.repassword){
            User.findOne({
                where: {
                    fogotPassword: req.params.token,
                }
              }).then((user, err, next)=>{
                if (!user) {
                    return res.status(500).send({ message: "user not found!" });
                }
                user.password = bcrypt.hashSync(req.body.password, 8);
                user.fogotPassword = null;
                user.tokenExpires = null;
                user.save().then(function(err) {
                    // if(err){
                    //     return res.status(500).send({ message: "server error!" });
                    // }
                    return res.status(200).send({ message: "update password successfully!" });
                })
              });
        }else{
            return res.status(404).send({ message: "re-password Not invalid." });
        }
    },
    fotget(req, res){
        console.log("forget");
        async.waterfall([
              function(done) {
                crypto.randomBytes(20, function(err, buf) {
                  var token = buf.toString('hex');
                  done(err, token);
                });
              },
              function(token, done) {
                User.findOne({
                    where: { 
                        email: req.params.email 
                    }
                }).then((user,err, next) => {
                    console.log(user);
                  if (!user) {
                    return res.status(404).send({ message: "email not found" });
                  }
                  user.fogotPassword = token;
                  user.tokenExpires = Date.now() + 36000000; // 1 hour
          
                  user.save().then((err)=> {
                      console.log(err);
                      console.log("save");
                    done(null, token, user);
                  });
                });
              },
              function(token, user, done) {
                console.log(token);
                console.log(user);
          
                // var smtpTrans = nodemailer.createTransport("SMTP",{
                //     service: 'Gmail', 
                //     auth: {
                //         user: 'bui.nthl@gmail.com', // generated ethereal user
                //         pass: '1995oklangtu', // generated ethereal password
                //       }
                //  });
                var smtpTrans = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                                user: 'bui.nthl@gmail.com', // generated ethereal user
                                pass: 'kwlcfqbhvcubsmiw', // generated ethereal password
                  }
                });
                   //and other stuff
                var mailOptions = {
          
                  to: user.email,
                  from: 'myemail',
                  subject: 'Node.js Password Reset',
                  text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.Host + '/forgot_check/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          
                };
          
                smtpTrans.sendMail(mailOptions).then(function(err) {
                  console.log('sent')
                  return res.status(200).send({ 
                      message: 'An e-mail has been sent to ' + user.email + ' with further instructions.',
                      option: mailOptions
                 });
                });
          }
            ], function(err) {
              console.log('this err' + ' ' + err)
              return res.status(500).send({ message: err });
            });
    }
}