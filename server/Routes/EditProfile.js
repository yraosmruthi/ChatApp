const express = require("express")
const protect = require("../middlewares/protect");
const { editName, editEmail, editPic, editPassword } = require("../controllers/EditController");
const upload = require("../middlewares/multer");
const router = express.Router()

router.route("/update-name").put(protect,editName)
router.route("/update-email").put(protect, editEmail);
router.route("/update-pic").post(protect, upload.single("pic"), editPic);
router.route("/update-password").put(protect,editPassword);

module.exports = router