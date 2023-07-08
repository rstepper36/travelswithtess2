module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        imageUrl: DataTypes.STRING,
        PostId: DataTypes.INTEGER // Foreign Key reference to the Post this image is associated with
    });

    Image.associate = function(models) {
        Image.belongsTo(models.Post); // An image belongs to a single post
    };

    return Image;
};
