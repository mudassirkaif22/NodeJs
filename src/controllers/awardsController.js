import { awards , users, awardsTypeModel } from "../models/index.js";
import moment from "moment";
import { Sequelize, DataTypes, col } from "sequelize";
import roleModel from "../models/roleModel.js";

const nomination = awards;
const user = users;
const award = awardsTypeModel;

//Fetching Assign Employees of particular manager
const getAssignedEmployees = async (req, res) => {
  const manager_id = req?.user?.id;
  const getassignedemployees = await user.findAll({
    where: { manager_id },
    attributes: {
      exclude: [
        "date_of_birth",
        "probation_status",
        "designation_id",
        "password",
        "email",
        "role_id",
        "deletedAt",
        "createdAt",
        "updatedAt",
        "manager_id",
      ],
    },
  });
  res.status(200).send(getassignedemployees);
};

//Performing nomination (Post API)
const nominate = async (req, res) => {
  try {
    const { user_id, award_Type, description } = req.body;
    const manager_id = req.user.id;
    if (!manager_id) {
      return res.status(404).json({ error: `Invalid token` });
    }
    const existingNomination = await nomination.findOne({ where: { user_id, award_Type, manager_id } });
    if (existingNomination) {
      return res.status(409).json({ error: ` Existing Nomination found ` });
    }
    const nominate = await nomination.create({
      user_id: req.body.user_id,
      award_Type: req.body.award_Type,
      manager_id: manager_id,
      date: new Date(),
      description: description,
    });
    return res.status(201).json({ message: "Nomination Done Successfully", nominate });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

//get all nominations
const getAllnominations = async (req, res) => {
  const getallnominate = await nomination.findAll({
    raw: true,
    nest: true,
    where: { deletedAt: null },
    attributes: [
      "description",
      [col("nominees.name"), "user_name"],
      [col("nominees.id"), "id"],
      [col("award_type.name"), "award_name"],
    ],
    include: [
      {
        model: user,
        as: "nominees",
        attributes: [],
      },
      {
        model: award,
        as: "award_type",
        attributes: [],
      },
    ],
  });
  res.status(200).send(getallnominate);
};

//update nomination
const updateNomination = async (req, res) => {
  const { is_awarded } = req.body;
  const id = req.params.id;
  try {
    //here check the user role is manager or not
    if (!["admin", "super_admin", "manager"].includes(req?.user?.role)) {
      return res.status(403).json({ message: "Only authorized user can access this route." });
    }
    const existingNomination = await nomination.findOne({ where: { id, deletedAt: null } });

    if (!existingNomination) {
      return res.status(404).json({ error: `Nomination not found ` });
    }

    const awards = await existingNomination.update(
      {
        is_awarded,
      },
      { where: { id: existingNomination.id } },
    );

    res.status(200).json({ message: "Nomination updated successfully" });
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

//delete nomination
const deleteNomination = async (req, res) => {
  let id = req.params.id;
  try {
    const existingNomination = await nomination.findByPk(id);
    if (!["admin", "super_admin"].includes(req?.user?.role)) {
      return res.status(403).json({ message: "Only authorized user can access this route." });
    }

    if (!existingNomination) {
      return res.status(404).json({ error: `Award Nomination not found with id ${id}` });
    }
    await nomination.update(
      {
        deletedAt: new Date(),
      },
      { where: { id: id } },
    );

    res.status(200).send("Award nomination is deleted !");
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

//get nomination by id
const getNominationById = async (req, res) => {
  const id = req.params.id;
  try {
    const existingNomination = await nomination.findByPk(id);

    if (!existingNomination || existingNomination.deletedAt !== null) {
      return res.status(404).json({ error: `Nomination not found with id ${id}` });
    }

    const getbyidnomination = await nomination.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send(getbyidnomination);
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

//get api for award winner
const getAllwinners = async (req, res) => {
  let award_winner = await nomination.findAll({
    where: { is_awarded: true },
    attributes: {
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    },
    raw: true,
  });
  res.status(200).send(award_winner);
};

export  {
  getAssignedEmployees,
  nominate,
  getAllnominations,
  updateNomination,
  deleteNomination,
  getAllwinners,
  getNominationById,
};
