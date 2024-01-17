export default (Sequelize, DataTypes) => {
  const Role = Sequelize.define("role", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  });
  return Role;
};
