const express = require("express")
const protect = require("../middlewares/protect");
const { editName, editEmail } = require("../controllers/EditController");
const router = express.Router()

router.route("/update-name").put(protect,editName)
router.route("/update-email").put(protect, editEmail);

module.exports = router