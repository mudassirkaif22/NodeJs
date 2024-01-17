export default (Sequelize, DataTypes) => {
  const Probation = Sequelize.define("probation", {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    date_of_joining: {
      type: DataTypes.DATEONLY,
    },
    manager_id: {
      type: DataTypes.INTEGER,
    },
    probation_end_date: {
      type: DataTypes.DATEONLY,
    },
    quality_of_work: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    quantity_of_work: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    ability_tobe_trained: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    attitude_towards_job: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    appearance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    punctuality: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    relations_with_other: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },

    probation_status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
    isProbation_extended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    attendance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
  });
  return Probation;
};
