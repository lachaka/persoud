import * as express from "express";
import AuthenticationController from "../controllers/auth-controller";

const { verifySignUp } = require("../middleware");

const authentication = express.Router();
const authController = new AuthenticationController();

authentication.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

authentication.post("/authentication/signUp",
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ],
    authController.signUp);

authentication.post("/authentication/signIn", authController.signIn);

export default authentication;