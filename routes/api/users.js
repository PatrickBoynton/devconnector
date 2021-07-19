const express = require('express');

const router = express.Router();

// @route       GET api/users
// @description test route
// @access      public
router.get('/', (request, response) => {
    response.send('User Route!');
});

module.exports = router;
