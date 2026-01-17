let currentPassword = '';
let autoGenerateEnabled = true;
let lastGeneratedPassword = '';

function updateRangeValue(element, value) {
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
        // Update text content
        element.textContent = value;
        
        // Add animation class
        element.classList.add('updated');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('updated');
        }, 600);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Performance monitoring
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
    }
    
    initTheme();
    initPasswordGenerator();
    
    const passwordInput = document.getElementById('passwordInput');
    
    // Optimized event listener with requestAnimationFrame
    let inputTimeout;
    passwordInput.addEventListener('input', function(e) {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            requestAnimationFrame(analyzePassword);
        }, 300);
    });
    
    document.getElementById('togglePassword').addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        document.getElementById('passwordEye').classList.toggle('bi-eye');
        document.getElementById('passwordEye').classList.toggle('bi-eye-slash');
    });
});

function initPasswordGenerator() {
    // Length slider
    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    
    if (!lengthSlider || !lengthValue) {
        console.error('Length slider elements not found!');
        return;
    }
    
    lengthSlider.addEventListener('input', function(e) {
        updateRangeValue(lengthValue, e.target.value);
        if (autoGenerateEnabled) {
            debouncedGeneratePassword();
        }
    });
    
    // Initialize strength presets
    initStrengthPresets();
    
    // Character type toggles
    const charTypes = ['useLowercase', 'useUppercase', 'useDigits', 'useSymbols'];
    charTypes.forEach(id => {
        const checkbox = document.getElementById(id);
        const card = checkbox.closest('.char-type-card');
        
        checkbox.addEventListener('change', function() {
            card.classList.toggle('active', this.checked);
            if (autoGenerateEnabled) {
                debouncedGeneratePassword();
            }
        });
        
        // Card click handler
        card.addEventListener('click', function(e) {
            if (!e.target.closest('label')) {
                checkbox.checked = !checkbox.checked;
                card.classList.toggle('active', checkbox.checked);
                if (autoGenerateEnabled) {
                    debouncedGeneratePassword();
                }
            }
        });
    });
    
    // Generate initial password
    setTimeout(() => generatePassword(), 500);
}

// Optimized debounced password generation with requestAnimationFrame
let generateTimeout;
function debouncedGeneratePassword() {
    clearTimeout(generateTimeout);
    generateTimeout = setTimeout(() => {
        requestAnimationFrame(generatePassword);
    }, 500);
}

function initStrengthPresets() {
    // Set default preset
    setStrengthPreset('strong');
}

