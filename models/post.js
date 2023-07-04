module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      title: DataTypes.STRING,
      content: DataTypes.TEXT
    });
  
    Post.associate = function(models) {
      Post.belongsTo(models.User);
      Post.hasMany(models.Comment);
    };
  
    return Post;
  };
  