const express = require('express');
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');

const User = require('../../models/User');

const router = express.Router();

// @route       POST api/users
// @description register users
// @access      public
router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters.')
        .isLength({ min: 6 })
], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = request.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return response.status(400).json({ errors: [{ message: 'User already exists.' }] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm',
        });

        user = new User({
            name,
            email,
            avatar,
            password,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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
