const express = require('express');

const router = express.Router();

// @route       GET /api/posts
// @description test route
// @access      private
router.get('/', (request, response) => {
    response.send('Posts route');
});

module.exports = router;
