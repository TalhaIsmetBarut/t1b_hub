// ====================
// TERMINAL LOADING SCREEN
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('terminal-loader');
    const lines = document.querySelectorAll('.terminal-line');

    // Show lines one by one
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 400 * (index + 1));
    });

    // Hide loader after all lines shown
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
    }, 2500);
});

// ====================
// TYPEWRITER EFFECT
// ====================
const typewriterText = "T1B_hub";
const typewriterElement = document.getElementById('typewriter');
let charIndex = 0;

function typeWriter() {
    if (charIndex < typewriterText.length) {
        typewriterElement.textContent += typewriterText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 150);
    }
}

// Start typewriter after loading screen
setTimeout(() => {
    typeWriter();
}, 2600);

// ====================
// SCROLL INDICATOR & SCROLL TO TOP
// ====================
const scrollIndicator = document.getElementById('scroll-indicator');
const scrollToTop = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollIndicator.classList.add('hidden');
        scrollToTop.classList.remove('hidden');
    } else {
        scrollIndicator.classList.remove('hidden');
        scrollToTop.classList.add('hidden');
    }
});

// Click to scroll down
scrollIndicator.addEventListener('click', () => {
    window.scrollBy({
        top: 600,
        behavior: 'smooth'
    });
});

// Click to scroll to top
scrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ====================
// CATEGORY FILTERS
// ====================
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const category = button.dataset.category;

        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'flex';
                card.style.animation = 'cardSlideIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ====================
// EASTER EGG - T1B KEY SEQUENCE
// ====================
let keySequence = '';
const secretCode = 't1b';
const alertOverlay = document.getElementById('alert-overlay');
const closeAlertBtn = document.getElementById('close-alert');

document.addEventListener('keydown', (e) => {
    keySequence += e.key.toLowerCase();

    // Keep only last 3 characters
    if (keySequence.length > 3) {
        keySequence = keySequence.slice(-3);
    }

    // Check for secret code
    if (keySequence === secretCode) {
        activateAlertMode();
        keySequence = '';
    }
});

let savedScrollPosition = 0;
const originalTitle = 'T1B_hub';
const hackedTitle = 'HACKED BY T1B';
const subtitleElement = document.querySelector('.profile-subtitle');
const versionElement = document.querySelector('.version');
const originalSubtitle = subtitleElement ? subtitleElement.innerHTML : '';
const originalVersion = versionElement ? versionElement.textContent : 'v1.0';
let glitchInterval = null;
let versionGlitchInterval = null;

// Random characters for glitch effect
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateGlitchText() {
    let result = '';
    for (let i = 0; i < 30; i++) {
        result += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
    }
    return result;
}

function generateRandomVersion() {
    const major = Math.floor(Math.random() * 10);
    const minor = Math.floor(Math.random() * 10);
    return `v${major}.${minor}`;
}

function startGlitchEffect() {
    if (subtitleElement) {
        glitchInterval = setInterval(() => {
            subtitleElement.innerHTML = `<span style="color: #ff0000; font-family: 'Share Tech Mono', monospace;">${generateGlitchText()}</span>`;
        }, 100);
    }

    // Version glitch
    if (versionElement) {
        versionGlitchInterval = setInterval(() => {
            versionElement.textContent = generateRandomVersion();
            versionElement.style.color = '#ff0000';
        }, 150);
    }
}

function stopGlitchEffect() {
    if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
    }
    if (versionGlitchInterval) {
        clearInterval(versionGlitchInterval);
        versionGlitchInterval = null;
    }
    if (subtitleElement) {
        subtitleElement.innerHTML = originalSubtitle;
    }
    if (versionElement) {
        versionElement.textContent = originalVersion;
        versionElement.style.color = '';
    }
}

function activateAlertMode() {
    // Save current scroll position
    savedScrollPosition = window.scrollY;

    // Scroll to top to show alert
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.body.classList.add('alert-mode');
    alertOverlay.classList.remove('hidden');

    // Hide scroll indicator
    if (scrollIndicator) {
        scrollIndicator.classList.add('hidden');
    }

    // Change title to hacked message
    if (typewriterElement) {
        typewriterElement.textContent = hackedTitle;
    }

    // Start subtitle glitch effect
    startGlitchEffect();

    // Add glitch effect to cards
    cards.forEach(card => {
        card.classList.add('glitch-card');
    });
}

function deactivateAlertMode() {
    // Stop glitch effect immediately
    stopGlitchEffect();

    // Create CRT shutdown overlay
    const crtOverlay = document.createElement('div');
    crtOverlay.id = 'crt-shutdown';
    crtOverlay.innerHTML = '<div class="crt-line"></div>';
    document.body.appendChild(crtOverlay);

    // Trigger CRT animation
    setTimeout(() => {
        crtOverlay.classList.add('active');
    }, 10);

    // Reload page after animation completes
    setTimeout(() => {
        location.reload();
    }, 1200);
}

closeAlertBtn.addEventListener('click', deactivateAlertMode);

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !alertOverlay.classList.contains('hidden')) {
        deactivateAlertMode();
    }
});
