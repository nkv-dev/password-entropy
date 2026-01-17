const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('static'));

function calculateEntropy(password) {
    if (!password) return 0.0;
    
    const length = password.length;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigits = /[0-9]/.test(password);
    const hasSymbols = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password);
    
    let poolSize = 0;
    if (hasLowercase) poolSize += 26;
    if (hasUppercase) poolSize += 26;
    if (hasDigits) poolSize += 10;
    if (hasSymbols) poolSize += 32;
    
    if (poolSize === 0) poolSize = 1;
    
    const entropy = length * Math.log2(poolSize);
    return entropy;
}

function calculateScore(entropy) {
    if (entropy < 40) return 0;
    if (entropy < 60) return 1;
    if (entropy < 80) return 2;
    if (entropy < 100) return 3;
    return 4;
}

function getFeedback(score) {
    let warning = '';
    const suggestions = [];
    
    if (score <= 1) {
        warning = 'This password is very weak';
        suggestions.push(
            'Add more characters to increase length',
            'Mix uppercase and lowercase letters',
            'Include numbers and special characters'
        );
    } else if (score === 2) {
        warning = 'This password could be stronger';
        suggestions.push(
            'Consider adding more characters',
            'Use a mix of different character types'
        );
    }
    
    return { warning, suggestions };
}

function calculateCrackTime(entropy, attemptsPerSecond) {
    if (entropy <= 0) return 'instant';
    
    const combinations = Math.pow(2, entropy);
    const secondsToCrack = combinations / (2 * attemptsPerSecond);
    
    if (secondsToCrack < 1) return 'instant';
    if (secondsToCrack < 60) return `${Math.floor(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) {
        const minutes = Math.floor(secondsToCrack / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    if (secondsToCrack < 86400) {
        const hours = Math.floor(secondsToCrack / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (secondsToCrack < 31536000) {
        const days = Math.floor(secondsToCrack / 86400);
        return `${days} day${days !== 1 ? 's' : ''}`;
    }
    if (secondsToCrack < 3153600000) {
        const years = Math.floor(secondsToCrack / 31536000);
        if (years < 1000000) return `${years} year${years !== 1 ? 's' : ''}`;
        return `${(years / 1000000).toFixed(1)} million years`;
    }
    
    const centuries = secondsToCrack / 31536000 / 100;
    if (centuries < 1000000) return `${centuries.toFixed(1)} centuries`;
    return 'centuries';
}

function generateSecurePassword(targetEntropy, options) {
    const { useLowercase, useUppercase, useDigits, useSymbols } = options;
    
    let charPool = '';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (useLowercase) charPool += lowercase;
    if (useUppercase) charPool += uppercase;
    if (useDigits) charPool += digits;
    if (useSymbols) charPool += symbols;
    
    if (!charPool) throw new Error('At least one character type must be selected');
    
    const poolSize = charPool.length;
    let length = Math.max(8, Math.ceil(targetEntropy / Math.log2(poolSize)));
    
    while (true) {
        const password = [];
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, poolSize);
            password.push(charPool[randomIndex]);
        }
        
        const generatedPassword = password.join('');
        const entropy = calculateEntropy(generatedPassword);
        
        if (entropy >= targetEntropy) {
            return {
                password: generatedPassword,
                length: length,
                entropy: entropy
            };
        }
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'base.html'));
});

// Serve static files from /static path
app.use('/static', express.static('static'));

app.post('/api/analyze/', (req, res) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    
    const entropy = calculateEntropy(password);
    const score = calculateScore(entropy);
    const feedback = getFeedback(score);
    
    const crackTimes = {
        online_throttling: { display: calculateCrackTime(entropy, 100 / 3600) },
        online_no_throttling: { display: calculateCrackTime(entropy, 10) },
        offline_slow: { display: calculateCrackTime(entropy, 10000) },
        offline_fast: { display: calculateCrackTime(entropy, 10000000000) }
    };
    
    res.json({
        entropy,
        score,
        password_length: password.length,
        feedback,
        crack_times: crackTimes
    });
});

app.post('/api/generate/', (req, res) => {
    const { target_entropy, use_lowercase, use_uppercase, use_digits, use_symbols } = req.body;
    
    const options = {
        useLowercase: use_lowercase !== false,
        useUppercase: use_uppercase !== false,
        useDigits: use_digits !== false,
        useSymbols: use_symbols !== false
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

app.listen(PORT, () => {
    console.log(`Password Entropy Tool running at http://localhost:${PORT}`);
});
