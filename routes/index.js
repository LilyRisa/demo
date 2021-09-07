const { verifySignUp, verifyFogotPassword,authJwt } = require("../app/middleware");
const {login, register} = require("../app/controller/auth.controller");
const {forgot, fotget} = require("../app/controller/fogot.controller");
const Login = require('../app/controller/login.page')
const passport = require('passport')

const {getListUser, getUserByUsername,updateUserByID, deleteUserByID} = require('../app/controller/user.controller')

const LoginController = new Login()

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    register
  );

  app.post("/api/auth/signin", login);

  app.get('/forgot_check/:token',[verifyFogotPassword.checkTokenFogotPassword], (req, res) => {
    return res.status(200).send({
      message: "token hop le!",
      url_change_password: 'http://' + req.headers.Host + '/forgot_update/' + req.params.token
    });
  });
  app.post('/forgot_update/:token',[verifyFogotPassword.checkTokenFogotPassword], forgot);

  app.get('/fotget/:email', fotget);

  app.get('/login-page',LoginController.view)

  app.get('/auth/facebook', passport.authenticate('facebook',{ scope: [ 'email' ] }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/login-page',session: false }),
    function(req, res){
      res.redirect('/success_auth_facebook')
    } );
  app.get('/success_auth_facebook',LoginController.success)

  app.get('/user/list', getListUser)
  app.get('/user/get/:username', getUserByUsername)

  app.put('/user/update/:id',[
    authJwt.verifyToken,
    authJwt.isAdmin
  ],updateUserByID)

  app.delete('/user/delete/:id',[
    authJwt.verifyToken,
    authJwt.isAdmin
  ],deleteUserByID)
};