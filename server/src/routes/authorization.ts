import * as express from "express";
import UserController from "../controllers/user-controller";

const { authJwt } = require("../middleware");

const authorization = express.Router();
const userController = new UserController();

authorization.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

authorization.get("/all", userController.allAccess);

authorization.get("/user",
        [authJwt.verifyToken],
        userController.userAccess);

authorization.get(
        "/moderator",
        [authJwt.verifyToken, authJwt.isModerator],
        userController.moderatorAccess);

authorization.get(
        "/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        userController.adminAccess);

export default authorization;