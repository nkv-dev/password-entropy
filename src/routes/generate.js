/**
 * Password Generation API Route
 */
const express = require('express');
const router = express.Router();
const { generateSecurePassword } = require('../utils/password');
const { calculateCrackTime } = require('../utils/entropy');

/**
 * POST /api/generate/
 * Generate a secure password with specified options
 */
router.post('/', (req, res) => {
    const { target_entropy, use_lowercase, use_uppercase, use_digits, use_symbols, password_length } = req.body;
    
    const options = {
        useLowercase: use_lowercase !== false,
        useUppercase: use_uppercase !== false,
        useDigits: use_digits !== false,
        useSymbols: use_symbols !== false,
        targetLength: password_length ? parseInt(password_length) : null
    };
    
    try {
        const result = generateSecurePassword(target_entropy || 60, options);
        
        const crackTimes = {
            online_throttling: { display: calculateCrackTime(result.entropy, 100 / 3600) },
            online_no_throttling: { display: calculateCrackTime(result.entropy, 10) },
            offline_slow: { display: calculateCrackTime(result.entropy, 10000) },
            offline_fast: { display: calculateCrackTime(result.entropy, 10000000000) }
        };
        
        res.json({
            password: result.password,
            length: result.length,
            entropy: result.entropy,
            crack_times: crackTimes
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
