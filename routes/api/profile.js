const express = require('express');


const router = express.Router();

// @route       GET api/profile
// @description test route
// @access      private
router.get('/', (request, response) => {
    response.send('Profile route');
});

module.exports = router;
