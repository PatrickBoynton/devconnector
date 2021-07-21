const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();

// @route       GET api/profile/me
// @description get current users profile
// @access      private
router.get('/me', auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar',]);

        if (!profile) {
            return response.status(400).json({ message: 'There is no profile for this user.' });
        }

        response.json(profile);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

// @route       POST api/profile/
// @description create or update current users profile
// @access      private

router.post('/', [auth, check('status', 'Status is required.').not().isEmpty(),
    check('skills', 'Skills are required.').not().isEmpty()], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
    } = request.body;

    const profileFields = {};

    profileFields.user = request.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;


    try {
        let profile = Profile.findOne({ user: request.user.id });

        if (profile) {
            profile = Profile
                .findOneAndUpdate(
                    { user: request.user.id },
                    { $set: profileFields },
                    { new: true });

            return response.json(profile);
        }

        profile = new Profile(profileFields);

        await profile.save();

        response.json(profile);

    } catch (error) {
        console.error(error);
        response.status(500).send('Server Error.');
    }
});

// @route       GET api/profile/
// @description Get all profiles
// @access      public
router.get('/', async (request, response) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);

        response.json(profiles);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error.');
    }
});

module.exports = router;
