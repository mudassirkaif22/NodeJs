export default (sequelize, DataTypes) => {
  const Nomination = sequelize.define("awards", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Please enter your User Id",
        },
      },
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: new Date(),
    },

    award_Type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please select award_Type ",
        },
      },
    },

    is_awarded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Please enter description",
        },
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Nomination;
};
