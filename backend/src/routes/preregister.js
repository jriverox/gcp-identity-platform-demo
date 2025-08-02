const express = require('express');

const {
  preregisterController,
  preregisterForTenantController,
} = require('../controllers/preregisterController');

const router = express.Router();

router.post('/', preregisterController);
router.post('/tenant/:tenantId', preregisterForTenantController);

module.exports = router;
