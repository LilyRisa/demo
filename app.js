var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const db = require("./app/config/db");
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { config, engine } = require('express-edge');

const cors = require("cors");

// HTTPS SSL
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(`${__dirname}/localhost/server.key`, 'utf8');
var certificate = fs.readFileSync(`${__dirname}/localhost/server.crt`, 'utf8');
var credentials = {key: privateKey, cert: certificate};


var corsOptions = {
    origin: "http://localhost:8081"
  };

var app = express();
// https
const port = 4000;
// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log("server starting on port : " + port)
});
// view template render
// edge
config({ cache: true });
app.use(engine);
app.set('views', `${__dirname}/views`)

app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


require('./routes')(app);

app.use('/users', usersRouter);

//import user
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");
//passport facwebook



passport.use(new FacebookStrategy({
  clientID: "1019569538777767",
  clientSecret: "1fc094640c7d42f47e1a3ca6d775a969" ,
  callbackURL: "https://localhost:4000/auth/facebook/callback",
  profileFields: [ 'email' , 'name' ]
},
function(accessToken, refreshToken, profile, done) {
  User.findOne({
    where:{'email': profile.emails[0].value },
    raw: true,
    nest: true,
  }).then(user => {
    if(user){
      done(null,user)
    }else{
      User.create({
        username: profile.id,
        email: profile.emails[0].value,
        password: bcrypt.hashSync('facebook_asf', 8)
      })
        .then(user => {
          console.log(user);
          console.log('đã đến phần cấp role')
            // user role = 1
            user.setRoles([1]).then(() => {
              console.log('cấp role thành công')
              return done(null, {username : user.username, email: user.email});
            }).catch(err => {
              return done(err);
            });
          
        })
        .catch(err => {
          return done(err);
        });
    }
  });
  // console.log(profile);
  // console.log(accessToken);
}
));

// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

// function initial() {
//     Role.create({
//       id: 1,
//       name: "user"
//     });
   
//     Role.create({
//       id: 2,
//       name: "moderator"
//     });
   
//     Role.create({
//       id: 3,
//       name: "admin"
//     });
//   }

module.exports = app;
