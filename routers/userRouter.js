
import router from "express";
import { createUser,loginUser, getUsers, googleLogin, sendOTP, verifyOTP } from "../controllers/userController.js";

const userRouter = router.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-users", getUsers);
userRouter.post("/google-login",googleLogin)
userRouter.post("/forgot-password",sendOTP)
userRouter.post("/reset-password",verifyOTP)



export default userRouter;