function setStrengthPreset(preset) {
    // Remove active class from all preset buttons
    document.querySelectorAll('.strength-preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected preset button
    const activeBtn = document.querySelector(`.strength-${preset}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Set length and character types based on preset
    const lengthSlider = document.getElementById('passwordLength');
    
    switch(preset) {
        case 'quick':
            lengthSlider.value = 12;
            updateRangeValue(document.getElementById('lengthValue'), 12);
            // Use lowercase, uppercase, digits only
            setCharacterTypes(true, true, true, false);
            break;
        case 'strong':
            lengthSlider.value = 16;
            updateRangeValue(document.getElementById('lengthValue'), 16);
            // Use all character types
            setCharacterTypes(true, true, true, true);
            break;
        case 'maximum':
            lengthSlider.value = 24;
            updateRangeValue(document.getElementById('lengthValue'), 24);
            // Use all character types
            setCharacterTypes(true, true, true, true);
            break;
    }
    
    // Generate password if auto-generation is enabled
    if (autoGenerateEnabled) {
        generatePassword();
    }
}

function setCharacterTypes(lowercase, uppercase, digits, symbols) {
    const checkboxes = {
        'useLowercase': lowercase,
        'useUppercase': uppercase,
        'useDigits': digits,
        'useSymbols': symbols
    };
    
    Object.keys(checkboxes).forEach(id => {
        const checkbox = document.getElementById(id);
        const card = checkbox.closest('.char-type-card');
        
        checkbox.checked = checkboxes[id];
        card.classList.toggle('active', checkboxes[id]);
    });
}

function selectAllChars() {
    const checkboxes = ['useLowercase', 'useUppercase', 'useDigits', 'useSymbols'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        const card = checkbox.closest('.char-type-card');
        checkbox.checked = true;
        card.classList.add('active');
    });
    
    if (autoGenerateEnabled) {
        debouncedGeneratePassword();
    }
}

function selectNoneChars() {
    const checkboxes = ['useLowercase', 'useUppercase', 'useDigits', 'useSymbols'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        const card = checkbox.closest('.char-type-card');
        checkbox.checked = false;
        card.classList.remove('active');
    });
}

function regeneratePassword() {
    autoGenerateEnabled = true;
    generatePassword();
}

function getPasswordStrengthText(entropy) {
    if (entropy < 40) return 'Very Weak';
    if (entropy < 60) return 'Weak';
    if (entropy < 80) return 'Moderate';
    if (entropy < 100) return 'Strong';
    return 'Very Strong';
}

function getPasswordStrengthClass(entropy) {
    if (entropy < 40) return 'strength-very-weak';
    if (entropy < 60) return 'strength-weak';
    if (entropy < 80) return 'strength-moderate';
    if (entropy < 100) return 'strength-strong';
    return 'strength-very-strong';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
    } else {
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
    }
}

async function analyzePassword() {
    const password = document.getElementById('passwordInput').value;
    currentPassword = password;
    
    if (!password) {
        document.getElementById('resultsSection').classList.add('d-none');
        resetCrackTimes();
        return;
    }
    
    try {
        let result;
        if (typeof zxcvbn !== 'undefined') {
            result = zxcvbn(password);
        }
        
        const response = await fetch('/api/analyze/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        });
        
        const data = await response.json();
        
        displayResults(data, result);
        updateCrackTimes(data.crack_times);
        
    } catch (error) {
        console.error('Error analyzing password:', error);
    }
}

function displayResults(data, zxcvbnResult) {
    document.getElementById('resultsSection').classList.remove('d-none');
    
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.textContent = data.score;
    scoreCircle.className = 'score-circle score-' + data.score;
    
    document.getElementById('entropyValue').textContent = data.entropy.toFixed(2);
    document.getElementById('analyzedLengthValue').textContent = data.password_length;
    
    const strengthBar = document.getElementById('strengthBar');
    const barWidth = Math.min((data.score + 1) * 20, 100);
    strengthBar.style.width = barWidth + '%';
    
    const barColors = ['#dc3545', '#fd7e14', '#ffc107', '#0d6efd', '#198754'];
    strengthBar.style.backgroundColor = barColors[data.score];
    
    const feedbackAlert = document.getElementById('feedbackAlert');
    const warningEl = document.getElementById('feedbackWarning');
    const suggestionsEl = document.getElementById('feedbackSuggestions');
    
    if (data.score < 3) {
        feedbackAlert.style.display = 'block';
        feedbackAlert.className = 'alert alert-warning';
        warningEl.textContent = data.feedback.warning || 'Password could be stronger';
        
        if (data.feedback.suggestions && data.feedback.suggestions.length > 0) {
            suggestionsEl.innerHTML = data.feedback.suggestions.map(s => '<li>' + s + '</li>').join('');
        } else {
            suggestionsEl.innerHTML = '';
        }
    } else {
        feedbackAlert.style.display = 'none';
    }
}

function resetCrackTimes() {
    document.getElementById('timeOnlineThrottled').textContent = '-';
    document.getElementById('timeOnlineNoThrottle').textContent = '-';
    document.getElementById('timeOfflineSlow').textContent = '-';
    document.getElementById('timeOfflineFast').textContent = '-';
}

function updateCrackTimes(crackTimes) {
    if (!crackTimes) return;
    
    // Update crack time values
    updateCrackTimeValue('timeOnlineThrottled', 'riskOnlineThrottled', crackTimes.online_throttling?.display || '-');
    updateCrackTimeValue('timeOnlineNoThrottle', 'riskOnlineNoThrottle', crackTimes.online_no_throttling?.display || '-');
    updateCrackTimeValue('timeOfflineSlow', 'riskOfflineSlow', crackTimes.offline_slow?.display || '-');
    updateCrackTimeValue('timeOfflineFast', 'riskOfflineFast', crackTimes.offline_fast?.display || '-');
    
    // Update security summary
    updateSecuritySummary(crackTimes);
}

function updateCrackTimeValue(elementId, riskId, value) {
    const element = document.getElementById(elementId);
    const riskElement = document.getElementById(riskId);
    
    if (element) {
        element.textContent = value;
        
        // Add animation
        const card = element.closest('.crack-time-card');
        if (card) {
            card.classList.add('updated');
            setTimeout(() => card.classList.remove('updated'), 600);
        }
    }
    
    if (riskElement) {
        // Update risk indicator color
        const riskDot = riskElement.querySelector('.risk-dot');
        if (riskDot) {
            riskDot.className = 'risk-dot ' + getRiskClass(value);
        }
    }
}

function getRiskClass(timeString) {
    if (!timeString || timeString === '-') return 'risk-low';
    
    const lowerTime = timeString.toLowerCase();
    
    if (lowerTime.includes('instant') || lowerTime.includes('second')) {
        return 'risk-critical';
    } else if (lowerTime.includes('minute') || lowerTime.includes('hour')) {
        return 'risk-high';
    } else if (lowerTime.includes('day') || lowerTime.includes('month')) {
        return 'risk-medium';
    } else {
        return 'risk-low';
    }
}

function updateSecuritySummary(crackTimes) {
    // Use online throttled as the primary metric (most realistic scenario)
    const primaryCrackTime = crackTimes.online_throttling?.display || '-';
    const securityIcon = document.getElementById('securityIcon');
    const securityTitle = document.getElementById('securityTitle');
    const securityDesc = document.getElementById('securityDesc');
    const primaryCrackTimeElement = document.getElementById('primaryCrackTime');
    
    if (primaryCrackTimeElement) {
        primaryCrackTimeElement.textContent = primaryCrackTime;
    }
    
    // Update security assessment based on crack time
    const riskClass = getRiskClass(primaryCrackTime);
    let icon, title, desc, iconColor;
    
    switch (riskClass) {
        case 'risk-critical':
            icon = 'bi-shield-x';
            title = 'Critical Risk';
            desc = 'This password can be cracked almost immediately';
            iconColor = '#dc3545';
            break;
        case 'risk-high':
            icon = 'bi-shield-exclamation';
            title = 'High Risk';
            desc = 'This password could be cracked within hours or days';
            iconColor = '#fd7e14';
            break;
        case 'risk-medium':
            icon = 'bi-shield-minus';
            title = 'Medium Security';
            desc = 'This password provides moderate protection against attacks';
            iconColor = '#ffc107';
            break;
        case 'risk-low':
            icon = 'bi-shield-check';
            title = 'Strong Security';
            desc = 'This password would take years or centuries to crack';
            iconColor = '#198754';
            break;
        default:
            icon = 'bi-shield';
            title = 'Unknown Security';
            desc = 'Unable to determine security level';
            iconColor = '#6c757d';
    }
    
    if (securityIcon) {
        securityIcon.innerHTML = `<i class="bi ${icon}" style="font-size: 3rem; color: ${iconColor};"></i>`;
    }
    if (securityTitle) {
        securityTitle.textContent = title;
        securityTitle.style.color = iconColor;
    }
    if (securityDesc) {
        securityDesc.textContent = desc;
    }
}

async function generatePassword() {
    // Get values fresh each time - don't rely on cached values
    const passwordLength = document.getElementById('passwordLength').value;
    const useLowercase = document.getElementById('useLowercase').checked;
    const useUppercase = document.getElementById('useUppercase').checked;
    const useDigits = document.getElementById('useDigits').checked;
    const useSymbols = document.getElementById('useSymbols').checked;

    
    if (!useLowercase && !useUppercase && !useDigits && !useSymbols) {
        // Show warning but don't use alert for better UX
        showNotification('Please select at least one character type', 'warning');
        return;
    }
    
    const generateBtn = document.querySelector('button[onclick="generatePassword()"]');
    const originalBtnText = generateBtn.innerHTML;
    
    // Only show loading state for manual generation, not auto-generation
    const isManualGeneration = !autoGenerateEnabled;
    if (isManualGeneration) {
        generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Generating...';
        generateBtn.disabled = true;
    }
    
    try {
        const passwordLength = document.getElementById('passwordLength').value;
        
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
        
        // Update UI elements
        const section = document.getElementById('generatedPasswordSection');
        const container = section.querySelector('.password-display-container');
        
        section.classList.remove('d-none');
        
        // Update password display
        const passwordDisplay = document.getElementById('generatedPassword');
        passwordDisplay.textContent = data.password;
        
        // Update strength indicators
        const entropyDisplay = document.getElementById('generatedEntropy');
        const lengthDisplay = document.getElementById('generatedLength');
        const strengthBar = document.getElementById('passwordStrengthBar');
        const strengthText = document.getElementById('passwordStrengthText');
        
        entropyDisplay.textContent = data.entropy.toFixed(2);
        lengthDisplay.textContent = data.length;
        strengthText.textContent = getPasswordStrengthText(data.entropy);
        
        // Update strength bar
        strengthBar.className = 'password-strength-fill ' + getPasswordStrengthClass(data.entropy);
        
        // Add animation effect
        container.classList.add('generated');
        setTimeout(() => container.classList.remove('generated'), 500);
        
        updateCrackTimes(data.crack_times);
        
    } catch (error) {
        console.error('Error generating password:', error);
        showNotification('Error generating password: ' + error.message, 'danger');
    } finally {
        if (isManualGeneration) {
            generateBtn.innerHTML = originalBtnText;
            generateBtn.disabled = false;
        }
    }
}

function showNotification(message, type = 'info') {
    // Create a toast notification instead of alert
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'warning' ? 'exclamation-triangle' : type === 'danger' ? 'x-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

async function checkEntropy() {
    const generatedPassword = document.getElementById('generatedPassword').textContent;
    if (!generatedPassword) {
        showNotification('No password generated to check', 'warning');
        return;
    }
    
    // Paste the password to the input field
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.value = generatedPassword;
    
    // Show loading state on the button
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Analyzing...';
    btn.disabled = true;
    
    // Trigger analysis immediately (no debounce for manual check)
    analyzePassword();
    
    // Scroll to the analysis section
    document.getElementById('passwordInput').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // Reset button after analysis completes
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        showNotification('Password analyzed successfully!', 'success');
    }, 1000);
}

async function copyPassword() {
    const password = document.getElementById('generatedPassword').textContent;
    if (!password) return;
    
    try {
        await navigator.clipboard.writeText(password);
        const btn = document.querySelector('#generatedPasswordSection .btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Failed to copy password to clipboard', 'danger');
    }
}


