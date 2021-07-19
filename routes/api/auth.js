const express = require('express');

const router = express.Router();


// @route       GET /api/auth/
// @description test route
// @access      private
router.get('/', (request, response) => {
    response.send('Auth route');
});

module.exports = router;
