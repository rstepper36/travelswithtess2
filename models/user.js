module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      canPost: DataTypes.BOOLEAN
    });
  
    User.associate = function(models) {
      User.hasMany(models.Post);
      User.hasMany(models.Comment);
    };
  
    return User;
  };
  