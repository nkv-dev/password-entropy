/**
 * Password Generation Utilities
 */
const crypto = require('crypto');
const { calculateEntropy } = require('./entropy');

/**
 * Generate a cryptographically secure password
 * @param {number} targetEntropy - Target entropy in bits
 * @param {Object} options - Generation options
 * @returns {Object} Generated password info
 */
function generateSecurePassword(targetEntropy, options) {
    const { useLowercase, useUppercase, useDigits, useSymbols, targetLength } = options;
    
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
    let length;
    
    // Use target length if provided, otherwise calculate based on entropy
    if (targetLength) {
        length = parseInt(targetLength);
    } else {
        length = Math.max(8, Math.ceil(targetEntropy / Math.log2(poolSize)));
    }
    
    // Ensure length is within reasonable bounds
    length = Math.max(5, Math.min(length, 128));
    
    while (true) {
        const password = [];
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, poolSize);
            password.push(charPool[randomIndex]);
        }
        
        const generatedPassword = password.join('');
        const entropy = calculateEntropy(generatedPassword);
        
        // If target length is specified, accept the password regardless of entropy
        if (targetLength) {
            return {
                password: generatedPassword,
                length: length,
                entropy: entropy
            };
        }
        
        // Otherwise, ensure minimum entropy requirement is met
        if (entropy >= targetEntropy) {
            return {
                password: generatedPassword,
                length: length,
                entropy: entropy
            };
        }
        
        // If not meeting entropy target, try longer password
        length++;
        if (length > 128) {
            // If we've reached max length, return current password
            return {
                password: generatedPassword,
                length: length,
                entropy: entropy
            };
        }
    }
}

module.exports = {
    generateSecurePassword
};
