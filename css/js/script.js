/* ==========================================================================
   PRINCE ISHAQ — INTERACTIVE ENGINE & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Element References
    const welcomeScreen = document.getElementById('welcome-screen');
    const storybookScreen = document.getElementById('storybook-screen');
    const celebrationScreen = document.getElementById('celebration-screen');
    
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const replayBtn = document.getElementById('replay-btn');
    
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const pages = document.querySelectorAll('.book-page');
    
    let currentPage = 0;
    const totalPages = pages.length;

    // ----------------------------------------------------------------------
    // 1. STARFIELD & PARTICLE CANVAS
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Star {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.alpha = Math.random();
            this.speed = Math.random() * 0.01 + 0.005;
        }
        update() {
            this.alpha += this.speed;
            if (this.alpha > 1 || this.alpha < 0) {
                this.speed = -this.speed;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(241, 213, 138, ${Math.abs(this.alpha)})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 70; i++) stars.push(new Star());

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();

    // ----------------------------------------------------------------------
    // 2. AUDIO MANAGEMENT
    // ----------------------------------------------------------------------
    let isPlaying = false;

    function playAudio() {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.remove('hidden');
            musicToggle.querySelector('.music-status').textContent = 'Music On';
        }).catch(err => {
            console.log("Audio playback waiting for user action:", err);
        });
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicToggle.querySelector('.music-status').textContent = 'Muted';
        } else {
            bgMusic.play();
            isPlaying = true;
            musicToggle.querySelector('.music-status').textContent = 'Music On';
        }
    });

    // ----------------------------------------------------------------------
    // 3. NAVIGATION & PAGE TURNING
    // ----------------------------------------------------------------------
    startBtn.addEventListener('click', () => {
        playAudio();
        welcomeScreen.classList.remove('active');
        welcomeScreen.classList.add('hidden');
        
        storybookScreen.classList.remove('hidden');
        setTimeout(() => storybookScreen.classList.add('active'), 50);
        updatePages();
    });

    function updatePages() {
        pages.forEach((page, index) => {
            if (index === currentPage) {
                page.classList.add('active-page');
            } else {
                page.classList.remove('active-page');
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePages();
        } else {
            // Transition to Final Celebration
            storybookScreen.classList.remove('active');
            storybookScreen.classList.add('hidden');
            celebrationScreen.classList.remove('hidden');
            setTimeout(() => {
                celebrationScreen.classList.add('active');
                initConfetti();
            }, 50);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePages();
        }
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    document.getElementById('storybook').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.getElementById('storybook').addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 40) nextBtn.click();
        if (touchEndX > touchStartX + 40) prevBtn.click();
    }

    // Keyboard Arrow Navigation
    document.addEventListener('keydown', (e) => {
        if (!storybookScreen.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
        }
    });

    // ----------------------------------------------------------------------
    // 4. CONFETTI ANIMATION FOR CELEBRATION
    // ----------------------------------------------------------------------
    function initConfetti() {
        const cCanvas = document.getElementById('confetti-canvas');
        const cCtx = cCanvas.getContext('2d');
        cCanvas.width = window.innerWidth;
        cCanvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#D4AF69', '#F1D58A', '#FFFFFF', '#1B2A41'];

        for (let i = 0; i < 100; i++) {
            pieces.push({
                x: Math.random() * cCanvas.width,
                y: Math.random() * cCanvas.height - cCanvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                rotation: Math.random() * 360
            });
        }

        function drawConfetti() {
            cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
            pieces.forEach(p => {
                cCtx.save();
                cCtx.fillStyle = p.color;
                cCtx.translate(p.x, p.y);
                cCtx.rotate(p.rotation);
                cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                cCtx.restore();

                p.y += p.speed;
                p.rotation += 2;
                if (p.y > cCanvas.height) p.y = -10;
            });
            requestAnimationFrame(drawConfetti);
        }
        drawConfetti();
    }

    // ----------------------------------------------------------------------
    // 5. REPLAY
    // ----------------------------------------------------------------------
    replayBtn.addEventListener('click', () => {
        currentPage = 0;
        celebrationScreen.classList.remove('active');
        celebrationScreen.classList.add('hidden');
        
        welcomeScreen.classList.remove('hidden');
        setTimeout(() => welcomeScreen.classList.add('active'), 50);
    });
});
