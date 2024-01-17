import { probationModel, users } from "../models/index.js";
import { Op } from "sequelize";
import moment from "moment"; // for date manipulation

const probation = probationModel;
const user = users;

//Fetching Assign Employees of particular manager
const getAssignedEmployees = async (req, res) => {
  const manager_id = req?.user?.id;
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "only manager can access this route" });
    }
    const getassignedemployees = await probation.findAll({
      where: { manager_id },
      attributes: {
        exclude: ["password", "email", "role_id", "deletedAt", "createdAt", "updatedAt", "manager_id"],
      },
    });
    res.status(200).send(getassignedemployees);
  } catch (error) {
    res.status(403).json({
      status: "Error",
      message: error.message,
    });
  }
};

// fetching all probation those are going to end today

const getALLprobation = async (req, res) => {
  // Calculate the start of the day
  const manager_id = req?.user?.id;
  const todayStart = moment().startOf("day");
  try {
    if (req?.user?.role !== "manager") {
      return res.status(403).json({ message: "only manager can access this route" });
    }
    const probationlist = await probation.findAll({
      where: { manager_id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        manager_id,
        probation_end_date: {
          [Op]: [todayStart],
        },
      },
    });
    // counting how many employees are there
    const count = probationlist.length;
    res.status(200).send({ count, probationlist });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// get Probation by Id

const getProbationById = async (req, res) => {
  const id = req?.params.id;
  const manager_id = req?.user?.id;
  try {
    if (req?.user?.role !== "manager") {
      return res.status(403).json({ message: "Only manager can access this route" });
    }
    const existingProbation = await user.findByPk(id);

    if (!existingProbation) {
      return res.status(404).json({ error: `Probation not found  ${id}` });
    }

    const probationlist = await probation.findOne({
      where: { userid: existingProbation.id, manager_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.status(200).send(probationlist);
  } catch (error) {
    res.status(403).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Update Probation

const updateProbation = async (req, res) => {
  const {
    probation_end_date,
    quality_of_work,
    quantity_of_work,
    ability_tobe_trained,
    attitude_towards_job,
    appearance,
    punctuality,
    relations_with_other,
    isProbation_extended,
    attendance,
    probation_status,
  } = req.body;
  const id = req.params.id;
  const manager_id = req?.user?.id;

  try {
    //here check the user role is admin or not
    if (req?.user?.role !== "manager") {
      return res.status(403).json({ message: "Only manager can access this route." });
    }
    const existingProbation = await user.findOne({ where: { id, manager_id } });

    if (!existingProbation) {
      return res.status(404).json({ error: `User not found with id ${id}` });
    }

    await probation.update(
      {
        probation_end_date,
        quality_of_work,
        quantity_of_work,
        ability_tobe_trained,
        attitude_towards_job,
        appearance,
        punctuality,
        relations_with_other,
        isProbation_extended,
        attendance,
        probation_status,
      },
      { where: { userid: existingProbation.id } },
    );
    await user.update(
      {
        probation_status,
      },
      { where: { id: existingProbation.id } },
    );
    res.status(200).json({ message: "Probation updated successfully" });
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

export  { getAssignedEmployees, getALLprobation, updateProbation, getProbationById };
