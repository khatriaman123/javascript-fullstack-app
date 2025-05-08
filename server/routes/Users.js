const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // folder to save images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
  });
  
  const upload = multer({ storage: storage });

  router.post("/", upload.single("profileImage"), async (req, res) => {
    const { username, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const hash = await bcrypt.hash(password, 10);

    await Users.create({
        username: username,
        password: hash,
        profileImage: profileImage,
    });

    res.json("SUCCESS");
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });

    if (!user) {
        return res.status(401).json({ error: "User doesn't exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: "Wrong username and password combination" });
    }

    const accessToken = sign(
        { username: user.username, id: user.id },
        "importantsecret"
    );

    return res.json({ token: accessToken, username: user.username, id: user.id });
});


router.get("/auth", validateToken, (req, res) => {
    res.json(req.user)
});

router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;
    const basicInfo = await Users.findByPk(id, {attributes: {exclude: ["password"]},
    });
    res.json(basicInfo);
});

router.put("/changePassword", validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        return res.status(401).json({ error: "Your Old Password is Wrong. Please Correct it!" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await Users.update({ password: hash }, { where: { username: req.user.username } });
    res.json("SUCCESS");
});

module.exports = router;