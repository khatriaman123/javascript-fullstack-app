const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware")

router.get("/", async (req, res) => {
    const listOfPosts = await Posts.findAll({include: [Likes]});
    res.json(listOfPosts);
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
});

router.get('/byuserId/:id', async (req, res) => {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({ where: { UserId: id }, include: [Likes,]});
    res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
    const { newTitle, id } = req.body;
    await Posts.update({ title: newTitle }, { where: { id: id }});
    res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
    const { newPostText, id } = req.body;
    await Posts.update({ postText: newPostText }, { where: { id: id }});
    res.json(newPostText);
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;

    try {
        const deleted = await Posts.destroy({
            where: {
                id: postId,
            },
        });

        if (deleted) {
            res.json({ success: true, message: "Post deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "Post not found" });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, message: "Error deleting post" });
    }
});



module.exports = router;