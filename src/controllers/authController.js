import { generateToken, refreshToken } from "../middleware/authMiddleware.js";
import { hash, compare } from "bcrypt";
import { users, role, user_profile, probationModel, sequelize, designation } from "../models/index.js";

const secretKey = process.env.SECREAT_KEY;

const User = users;
const Role = role;
const userProfile = user_profile;
const Designation = designation;
const probation = probationModel;

// passed verify token from route-> middleware -> controller

// Register a new user only accessible to admins
const registerUser = async (req, res) => {
  //getting the field from user req body
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
    date_of_joining,
  } = req.body;
  const transaction = await sequelize.transaction();
  const trimName = await name.trim();
  try {
    if (!["admin", "super_admin"].includes(req?.user?.role)) {
      return res.status(403).json({ message: "Only admins & super_admin can access this route." });
    }

    const user = await User.findOne({ where: { email }, raw: true });

    if (user) {
      return res.status(409).json({ message: `User Is Already Registered with id : ${email}` });
    }

    // Calculate the probation end date as 6 months from the Date Of Joining
    const dateOfJoining = new Date(date_of_joining);
    const probationEndDate = new Date(dateOfJoining);
    probationEndDate.setMonth(dateOfJoining.getMonth() + 6);

    //checking role id valid or not
    const userRole = await Role.findOne({ where: { id: role_id } });
    if (!userRole) return res.status(400).json({ message: "Invalid role specified." });

    const manager = await Role.findOne({ where: { name: "manager" } });
    const specificManager = await User.findOne({ where: { id: manager_id, role_id: manager.id } });
    if (!specificManager) return res.status(400).json({ message: "Invalid manager specified." });

    const designation = await Designation.findOne({ where: { id: designation_id } });
    if (!designation) return res.status(400).json({ message: "Invalid designation specified." });

    // Hash the password before saving it to the database
    const hashedPassword = await hash(password, 10); // 10 is the salt rounds

    //creating new user
    const newUser = await User.create(
      {
        name: trimName,
        designation_id,
        manager_id,
        date_of_birth,
        password: hashedPassword, // Save the hashed password
        role_id: userRole.id,
        email,
      },
      { transaction },
    );

    //here storing more information of  user in user profile table
    await userProfile.create(
      {
        name: trimName,
        gender,
        email,
        address,
        mobile_no,
        date_of_birth,
        user_id: newUser.id,
        date_of_joining,
        probation_end_date: probationEndDate,
        is_probation_extended,
      },
      { transaction },
    );
    // storing details in probation period
    await probation.create(
      {
        name: trimName,
        email,
        userid: newUser.id,
        date_of_joining,
        probation_end_date: probationEndDate,
        manager_id,
      },
      { transaction },
    );
    await transaction.commit();
    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    await transaction.rollback();
    //handling Sequelize Validation Error
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((errorItem) => {
        return res.status(400).json({ message: errorItem.message });
      });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

// Login api
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      //return plain js obj
      raw: true,
      nest: true,
      where: { email, deletedAt: null },
      attributes: ["id", "name", "email", "password"],
      //including role model
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    //comparing password
    if (!(await compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    //generate the token -> calling the function from middleware
    const accessToken = generateToken(user);
    const refToken = refreshToken(user);
    if (user.password) {
      delete user.password;
    }
    return res.status(200).json({ accessToken, refreshToken: refToken, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Getting Specific User By JWT Token
const UserProfile = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "deletedAt", "role_id"],
      },
      include: [
        {
          model: userProfile,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "user_id"],
          },
        },
      ],
    });

    return res.status(200).json({
      message: "Welcome to your profile, " + req.user.name + "!",
      userData: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
//Refresh Token
const refToken = async (req, res) => {
  const { refToken } = req.body;

  try {
    if (!refToken) return res.status(403).json({ message: "Refresh Token Is Missing" });
    // Verify the refresh token
    const decoded = jwt.verify(refToken, secretKey);

    const user = await User.findOne({
      raw: true,
      nest: true,
      where: { id: decoded.id },
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    if (!user) return res.status(403).json({ message: "Invalid refresh token." });

    const accessToken = generateToken(user);
    const refToken1 = refreshToken(user);

    return res.status(200).json({ accessToken, refreshToken: refToken1 });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Session is expired.Please log in again" });
    }
    return res.status(403).json({ message: "Invalid refresh token." });
  }
};
export default { login, registerUser, UserProfile, refToken };
