// ====================
// SOUND EFFECTS & KONAMI CODE EASTER EGG
// ====================
(function () {
    'use strict';

    // ====================
    // AUDIO CONTEXT SETUP
    // ====================
    let audioContext = null;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    // ====================
    // HOVER SOUND (Subtle beep)
    // ====================
    function playHoverSound() {
        try {
            const ctx = initAudio();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Audio not supported
        }
    }

    // Add hover sound to cards
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', playHoverSound);
        });

        // Also add to filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('mouseenter', playHoverSound);
        });
    });

    // ====================
    // CRT CLOSE SOUND
    // ====================
    window.playCRTSound = function () {
        try {
            const ctx = initAudio();

            // White noise burst
            const bufferSize = ctx.sampleRate * 0.3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

            // Low frequency thump
            const oscillator = ctx.createOscillator();
            const oscGain = ctx.createGain();
            oscillator.frequency.setValueAtTime(150, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);
            oscGain.gain.setValueAtTime(0.4, ctx.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            oscillator.connect(oscGain);
            oscGain.connect(ctx.destination);

            noise.start();
            oscillator.start();
            noise.stop(ctx.currentTime + 0.3);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) {
            // Audio not supported
        }
    };

    // ====================
    // KONAMI CODE EASTER EGG
    // ↑↑↓↓←→←→BA
    // ====================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let matrixRainActive = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateMatrixRain();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateMatrixRain() {
        if (matrixRainActive) return;
        matrixRainActive = true;

        // Create fullscreen matrix rain
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-rain-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99990;
            pointer-events: none;
            opacity: 0.7;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff9d';
            ctx.font = fontSize + 'px Share Tech Mono';

            for (let i = 0; i < drops.length; i++) {
                const char = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const matrixInterval = setInterval(drawMatrix, 50);

        // Play sound
        try {
            const actx = initAudio();
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.connect(gain);
            gain.connect(actx.destination);
            osc.frequency.value = 440;
            osc.type = 'square';
            gain.gain.setValueAtTime(0.1, actx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.5);
            osc.start();
            osc.stop(actx.currentTime + 0.5);
        } catch (e) { }

        // Remove after 5 seconds
        setTimeout(() => {
            clearInterval(matrixInterval);
            canvas.remove();
            matrixRainActive = false;
        }, 5000);

        console.log('%c🎮 KONAMI CODE ACTIVATED!', 'color: #00ff9d; font-size: 20px;');
    }

})();
