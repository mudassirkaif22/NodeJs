export default (sequelize, DataTypes) => {
  const UseProfileDetails = sequelize.define("user_profile", {
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      validate: { notEmpty: { msg: "Please enter your name" } },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    gender: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: {
          args: [["male", "female"]],
          msg: "please specify gender",
        },
      },
    },

    address: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: { notEmpty: { msg: "Please enter your address" } },
    },

    mobile_no: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: { msg: "You must enter Phone Number" },
        len: { args: [10, 10], msg: "Phone Number is invalid" },
      },
    },

    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    probation_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    is_probation_extended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    date_of_joining: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { isDate: { msg: "Please enter a valid date of joining" } },
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    deletedAt: {
      type: DataTypes.DATE,
    },
  });

  return UseProfileDetails;
};
