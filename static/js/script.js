let currentPassword = '';

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.addEventListener('input', debounce(analyzePassword, 300));
    
    document.getElementById('togglePassword').addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        document.getElementById('passwordEye').classList.toggle('bi-eye');
        document.getElementById('passwordEye').classList.toggle('bi-eye-slash');
    });
});

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
    document.getElementById('lengthValue').textContent = data.password_length;
    
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
    
    document.getElementById('timeOnlineThrottled').textContent = crackTimes.online_throttling?.display || '-';
    document.getElementById('timeOnlineNoThrottle').textContent = crackTimes.online_no_throttling?.display || '-';
    document.getElementById('timeOfflineSlow').textContent = crackTimes.offline_slow?.display || '-';
    document.getElementById('timeOfflineFast').textContent = crackTimes.offline_fast?.display || '-';
}

async function generatePassword() {
    const targetEntropy = document.getElementById('targetEntropy').value;
    const useLowercase = document.getElementById('useLowercase').checked;
    const useUppercase = document.getElementById('useUppercase').checked;
    const useDigits = document.getElementById('useDigits').checked;
    const useSymbols = document.getElementById('useSymbols').checked;
    
    if (!useLowercase && !useUppercase && !useDigits && !useSymbols) {
        alert('Please select at least one character type');
        return;
    }
    
    const generateBtn = document.querySelector('button[onclick="generatePassword()"]');
    const originalBtnText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Generating...';
    generateBtn.disabled = true;
    
    try {
        const response = await fetch('/api/generate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_entropy: targetEntropy,
                use_lowercase: useLowercase,
                use_uppercase: useUppercase,
                use_digits: useDigits,
                use_symbols: useSymbols
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        const section = document.getElementById('generatedPasswordSection');
        section.classList.remove('d-none');
        document.getElementById('generatedPassword').value = data.password;
        document.getElementById('generatedEntropy').textContent = data.entropy.toFixed(2);
        document.getElementById('generatedLength').textContent = data.length;
        
        updateCrackTimes(data.crack_times);
        
    } catch (error) {
        console.error('Error generating password:', error);
        alert('Error generating password: ' + error.message + '\nCheck console for details.');
    } finally {
        generateBtn.innerHTML = originalBtnText;
        generateBtn.disabled = false;
    }
}

async function copyPassword() {
    const password = document.getElementById('generatedPassword').value;
    if (!password) return;
    
    try {
        await navigator.clipboard.writeText(password);
        const btn = document.querySelector('#generatedPasswordSection .btn-outline-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
    }
}

function setEntropy(value) {
    document.getElementById('targetEntropy').value = value;
}
