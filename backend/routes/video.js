const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// @route   POST /api/video/session
// @desc    Create a video session for user onboarding
// @access  Public
router.post('/session', videoController.createSession);

// @route   GET /api/video/session/:userId
// @desc    Get video session info for a user
// @access  Public
router.get('/session/:userId', videoController.getSession);

// @route   POST /api/video/invite
// @desc    Invite user to video session
// @access  Public
router.post('/invite', videoController.inviteToSession);

module.exports = router;
