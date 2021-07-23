const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
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

// @route       GET api/profile/user/user_id
// @description Get a single profile by id
// @access      public
router.get('/user/:user_id', async (request, response) => {
    try {
        const profile = Profile.findOne({ user: request.params.user_id })
            .populate('user', ['name', 'avatar']);

        if (!profile) return response.status(404)
            .json({ message: 'There is no profile for this user.' });

        response.json(profile);
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') return response.status(404)
            .json({ message: 'There is no profile for this user.' });

        response.status(500).send('Internal server error.');
    }

    // @route       DELETE api/profile
    // @description Delete a profile
    // @access      private
    router.delete('/api/profile', auth, async (request, response) => {
        try {
            await Profile.findOneAndRemove({ user: request.user.id });

            await User.findOneAndRemove({ _id: request.user.id });

            response.json({ message: 'User deleted!' });
        } catch (error) {

        }
    });
});

// @route       PUT api/profile/experience
// @description Add profile experience.
// @access      private
router.put('/experience', [auth, [
    check('title', 'Title is required.').not().isEmpty(),
    check('company', 'Company is required.').not().isEmpty(),
    check('from', 'From date is required.').not().isEmpty(),
]], async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = request.body;

    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: request.user.id });

        profile.experience.unshift(newExperience);

        await profile.save();

        response.json();
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Internal server error.');
    }
});


// @route DELETE api/profile/experience/exp_id
// @description  Delete user experiences
// @access       private
router.delete('/experience/:exp_id', auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({ user: request.user.id });

        const removeIndex = profile.experience.map(item => item.id)
            .indexOf(request.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        response.json(profile);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Internal server error.');
    }
});

// @route       PUT api/profile/education
// @description Add profile education.
// @access      private
router.put('/education', [auth, [
    check('school', 'School is required.').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required.').not().isEmpty(),
    check('from', 'From date is required.').not().isEmpty(),
]], async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    } = request.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: request.user.id });

        profile.education.unshift(newEducation);

        await profile.save();

        response.json();
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Internal server error.');
    }
});


// @route DELETE api/profile/education/edu_id
// @description  Delete user education
// @access       private
router.delete('/education/:edu_id', auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({ user: request.user.id });

        const removeIndex = profile.education.map(item => item.id)
            .indexOf(request.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        response.json(profile);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Internal server error.');
    }
});


module.exports = router;
