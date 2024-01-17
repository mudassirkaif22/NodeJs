import { awardsTypeModel as AwardsType } from "../models/index.js";

const createAwards = async (req, res) => {
  const image_path = req.file.path.replace(/\\/g, "/");
  const imageUrl = image_path;
  const info = {
    name: req.body.name,
    description: req.body.description,
    awardImage:imageUrl,
  };
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can access this route." });
    }
    const awardName = await AwardsType.findOne({ where: { name: req.body.name } });
    if (awardName) {
      return res.status(409).json({ message: "Name already exist" });
    }
    const award = await AwardsType.create(info);
    res.status(200).send({ message: "Award Added Successfully" });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

//get All Awards
const getAllAward = async (req, res) => {
  const award = await AwardsType.findAll({
    where: {
      deletedAt: null,
    },
    attributes: ["id", "name", "description","awardImage"],
  });

  res.status(200).send(award);
};

//get Award By Id
const getAwardbyId = async (req, res) => {
  const id = req.params.id;
  try {
    const existingAward = await AwardsType.findByPk(id);

    if (!existingAward) {
      return res.status(404).json({ error: `Award not found  ${id}` });
    }

    const award = await AwardsType.findOne({
      where: { id: existingAward.id },
      attributes: ["id", "name","description","awardImage"],
    });

    res.status(200).send(award);
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
};

//update Award
const updateAward = async (req, res) => {
  const id = req.params.id;
  const imageUrl = req.file.path.replace(/\\/g, "/");
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can access this route." });
    }
    const existingAward = await AwardsType.findByPk(id);

    if (!existingAward) {
      return res.status(404).json({ error: `Award not found with id ${id}` });
    }
    const info = {
      name: req.body.name,
      description: req.body.description,
      awardImage: imageUrl,
    };

    await AwardsType.update(info, {
      where: { id: existingAward.id },
      return: true,
    });

    res.status(200).send({ message: "Updated Succefully", attributes: [info] });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

//deleted Award Type
const deleteAward = async (req, res) => {
  const id = req.params.id;

  const existingAward = await AwardsType.findByPk(id);
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can access this route." });
    }
    if (!existingAward) {
      return res.status(404).json({ error: `Award not found ${id}` });
    }

    await AwardsType.update(
      {
        deletedAt: new Date(),
      },
      { where: { id } },
    );
    res.status(200).send("Aaward Type deleted ");
  } catch (error) {
    return res.status(500).json({ message: "Internal server error. " });
  }
};

export  {
  createAwards,
  getAllAward,
  getAwardbyId,
  updateAward,
  deleteAward,
};
