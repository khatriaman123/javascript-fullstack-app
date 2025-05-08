module.exports = (sequelize, DataType) => {

    const Posts = sequelize.define("Posts",{
        title:{
            type: DataType.STRING,
            allowNull: false,
        },
        postText:{
            type: DataType.STRING,
            allowNull: false,
        },
        username:{
            type: DataType.STRING,
            allowNull: false,
        },
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: "cascade",
        });

        Posts.hasMany(models.Likes, {
            onDelete: "cascade",
        });
    };
    return Posts;
};