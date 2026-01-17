// ====================
// MATRIX RAIN CURSOR EFFECT
// ====================
(function () {
    'use strict';

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let moveTimeout;

    class MatrixParticle {
        constructor(x, y) {
            this.element = document.createElement('div');
            this.element.className = 'matrix-particle';
            this.element.textContent = chars.charAt(Math.floor(Math.random() * chars.length));

            const isAlertMode = document.body.classList.contains('alert-mode');

            this.element.style.cssText = `
                position: fixed;
                font-family: 'Share Tech Mono', monospace;
                font-size: ${10 + Math.random() * 8}px;
                color: ${isAlertMode ? '#ff0000' : '#00ff9d'};
                pointer-events: none;
                z-index: 9998;
                text-shadow: 0 0 10px ${isAlertMode ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 157, 0.8)'};
                opacity: 1;
                transition: none;
            `;
            // Spawn 5px above cursor
            this.x = x + (Math.random() - 0.5) * 40;
            this.y = y - 5 - Math.random() * 10;
            this.velocityY = 2 + Math.random() * 4;
            this.life = 1;
            this.decay = 0.02 + Math.random() * 0.02;

            document.body.appendChild(this.element);
        }

        update() {
            this.y += this.velocityY;
            this.life -= this.decay;

            // Random character change
            if (Math.random() < 0.1) {
                this.element.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const isAlertMode = document.body.classList.contains('alert-mode');
            this.element.style.color = isAlertMode ? '#ff0000' : '#00ff9d';
            this.element.style.textShadow = `0 0 10px ${isAlertMode ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 157, 0.8)'}`;

            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = this.life;

            return this.life > 0;
        }

        destroy() {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    function spawnParticles() {
        if (isMouseMoving) {
            for (let i = 0; i < 2; i++) {
                particles.push(new MatrixParticle(mouseX, mouseY));
            }
        }
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles[i].destroy();
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(updateParticles);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;

        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });

    // Spawn particles at interval
    setInterval(spawnParticles, 50);
    updateParticles();

    // Hide on mouse leave
    document.addEventListener('mouseleave', () => {
        isMouseMoving = false;
    });

})();
