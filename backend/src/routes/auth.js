const express = require('express');
const {
  loginController,
  loginForTenantController,
  verifyTenantTokenController,
} = require('../controllers/authController');
const router = express.Router();

router.post('/', loginController);
router.post('/tenant/:tenantId', loginForTenantController);
router.get('/verify/tenant/:tenantId', verifyTenantTokenController);

module.exports = router;
