/**
 * Password Entropy Tool - Password Analyzer Module
 * Handles password analysis, API calls, and result display
 */

/**
 * Initialize password analysis UI and event listeners
 */
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

/**
 * Analyze password via API
 */
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

/**
 * Display analysis results in UI
 * @param {Object} data - Analysis result data from API
 */
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

/**
 * Update crack time displays
 * @param {Object} crackTimes - Crack time estimates for different scenarios
 */
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

/**
 * Update security verdict display
 * @param {number} score - Password score (0-4)
 */
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
