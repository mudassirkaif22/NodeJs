import { users as _users, role, user_profile } from "../models/index.js";
import { hash } from "bcrypt";
import { Sequelize, DataTypes, col } from "sequelize";

const User = _users;
const Role = role;
const UserProfile = user_profile;

//get all users
const getAllUser = async (req, res) => {
  const users = await User.findAll({
    raw: true,
    nest: true,
    where: { deletedAt: null },
    attributes: [
      "id",
      "name",
      "date_of_birth",
      "email",
      "probation_status",
      [col("reportingManager.name"), "reportingManager"],
      [col("roleInfo.name"), "role"],
      [col("profile.gender"), "gender"],
      [col("profile.address"), "address"],
      [col("profile.mobile_no"), "mobile_no"],
      [col("profile.probation_end_date"), "probation_end_date"],
      [col("profile.date_of_joining"), "date_of_joining"],
    ],
    include: [
      {
        model: User,
        as: "reportingManager",
        attributes: [],
      },
      {
        model: Role,
        as: "roleInfo",
        attributes: [],
      },
      {
        model: UserProfile,
        as: "profile",
        attributes: [],
      },
    ],
  });

  res.status(200).send(users);
};

//get all managers
const getAllManagers = async (req, res) => {
  try {
    const roles = await Role.findOne({ where: { name: "manager" }, raw: true });
    const managers = await User.findAll({
      where: { role_id: roles.id, deletedAt: null },
      attributes: ["id", "name"],
    });
    res.status(200).send(managers);
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

//update user
const updateUser = async (req, res) => {
  const {
    name,
    password,
    role_id,
    email,
    gender,
    address,
    date_of_birth,
    manager_id,
    designation_id,
    mobile_no,
    is_probation_extended,
    probation_end_date,
    date_of_joining,
  } = req.body;
  const id = req.params.id;
  try {
    //here check the user role is admin or not
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can access this route." });
    }
    const existingUser = await User.findOne({ where: { id, deletedAt: null } });

    if (!existingUser) return res.status(404).json({ error: `User not found with id ${id}` });

    const hashedPassword = await hash(password, 10);
    const user = await User.update(
      {
        name,
        designation_id,
        manager_id,
        date_of_birth,
        password: hashedPassword,
        role_id,
        email,
      },
      { where: { id: existingUser.id } },
    );

    await UserProfile.update(
      {
        name,
        gender,
        email,
        address,
        mobile_no,
        date_of_birth,
        date_of_joining,
        probation_end_date,
        is_probation_extended,
      },
      { where: { user_id: existingUser.id } },
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

//get user by id
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const existingUser = await User.findOne({
      where: { id, deletedAt: null },
    });

    if (!existingUser) {
      return res.status(404).json({ error: `User not found with id ${id}` });
    }

    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "deletedAt", "role_id", "manager_id"],
      },
      include: [
        {
          model: User,
          as: "reportingManager",
          attributes: ["id", "name"],
        },
        {
          model: Role,
          as: "roleInfo",
          attributes: ["id", "name"],
        },
        {
          model: UserProfile,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "user_id", "id"],
          },
        },
      ],
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

//delete user
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    //here checking the user role is admin or not
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can access this route." });
    }

    await User.update({ deletedAt: new Date() }, { where: { id } });

    res.status(200).send("User is deleted successfully!");
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

//get all reportees under manager
const getAllReportees = async (req, res) => {
  const manager_id = req?.user?.id;
  try {
    const allReportees = await User.findAll({
      where: { manager_id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "deletedAt", "salt_value", "role_id", "manager_id"],
      },
      include: [
        {
          model: User,
          as: "reportingManager",
          attributes: ["id", "name"],
        },
        {
          model: Role,
          as: "roleInfo",
          attributes: ["id", "name"],
        },
        {
          model: UserProfile,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "user_id", "id"],
          },
        },
      ],
    });
    return res.status(200).json({
      message: "Welcome to your profile, " + req.user.name + "!",
      reporteesName: allReportees,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export  {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllManagers,
  getAllReportees,
};
