import crypto from "crypto";
import express from "express";
import mongoose from "mongoose";
import { User } from "./models/user";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import { Session } from "./models/session";

dotenv.config();

const app = express();

app.use(bodyparser());

mongoose.connect(process.env.CONNECTION_URL);

function createSession(userId: string) {
    return new Session({
        user: userId,
    }).save().then(session => ({ sessionToken: session._id }));
}

function authenticate(username, password) {
    return User.findOne({ username }).then((user) => {
        if (user && user.password === crypto.createHmac("sha256", password).digest("hex")) {
            return createSession(user._id);
        }
        return null;
    });
}

app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/login", (req, res) => {
    authenticate(req.body.username, req.body.password)
        .then(session => {
            if (session) {
                res.send(session);
            } else {
                res.status(401).send({
                    message: "UNAUTHORIZED",
                });
            }
        })
        .catch (err => res.status(500).send(err));
});

app.post("/signup", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: crypto.createHmac("sha256", req.body.password).digest("hex"),
    });
    user.save().then(() => res.send({
        username: user.username,
    })).catch(err => res.status(500).send(err));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log( `server started at port: ${ port }` );
} );
