// Password Entropy Tool - Main JavaScript
let currentPassword = '';
let lastGeneratedPassword = '';
let autoGenerateEnabled = false;

// Password syntax highlighting
function highlightPassword(password) {
    if (!password) return '';
    
    let html = '';
    for (let char of password) {
        let className = '';
        
        if (/[0-9]/.test(char)) {
            className = 'char-num';
        } else if (/[a-zA-Z]/.test(char)) {
            className = 'char-alpha';
        } else if (/[()\[\]{}<>]/.test(char)) {
            className = 'char-bracket';
        } else {
            className = 'char-symbol';
        }
        
        html += `<span class="${className}">${char}</span>`;
    }
    
    return html;
}

document.addEventListener('DOMContentLoaded', function() {
    initPasswordGenerator();
    initAnalysis();
});

// Update range value display
function updateRangeValue(element, value) {
    if (element) {
        element.textContent = value;
    }
}

// Initialize password generator
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

// Set strength preset
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

// Set character type checkboxes
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

// Select all characters
function selectAllChars() {
    const checkboxes = ['useLowercase', 'useUppercase', 'useDigits', 'useSymbols'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// Select none
function selectNoneChars() {
    const checkboxes = ['useLowercase', 'useUppercase', 'useDigits', 'useSymbols'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
}

// Panel management
function showGeneratePanel() {
    document.getElementById('generatePanel').style.display = 'block';
    document.getElementById('analyzePanel').style.display = 'none';
}

function showAnalyzePanel() {
    document.getElementById('generatePanel').style.display = 'none';
    document.getElementById('analyzePanel').style.display = 'block';
    analyzePassword();
}

function closePanel() {
    document.getElementById('generatePanel').style.display = 'none';
    document.getElementById('analyzePanel').style.display = 'none';
}

// Initialize analysis
function initAnalysis() {
    const passwordInput = document.getElementById('passwordInput');
    let inputTimeout;
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function(e) {
            clearTimeout(inputTimeout);
            
            if (this.value.length > 0) {
                inputTimeout = setTimeout(() => {
                    analyzePassword();
                }, 500);
            } else {
                document.getElementById('quickStats').style.display = 'none';
                closePanel();
            }
        });
    }
    
    // Toggle password visibility
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const input = document.getElementById('passwordInput');
            const eye = document.getElementById('passwordEye');
            
            if (input && eye) {
                if (input.type === 'password') {
                    input.type = 'text';
                    eye.classList.remove('bi-eye');
                    eye.classList.add('bi-eye-slash');
                } else {
                    input.type = 'password';
                    eye.classList.remove('bi-eye-slash');
                    eye.classList.add('bi-eye');
                }
            }
        });
    }
}

