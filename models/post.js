module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
  });

  Post.associate = function(models) {
    Post.belongsTo(models.User);
    Post.hasMany(models.Comment);
    Post.hasMany(models.Image); // This line establishes a relationship between Post and Image models
  };

  return Post;
};
