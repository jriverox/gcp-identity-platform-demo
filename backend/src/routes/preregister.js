const express = require('express');

const {
  preregisterController,
} = require('../controllers/preregisterController');
const router = express.Router();
router.post('/', preregisterController);
module.exports = router;
