/**
 * Password Entropy Tool - Password Generator Module
 * Handles password generation, presets, and clipboard operations
 */

/**
 * Initialize password generator UI and event listeners
 */
function initPasswordGenerator() {
    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    
    if (lengthSlider && lengthValue) {
        lengthSlider.addEventListener('input', function(e) {
            updateRangeValue(lengthValue, e.target.value);
        });
    }
    
    // Set default preset
    setStrengthPreset('strong');
}

/**
 * Set strength preset (quick, strong, or maximum)
 * @param {string} preset - The preset to apply
 */
function setStrengthPreset(preset) {
    const lengthSlider = document.getElementById('passwordLength');
    
    // Update active chip
    document.querySelectorAll('.preset-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    const activeChip = document.querySelector(`.preset-chip[data-preset="${preset}"]`);
    if (activeChip) {
        activeChip.classList.add('active');
    }
    
    // Set values based on preset
    switch(preset) {
        case 'quick':
            if (lengthSlider) lengthSlider.value = 12;
            updateRangeValue(document.getElementById('lengthValue'), 12);
            setCharacterTypes(true, true, true, false);
            break;
        case 'strong':
            if (lengthSlider) lengthSlider.value = 16;
            updateRangeValue(document.getElementById('lengthValue'), 16);
            setCharacterTypes(true, true, true, true);
            break;
        case 'maximum':
            if (lengthSlider) lengthSlider.value = 24;
            updateRangeValue(document.getElementById('lengthValue'), 24);
            setCharacterTypes(true, true, true, true);
            break;
    }
}

/**
 * Set character type checkboxes
 * @param {boolean} lowercase - Include lowercase letters
 * @param {boolean} uppercase - Include uppercase letters
 * @param {boolean} digits - Include digits
 * @param {boolean} symbols - Include symbols
 */
function setCharacterTypes(lowercase, uppercase, digits, symbols) {
    const checkboxes = {
        'useLowercase': lowercase,
        'useUppercase': uppercase,
        'useDigits': digits,
        'useSymbols': symbols
    };
    
    Object.keys(checkboxes).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checkboxes[id];
        }
    });
}

/**
 * Select all character types
 */
function selectAllChars() {
    const checkboxes = ['useLowercase', 'useUppercase', 'useDigits', 'useSymbols'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

/**
 * Deselect all character types
 */
function selectNoneChars() {
    const checkboxes = ['useLowercase', 'useUppercase', 'useDigits', 'useSymbols'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
}

/**
 * Generate password via API
 */
async function generatePassword() {
    const passwordLength = document.getElementById('passwordLength')?.value || 16;
    const useLowercase = document.getElementById('useLowercase')?.checked || false;
    const useUppercase = document.getElementById('useUppercase')?.checked || false;
    const useDigits = document.getElementById('useDigits')?.checked || false;
    const useSymbols = document.getElementById('useSymbols')?.checked || false;
    
    if (!useLowercase && !useUppercase && !useDigits && !useSymbols) {
        showNotification('Please select at least one character type', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/generate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password_length: passwordLength,
                use_lowercase: useLowercase,
                use_uppercase: useUppercase,
                use_digits: useDigits,
                use_symbols: useSymbols
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store the generated password
        lastGeneratedPassword = data.password;
        
        // Show generated display
        const generatedDisplay = document.getElementById('generatedDisplay');
        const generatedPassword = document.getElementById('generatedPassword');
        
        if (generatedDisplay && generatedPassword) {
            generatedDisplay.style.display = 'flex';
            generatedPassword.innerHTML = highlightPassword(data.password);
        }
        
    } catch (error) {
        console.error('Error generating password:', error);
        showNotification('Error generating password: ' + error.message, 'danger');
    }
}

/**
 * Regenerate password with same settings
 */
function regeneratePassword() {
    generatePassword();
}

/**
 * Copy password to clipboard
 */
async function copyPassword() {
    const password = lastGeneratedPassword || document.getElementById('generatedPassword')?.textContent;
    if (!password) return;
    
    try {
        await navigator.clipboard.writeText(password);
        showNotification('Password copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Failed to copy password', 'danger');
    }
}

/**
 * Send generated password to analyzer
 */
async function checkEntropy() {
    const password = lastGeneratedPassword || document.getElementById('generatedPassword')?.textContent;
    if (!password) {
        showNotification('No password to check', 'warning');
        return;
    }
    
    // Set password in input
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.value = password;
    }
    
    // Close generate panel and open analyze
    showAnalyzePanel();
    
    showNotification('Password analyzed!', 'success');
}
