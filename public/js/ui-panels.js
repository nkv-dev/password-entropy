/**
 * Password Entropy Tool - UI Panel Management
 * Functions for managing panel visibility and collapsible sections
 */

/**
 * Show the password generator panel
 */
function showGeneratePanel() {
    document.getElementById('generatePanel').style.display = 'block';
    document.getElementById('analyzePanel').style.display = 'none';
}

/**
 * Show the password analyzer panel
 */
function showAnalyzePanel() {
    document.getElementById('generatePanel').style.display = 'none';
    document.getElementById('analyzePanel').style.display = 'block';
    analyzePassword();
}

/**
 * Close all panels
 */
function closePanel() {
    document.getElementById('generatePanel').style.display = 'none';
    document.getElementById('analyzePanel').style.display = 'none';
}

/**
 * Toggle collapsible section visibility
 * @param {string} sectionId - The ID of the section to toggle
 */
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

/**
 * Clear password input and reset UI
 */
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
