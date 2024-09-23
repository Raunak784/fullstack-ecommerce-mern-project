import { Router } from "express";
import { deleteUser, editUser, getAllUsers, getUser, loginUser, registerUser } from "../controllers/userController.js";
// import {upload} from "../middlewares/fileUploader.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/getUser/:id").get(getUser)
router.route("/getAllUser").get(getAllUsers)
router.route("/editUser").put(editUser)
router.route("/deleteUser/:id").delete(deleteUser)




export default router;