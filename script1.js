document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Add back the wave animation and particles
    class Wave {
        constructor(amplitude, period, phase) {
            this.amplitude = amplitude;
            this.period = period;
            this.phase = phase;
        }

        draw(time) {
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x++) {
                const y = this.amplitude * Math.sin((x / this.period) + time + this.phase);
                if (x === 0) {
                    ctx.moveTo(x, canvas.height / 2 + y);
                } else {
                    ctx.lineTo(x, canvas.height / 2 + y);
                }
            }
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.2)';  // Increased opacity
            ctx.stroke();
        }
    }

    class FloatingParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() * 40 + 190;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            this.speedX += (Math.random() - 0.5) * 0.1;
            this.speedY += (Math.random() - 0.5) * 0.1;
            
            this.speedX = Math.min(Math.max(this.speedX, -1), 1);
            this.speedY = Math.min(Math.max(this.speedY, -1), 1);
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    const waves = [
        new Wave(30, 200, 0),
        new Wave(20, 150, Math.PI / 4),
        new Wave(40, 300, Math.PI / 3)
    ];

    const particles = Array(50).fill().map(() => new FloatingParticle());
    let time = 0;

    function animate() {
        // Make background more transparent
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reduce wave visibility
        waves.forEach(wave => {
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.1)';  // Reduced opacity
            wave.draw(time);
        });
        time += 0.005;

        // Reduce particle visibility
        particles.forEach(particle => {
            particle.opacity = Math.random() * 0.3 + 0.1;  // Reduced opacity range
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Typing animation
    if (document.getElementById('typed')) {
        new Typed('#typed', {
            strings: [
                'Web Development',
                'Problem Solving',
                'Creative Design'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true
        });
    }

    // Projects functionality
    const projects = [
        {
            title: "Portfolio Website",
            description: "A personal portfolio built with HTML, CSS, and JavaScript showcasing my skills and projects.",
            link: "https://github.com/avanthika0609/portfolio_webp"
        },
        {
            title: "Predicting Health Conditions Using Wearable Device",
            description: "This device tracks health in real-time using sensors and a UI for early disorder detection.",
            link: "https://github.com/avanthika0609/intro_to_eng"
        },
        {
            title: "Fraud Detection in Credit Card Transactions",
            description: "Detecting Anomalies in Online Banking and Credit Card Transactions Using Machine Learning Algorithms.",
            link: "https://github.com/avanthika0609/detecting_anomalies"
        }
    ];
    
    const projectContainer = document.getElementById('project-container');
    const progressDots = document.getElementById('progress-dots');
    let startX, isDragging = false;
    let currentTranslate = 0;

    // Create progress dots
    projects.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        progressDots.appendChild(dot);
    });

    function updateDots(index) {
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    let currentProject = 0;
    
    window.prevProject = function() {
        currentProject = (currentProject - 1 + projects.length) % projects.length;
        showProject(currentProject);
    }
    
    window.nextProject = function() {
        currentProject = (currentProject + 1) % projects.length;
        showProject(currentProject);
    }
    
    function showProject(index) {
        const projectTitle = document.getElementById('project-title');
        const projectDesc = document.getElementById('project-description');
        const projectContainer = document.getElementById('project-container');
        
        if (projectTitle && projectDesc && projectContainer) {
            projectContainer.style.opacity = '0';
            setTimeout(() => {
                projectTitle.textContent = projects[index].title;
                projectDesc.textContent = projects[index].description;
                projectContainer.onclick = () => window.open(projects[index].link, '_blank');
                projectContainer.style.opacity = '1';
                updateDots(index);
            }, 300);
        }
    }

    // Touch events
    projectContainer.addEventListener('touchstart', dragStart);
    projectContainer.addEventListener('touchend', dragEnd);
    projectContainer.addEventListener('touchmove', drag);

    // Mouse events
    projectContainer.addEventListener('mousedown', dragStart);
    projectContainer.addEventListener('mouseup', dragEnd);
    projectContainer.addEventListener('mouseleave', dragEnd);
    projectContainer.addEventListener('mousemove', drag);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
        } else {
            startX = e.clientX;
            projectContainer.classList.add('dragging');
        }
        isDragging = true;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextProject();
            } else {
                prevProject();
            }
            isDragging = false;
        }
    }

    function dragEnd() {
        isDragging = false;
        projectContainer.classList.remove('dragging');
    }

    // Initialize first project
    showProject(0);

    // Form validation
    window.validateForm = function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        // If validation passes, you can handle the form submission here
        alert('Message sent successfully!');
        document.getElementById('messageForm').reset();
        return false;
    }

    // Handle page transitions
    const transition = document.querySelector('.page-transition');
    if (transition) {
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                transition.classList.remove('active');
            }
        });
    }
});
