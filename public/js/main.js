/**
 * Password Entropy Tool - Main Application Entry Point
 * Initializes all modules and sets up the chaos canvas animation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initPasswordGenerator();
    initAnalysis();
    
    // Initialize chaos canvas animation
    initChaosCanvas();
});

/**
 * Initialize Chaos Canvas Animation - Mobile Optimized
 * Creates an animated bubble background with connection lines
 */
function initChaosCanvas() {
    const canvas = document.getElementById('chaos-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    
    // Device detection for performance tuning
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth <= 575;
    
    // Adjust bubble count based on device capabilities
    const bubbleCount = isSmallScreen ? 12 : (isMobile ? 18 : 25);
    const connectionDistance = isSmallScreen ? 100 : 150;
    const connectionOpacity = isSmallScreen ? 0.05 : 0.1;
    
    let animationId = null;
    let isVisible = true;
    let frameCount = 0;
    
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
    }
    
    window.addEventListener('resize', () => {
        resize();
        bubbles.forEach(bubble => bubble.reset());
    });
    resize();
    
    // Visibility check - pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !animationId) {
            animate();
        }
    });
    
    // Bubble system
    const bubbles = [];
    
    class Bubble {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * (canvas.width / (window.devicePixelRatio || 1));
            this.y = Math.random() * (canvas.height / (window.devicePixelRatio || 1));
            this.size = Math.random() * 4 + 2;
            const speedMultiplier = isMobile ? 0.3 : 0.5;
            this.speedX = (Math.random() - 0.5) * speedMultiplier;
            this.speedY = (Math.random() - 0.5) * speedMultiplier;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 124, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize bubbles
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble());
    }
    
    // Animation loop with frame skipping on mobile for battery saving
    function animate() {
        if (!isVisible) {
            animationId = null;
            return;
        }
        
        frameCount++;
        const skipFrames = isMobile ? 1 : 0;
        
        if (frameCount % (skipFrames + 1) === 0) {
            ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
            
            // Draw bubbles
            bubbles.forEach(bubble => {
                bubble.update();
                bubble.draw();
            });
            
            // Draw connections (skip on very small screens for performance)
            if (!isSmallScreen) {
                bubbles.forEach((bubble, i) => {
                    bubbles.slice(i + 1).forEach(other => {
                        const dx = bubble.x - other.x;
                        const dy = bubble.y - other.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < connectionDistance) {
                            ctx.beginPath();
                            ctx.moveTo(bubble.x, bubble.y);
                            ctx.lineTo(other.x, other.y);
                            ctx.strokeStyle = `rgba(124, 124, 255, ${connectionOpacity * (1 - distance / connectionDistance)})`;
                            ctx.stroke();
                        }
                    });
                });
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}
