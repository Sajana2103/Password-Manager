const {Router} = require('express')
const PasswordsController = require('./passwords.contorller')

const router = new Router

// router.route("/").get(PasswordsController.apiGetPasswords)
router.route("/add-item").post(PasswordsController.apiAddItem)
router.route("/update-item").post(PasswordsController.apiUpdateItem)
router.route("/remove-item").post(PasswordsController.apiRemoveItem)
router.route("/signin").post(PasswordsController.apiSignin)
router.route("/get-user").post(PasswordsController.apiGetUser)
router.route("/add-user").post(PasswordsController.apiAddUser)
router.route("/change-settings").post(PasswordsController.apiChangeSettings)
module.exports  = router