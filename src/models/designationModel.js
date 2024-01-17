export default (Sequelize, DataTypes) => {
  const Designation = Sequelize.define("designation", {
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  });
  return Designation;
};
