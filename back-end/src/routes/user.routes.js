import { Router } from "express";
import { registerUser ,logInUser,logOut} from "../Controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route('/register').post(registerUser)
router.route("/login").post(logInUser);
router.route("/logout").post(verifyJWT,logOut);


export default router;