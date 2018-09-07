const express = require('express');
const authRoutes = require('../server/auth/auth.route');


const router = express.Router();



// mount auth routes at /auth
router.use('/', authRoutes);




module.exports = router;
