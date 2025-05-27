const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/index");
const streamUpload = require("../config/streamupload");
const userSchema = require("../validater/userValidation");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const signup = async (req, res) => {
  const valiations = userSchema.safeParse(req.body);
                                                                    
  if (!valiations.success) {
    return res.status(400).json({ errors: valiations.error.format() });
  }
  try {
    const { username, email, password } = req.body;
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      console.log("first", imageUrl);
    }

    const existingUser = await db("users").where({ email }).first();
    if (existingUser)
      return res.status(400).json({ error: "User is already Registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(password);
    console.log(hashedPassword);  
    const [user] = await db("users").insert({
      username,
      email,
      password: hashedPassword,
      image: imageUrl,
    });
    const token = jwt.sign({ email }, JWT_SECRET);

    res
      .status(201)
      .json({ message: "User Signup successfully", user, token, imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db("users").where({ email }).first();
    if (!user)
      return res.status(401).json({ error: "you need to signup first" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email }, JWT_SECRET);
    console.log("signin password", password);
    res.json({ message: "You are sigin successfully ✔ ", token });
  } catch (err) {
    res.status(500).json({ error: "Signin failed", details: err.message });
  }
};

const googleSignin = async (req, res) => {
  const { name, email, sub, picture } = req.body;

  const user = await db("users").where({ email }).first();

  if (user) {
    const JWT_SECRET = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ email }, JWT_SECRET);
    return res
      .status(200)
      .json({ message: "User signed in successfully", token });
  }

  await db("users").insert({
    google_id: sub,
    username: name,
    email,
    image: picture,
  });

  const JWT_SECRET = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ email }, JWT_SECRET);
  res.status(201).json({
    message: "User signed in and created successfully",
    token,
  });
};

const user = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log("user error", error);
  }
};
const DeleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const delted = await db("users").where("id", id).delete();
    res
      .status(200)
      .json({ message: "Your Account Delete Permanently", delted });
  } catch (error) {
    res.status(500).json({ message: "Technical error....." });
  }
};
module.exports = {
  signup,
  signin,
  user,
  googleSignin,
  DeleteUser,
};

// const db = require("../db/index");
// const jwt = require("jsonwebtoken");

// const googleSignin = async (req, res) => {
//   const { name, email, sub, picture } = req.body;

//   const user = await db("googleusers").where({ google_id: sub }).first();

//   if (user) {
//     const JWT_SECRET = process.env.JWT_SECRET_KEY;
//     const token = jwt.sign({ email }, JWT_SECRET, {});
//     return res
//       .status(200)
//       .json({ message: "User signed in successfully", token });
//   }

//   await db("googleusers").insert({
//     google_id: sub,
//     name,
//     email,
//     image: picture,
//   });

//   const JWT_SECRET = process.env.JWT_SECRET_KEY;
//   const token = jwt.sign({ email }, JWT_SECRET, {});
//   res.status(201).json({
//     message: "User signed in and created successfully",
//     token,
//   });
// };

// module.exports = { googleSignin };
