const {
  viewStore,
  viewSellers,
  viewSeller,
  updateSeller,
  viewBuyer,
  updateBuyer,
} = require('../../controllers/user')

const {
  proName,
} = require('../../controllers/artist')

const {
  loadUserId,
} = require('../../controllers/user')

const auth = require('../auth')
const router = require('express').Router()

router.get("/", auth.req, viewStore)

router.get("/sellers", viewSellers)

router.get("/seller/:username", auth.req, viewSeller)
router.put("/seller/:username", auth.req, updateSeller)

router.get("/buyer/:username", auth.req, viewBuyer)
router.put("/buyer/:username", auth.req, updateBuyer)

router.param('user_id', loadUserId)
router.param('pro_name', proName)

module.exports = router

