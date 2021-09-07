const db = require("../config/db");
const User = db.user;

checkTokenFogotPassword = (req, res, next) => {
    User.findOne({
        where: {
            fogotPassword: req.params.token,
            // resetPasswordExpires: { $gt: Date.now() }
        }
      }).then((user)=>{
        if (user) {
          console.log(user.tokenExpires);
          console.log(Date.now());
          if(user.tokenExpires > Date.now()){
            next();
            return
          }
          return res.status(403).send({
            message: "token het han!"
          });
        }
        
           return res.status(403).send({
                message: "token khong hop le!"
              });
      
      });
}

const verifyFogotPassword = {
  checkTokenFogotPassword: checkTokenFogotPassword,
};

module.exports = verifyFogotPassword;