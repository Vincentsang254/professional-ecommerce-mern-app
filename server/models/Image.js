module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define("Images", {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  });

  return Images;
};
