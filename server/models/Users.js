module.exports = (sequelize, DataType) => {

    const Users = sequelize.define("Users",{
        username:{
            type: DataType.STRING,
            allowNull: false,
        },
        password:{
            type: DataType.STRING,
            allowNull: false,
        },
        profileImage: {
            type: DataType.STRING,
            allowNull: true,
        },          
    });

    Users.associate = (models) => {
        Users.hasMany(models.Likes, {
            onDelete: "cascade",
        });

        Users.hasMany(models.Posts, {
            onDelete: "cascade",
        });
    };

    return Users;
};