// Analyze password
async function analyzePassword() {
    const password = document.getElementById('passwordInput').value;
    currentPassword = password;
    
    if (!password) {
        document.getElementById('analysisResults').style.display = 'none';
        document.getElementById('noAnalysisYet').style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('/api/analyze/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        });
        
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        console.error('Error analyzing password:', error);
    }
}

// Display analysis results
function displayResults(data) {
    // Show quick stats
    const quickStats = document.getElementById('quickStats');
    if (quickStats) {
        quickStats.style.display = 'flex';
        const quickEntropy = document.getElementById('quickEntropy');
        const quickStrength = document.getElementById('quickStrength');
        
        if (quickEntropy) quickEntropy.textContent = data.entropy.toFixed(1) + ' bits';
        
        const strengthLabels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
        if (quickStrength) quickStrength.textContent = strengthLabels[data.score];
    }
    
    // Show analysis panel content
    const analysisResults = document.getElementById('analysisResults');
    const noAnalysisYet = document.getElementById('noAnalysisYet');
    
    if (analysisResults) analysisResults.style.display = 'block';
    if (noAnalysisYet) noAnalysisYet.style.display = 'none';
    
    // Update score circle
    const scoreCircle = document.getElementById('scoreCircle');
    if (scoreCircle) {
        scoreCircle.textContent = data.score;
        scoreCircle.className = 'score-circle-sm score-' + data.score;
    }
    
    // Update entropy value
    const entropyValue = document.getElementById('entropyValue');
    if (entropyValue) {
        entropyValue.textContent = data.entropy.toFixed(1);
    }
    
    // Update progress bar
    const strengthBar = document.getElementById('strengthBar');
    if (strengthBar) {
        const barWidth = Math.min((data.score + 1) * 20, 100);
        strengthBar.style.width = barWidth + '%';
        
        const barColors = ['#dc3545', '#fd7e14', '#ffc107', '#7c7cff', '#198754'];
        strengthBar.style.backgroundColor = barColors[data.score];
    }
    
    // Update crack times
    updateCrackTimes(data.crack_times);
    
    // Update security verdict
    updateSecurityVerdict(data.score);
    
    // Update feedback
    const feedbackArea = document.getElementById('feedbackArea');
    const feedbackWarning = document.getElementById('feedbackWarning');
    const feedbackSuggestions = document.getElementById('feedbackSuggestions');
    
    if (data.score < 3 && feedbackArea && feedbackWarning) {
        feedbackArea.style.display = 'block';
        feedbackWarning.textContent = data.feedback.warning || 'Password could be stronger';
        
        if (feedbackSuggestions) {
            if (data.feedback.suggestions && data.feedback.suggestions.length > 0) {
                feedbackSuggestions.innerHTML = data.feedback.suggestions.map(s => '<li>' + s + '</li>').join('');
            } else {
                feedbackSuggestions.innerHTML = '';
            }
        }
    } else if (feedbackArea) {
        feedbackArea.style.display = 'none';
    }
}

// Update crack times
function updateCrackTimes(crackTimes) {
    if (!crackTimes) return;
    
    const timeIds = ['timeOnlineThrottled', 'timeOnlineNoThrottle', 'timeOfflineSlow', 'timeOfflineFast'];
    const timeKeys = ['online_throttling', 'online_no_throttling', 'offline_slow', 'offline_fast'];
    
    timeIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = crackTimes[timeKeys[index]]?.display || '--';
        }
    });
}

// Update security verdict
function updateSecurityVerdict(score) {
    const verdict = document.getElementById('securityVerdict');
    const icon = document.getElementById('securityIcon');
    const text = document.getElementById('securityText');
    
    const verdicts = [
        { icon: 'bi-shield-x', text: 'Critical - Change immediately!', color: '#dc3545' },
        { icon: 'bi-shield-exclamation', text: 'Weak - Needs improvement', color: '#fd7e14' },
        { icon: 'bi-shield-minus', text: 'Moderate - Could be stronger', color: '#ffc107' },
        { icon: 'bi-shield-check', text: 'Strong - Good protection', color: '#7c7cff' },
        { icon: 'bi-shield-fill-check', text: 'Very Strong - Excellent!', color: '#198754' }
    ];
    
    if (verdict && icon && text) {
        const v = verdicts[score];
        icon.className = 'bi ' + v.icon;
        icon.style.color = v.color;
        text.textContent = v.text;
        verdict.style.borderColor = v.color;
    }
}

// Generate password
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

// Regenerate password
function regeneratePassword() {
    generatePassword();
}

// Copy password to clipboard
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

// Check entropy of generated password
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

// Show notification
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px; border-radius: 8px;';
    
    const icons = {
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'danger': 'x-circle',
        'info': 'info-circle'
    };
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${icons[type]} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Toggle collapsible section
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId + 'Icon');
    
    if (!section) return;
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        if (icon) {
            icon.classList.remove('bi-chevron-down');
            icon.classList.add('bi-chevron-up');
        }
    } else {
        section.style.display = 'none';
        if (icon) {
            icon.classList.remove('bi-chevron-up');
            icon.classList.add('bi-chevron-down');
        }
    }
}

// Clear password
function clearPassword() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    const quickStats = document.getElementById('quickStats');
    if (quickStats) {
        quickStats.style.display = 'none';
    }
    
    closePanel();
}
