export default (Sequelize, DataTypes) => {
  const awards_type = Sequelize.define("awards_type", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    awardImage: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  });
  return awards_type;
};
