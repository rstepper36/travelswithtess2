module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
       UserId: DataTypes.INTEGER,
       imageURL: DataTypes.STRING // new image field attribute
    });
  
    Post.associate = function(models) {
      Post.belongsTo(models.User);
      Post.hasMany(models.Comment);
    };
  
    return Post;
  };
  