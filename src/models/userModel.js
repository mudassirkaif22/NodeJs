export default (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Please enter your name" } },
    },

    password: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: {
        len: {
          args: [6, 100], // Minimum and maximum password length
          msg: "Password must be between 6 and 100 characters",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: "Please enter a valid email address" } },
    },

    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { isDate: { msg: "Please enter a valid date of birth" } },
    },

    probation_status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending",
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notNull: { msg: "Please enter your role id" } },
    },

    deletedAt: {
      type: DataTypes.DATE,
    },

    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notNull: { msg: "Please enter manager id" } },
    },

    designation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notNull: { msg: "Please enter designation id" } },
    },
  });
  return User;
};
