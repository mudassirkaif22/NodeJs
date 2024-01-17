import {config} from "../config/dbConfig.js";
import createUserModel from "./userModel.js";
import createRoleModel from "./roleModel.js";
import createuser_profileModel from "./userProfileModel.js";
import createDesignationModel from "./designationModel.js";
import createAwardModel from "./awardsModel.js";
import createAwardsTypeModel from "./awardsTypeModel.js";
import createProbationModel from "./probationModel.js";

import { Sequelize, DataTypes } from "sequelize";

const { DB, USER, PASSWORD, HOST,  dialect,  pool } = config;
const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
 dialect,
  operatorsAliases: false,

  pool: {
    max: pool.max,
    min: pool.min,
    acquire: pool.acquire,
    idle: pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user_profile = createuser_profileModel(sequelize,DataTypes);
db.users = createUserModel(sequelize, DataTypes);
db.role = createRoleModel(sequelize,DataTypes);
db.designation = createDesignationModel(sequelize,DataTypes);
db.awards = createAwardModel(sequelize,DataTypes);
db.awardsTypeModel = createAwardsTypeModel(sequelize,DataTypes);
db.probationModel = createProbationModel(sequelize,DataTypes);

db.sequelize.sync({ force: false });

//one to many user and role
//one user can have many role
db.role.hasMany(db.users, {
  foreignKey: "role_id",
});

db.users.belongsTo(db.role, {
  foreignKey: "role_id",
});

//one to one user and their profile
//one user can have one profile
db.user_profile.belongsTo(db.users, {
  foreignKey: "user_id",
});
db.users.hasOne(db.user_profile, {
  foreignKey: "user_id",
});

//one user can have one designation
db.designation.hasOne(db.users, {
  foreignKey: "designation_id",
});

db.users.belongsTo(db.designation, {
  foreignKey: "designation_id",
});

db.users.hasMany(db.users, {
  as: "reportees",
  sourceKey: "id",
  foreignKey: "manager_id",
});

db.users.hasOne(db.users, {
  as: "reportingManager",
  sourceKey: "manager_id",
  foreignKey: "id",
});

db.users.belongsTo(db.role, {
  as: "roleInfo",
  sourceKey: "id",
  foreignKey: "role_id",
});
// one user can have one probation period
db.probationModel.belongsTo(db.users, {
  foreignKey: "userid",
});
db.users.hasOne(db.probationModel, {
  foreignKey: "userid",
});

db.users.hasOne(db.user_profile, {
  as: "profile",
  sourceKey: "id",
  foreignKey: "user_id",
});
//Nominations
db.users.hasMany(db.awards, { foreignKey: "user_id" });
db.users.hasMany(db.awards, { foreignKey: "manager_id", as: "nominator" });
db.awards.belongsTo(db.users, { as: "nominees", sourceKey: "id", foreignKey: "user_id" });

//For Nomination & Award table
db.awardsTypeModel.hasMany(db.awards, {
  foreignKey: "award_Type",
});
//Associates a nomination with the award its nominated for.
db.awards.belongsTo(db.awardsTypeModel, { as: "award_type", sourceKey: "id", foreignKey: "award_Type" });

export let{probationModel,role,user_profile,users,awards,awardsTypeModel,designation}= db;
export {sequelize};
