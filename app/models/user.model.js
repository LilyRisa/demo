module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      fogotPassword:{
        type: Sequelize.STRING
      },
      tokenExpires: {
        type: Sequelize.DATE
      },
      activity: {
        type:Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };