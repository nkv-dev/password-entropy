/**
 * Password Entropy Tool - Utility Functions
 * Core utilities, notifications, and password highlighting
 */

// Global state variables
let currentPassword = '';
let lastGeneratedPassword = '';
let autoGenerateEnabled = false;

/**
 * Password syntax highlighting - adds color-coded spans to password characters
 * @param {string} password - The password to highlight
 * @returns {string} HTML with colored spans
 */
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

/**
 * Update range slider value display
 * @param {HTMLElement} element - The element to update
 * @param {string|number} value - The value to display
 */
function updateRangeValue(element, value) {
    if (element) {
        element.textContent = value;
    }
}

/**
 * Show toast notification with mobile responsiveness
 * @param {string} message - The message to display
 * @param {string} type - Notification type (success, warning, danger, info)
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed mobile-toast`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px; max-width: calc(100vw - 40px); border-radius: 8px; font-size: 0.95rem; padding: 14px 18px;';
    
    // Check if mobile and adjust position
    if (window.innerWidth <= 575) {
        toast.style.cssText = 'top: 16px; left: 16px; right: 16px; z-index: 9999; border-radius: 12px; font-size: 0.95rem; padding: 16px 20px; text-align: center;';
    }
    
    const icons = {
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'danger': 'x-circle',
        'info': 'info-circle'
    };
    
    toast.innerHTML = `
        <div class="d-flex align-items-center justify-content-center">
            <i class="bi bi-${icons[type]} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Handle resize to update position
    const handleResize = () => {
        if (window.innerWidth <= 575) {
            toast.style.left = '16px';
            toast.style.right = '16px';
            toast.style.top = '16px';
        } else {
            toast.style.left = '';
            toast.style.right = '20px';
            toast.style.top = '20px';
        }
    };
    
    window.addEventListener('resize', handleResize);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            toast.remove();
            window.removeEventListener('resize', handleResize);
        }, 300);
    }, 3000);
}
