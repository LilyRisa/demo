const db = require("../config/db");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

module.exports = {
    getListUser(req, res){
        User.findAll().then(user => {
            user.forEach(item => {
                item.activity = (item.activity == null || item.activity == 0) ? false : true
            });
            res.status(200).send(user);
        })
        .catch(err=>{
            res.status(500).send({'error': '500 server error!'});
        })
    },
    getUserByUsername(req, res){
        User.findOne({where: {
            username : req.params.username
        }}).then((user) => {
            console.log(user)
            res.status(200).send(user);
        })
        .catch(err=>{
            res.status(500).send({'error': '500 server error!'});
        })
    },

    async updateUserByID(req, res){
     let userID = req.params.id;
     let user = await User.findOne({
        where: { 
            id: userID
        }
    });
    if(!user){
        return res.status(500).send({'error': 'User not found!'});
    }
    user.address = req.body.address;
    user.bio = req.body.bio;
    user.avatar = req.body.avatar;
    await user.save();
    return res.status(200).send({'status': `User :${userID} update successfuly`});
    },
    async deleteUserByID(req, res){
        let userID = req.params.id;
        let user = await User.findOne({
           where: { 
               id: userID
           }
       });
       if(!user){
           return res.status(500).send({'error': 'User not found!'});
       }
       await user.destroy();
       return res.status(200).send({'status': `User ${userID} delete successfuly`});
    }
}

