import * as express from "express";
import LoginLogoutClass from "../controllers/loginLogout-controller";

const router = express.Router();
const controller = new LoginLogoutClass();

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

export default router;
