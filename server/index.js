const express = require('express');
const app = express();
const cors = require('cors');
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cors());

const db = require('./models');

// Middleware
app.use(express.json());

// Routers
const postRouter = require('./routes/posts');
app.use("/posts", postRouter);

const commentsRouter = require('./routes/Comments');
app.use("/comments", commentsRouter);

const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);

const likesRouter = require('./routes/Likes');
app.use("/likes", likesRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
}).catch(err => {
    console.error("Database sync error:", err);
});
