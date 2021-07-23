const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

const router = express.Router();


// @route POST  api/auth
// @description login user
// @access      public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password.')
        .exists(),
], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return response.status(400).json({ errors: [{ message: 'Invalid username or password.' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return response.status(400).json({errors: [{message: 'Invalid username or password.'}]});
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 3600000,
            },
            (error, token) => {
                if (error) throw error;

                response.json({ token });
            });

    } catch (error) {
        console.log(error.message);
        response.status(500).send('Server Error.');
    }
});

module.exports = router;
