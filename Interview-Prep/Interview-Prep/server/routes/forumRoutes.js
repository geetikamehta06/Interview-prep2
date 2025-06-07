const express = require('express');
const router = express.Router();

// Get all forum posts
router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Forum routes working' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 