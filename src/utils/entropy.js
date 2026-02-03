/**
 * Password Entropy Calculation Utilities
 */

/**
 * Calculate password entropy in bits
 * @param {string} password - The password to analyze
 * @returns {number} Entropy in bits
 */
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

/**
 * Calculate password score (0-4)
 * @param {number} entropy - Password entropy in bits
 * @returns {number} Score 0-4
 */
function calculateScore(entropy) {
    if (entropy < 40) return 0;
    if (entropy < 60) return 1;
    if (entropy < 80) return 2;
    if (entropy < 100) return 3;
    return 4;
}

/**
 * Get feedback based on score
 * @param {number} score - Password score (0-4)
 * @returns {Object} Warning and suggestions
 */
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

/**
 * Calculate estimated crack time
 * @param {number} entropy - Password entropy
 * @param {number} attemptsPerSecond - Attack speed
 * @returns {string} Human-readable time estimate
 */
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

module.exports = {
    calculateEntropy,
    calculateScore,
    getFeedback,
    calculateCrackTime
};
