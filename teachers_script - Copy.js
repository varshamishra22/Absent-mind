document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. INITIALIZE PARTICLES BACKGROUND
       ========================================= */
    if(window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#00d4ff", "#5c33ff", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
                "size": { "value": 3, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } },
                "line_linked": { "enable": true, "distance": 150, "color": "#00d4ff", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }

    /* =========================================
       2. 3D LOADER & TRANSITION LOGIC
       ========================================= */

    // Initialize Three.js Hologram (Completely 3D)
    function initThreeJS() {
        const canvas = document.getElementById('teacher-3d-canvas');
        if(!canvas || !window.THREE) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group for rotation
        const holoGroup = new THREE.Group();
        scene.add(holoGroup);

        // Core Glowing Sphere
        const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ 
            color: 0x00d4ff, 
            transparent: true, 
            opacity: 0.8,
            wireframe: true
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        holoGroup.add(core);

        // Inner solid core
        const innerGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        holoGroup.add(inner);

        // Electron Rings (Atom effect)
        const ringGeo = new THREE.TorusGeometry(2, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x5c33ff, transparent: true, opacity: 0.6 });
        
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        ring1.rotation.x = Math.PI / 2;
        holoGroup.add(ring1);
        
        const ring2 = new THREE.Mesh(ringGeo, ringMat);
        ring2.rotation.y = Math.PI / 3;
        ring2.rotation.x = Math.PI / 4;
        holoGroup.add(ring2);
        
        const ring3 = new THREE.Mesh(ringGeo, ringMat);
        ring3.rotation.y = -Math.PI / 3;
        ring3.rotation.x = Math.PI / 4;
        holoGroup.add(ring3);

        // Floating Particles around the atom
        const partGeo = new THREE.BufferGeometry();
        const partCount = 200;
        const posArray = new Float32Array(partCount * 3);
        for(let i=0; i<partCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 8;
        }
        partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const partMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const particlesMesh = new THREE.Points(partGeo, partMat);
        scene.add(particlesMesh);

        // Animation Loop
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;
            
            holoGroup.rotation.y += 0.01;
            holoGroup.rotation.x += 0.005;
            
            ring1.rotation.y += 0.02;
            ring2.rotation.x += 0.02;
            ring3.rotation.z += 0.02;

            core.scale.set(1 + Math.sin(time*2)*0.1, 1 + Math.sin(time*2)*0.1, 1 + Math.sin(time*2)*0.1);
            
            particlesMesh.rotation.y -= 0.002;
            particlesMesh.rotation.x += 0.001;
            
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    initThreeJS();

    const loadingPercentEl = document.getElementById('loading-percent');
    const progressBarEl = document.getElementById('hud-progress-bar');
    const terminalTextEl = document.getElementById('terminal-text');
    const loaderWrapper = document.getElementById('loader-wrapper');
    const dashboardWrapper = document.getElementById('dashboard-wrapper');
    const successSound = document.getElementById('success-sound');

    const terminalMessages = [
        "Initializing Teacher Matrices...",
        "Establishing Secure Neural Link...",
        "Loading Student Biosignatures...",
        "Calibrating Assessment Frameworks...",
        "Sync Complete. Preparing to dive..."
    ];

    let currentPercent = 0;
    
    // Simulate complex AI initializations (loading process)
    const loadInterval = setInterval(() => {
        // Random increment
        let increment = Math.floor(Math.random() * 5) + 1;
        currentPercent += increment;

        if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(loadInterval);
            terminalTextEl.innerText = terminalMessages[4];
            completeLoadingSequence();
        } else {
            // Update terminal text based on percent
            if (currentPercent > 20 && currentPercent < 40) terminalTextEl.innerText = terminalMessages[1];
            if (currentPercent > 40 && currentPercent < 70) terminalTextEl.innerText = terminalMessages[2];
            if (currentPercent > 70 && currentPercent < 95) terminalTextEl.innerText = terminalMessages[3];
        }

        loadingPercentEl.innerText = currentPercent;
        progressBarEl.style.width = `${currentPercent}%`;

    }, 80);

    function completeLoadingSequence() {
        loadingPercentEl.innerText = "100";
        progressBarEl.style.width = "100%";
        
        // Bonus: Play Sound
        if(successSound) {
            successSound.volume = 0.5;
            successSound.play().catch(e => console.log("Audio play prevented by browser policy", e));
        }

        // Trigger the deep 3D Camera Dive
        setTimeout(() => {
            loaderWrapper.classList.add('camera-dive');
            
            // Wait for dive to finish zooming
            setTimeout(() => {
                loaderWrapper.classList.add('hidden');
                document.body.style.overflow = "auto";
                
                // Show Dashboard
                dashboardWrapper.classList.remove('hidden');
                
                // Slight delay to ensure display block has registered before opacity transform
                requestAnimationFrame(() => {
                    dashboardWrapper.classList.add('dashboard-active');
                    initDashboardLogic(); // Initialize charts and data
                });
            }, 1000); // 1000ms dive duration matching CSS
        }, 600); // Small pause at 100%
    }

    /* =========================================
       3. DASHBOARD LOGIC (Chart, Students, AI)
       ========================================= */
    function initDashboardLogic() {
        initChart();
        generateStudentData();
        setupAIGenerator();
        setupSidebar();
    }

    /* --- CHART.JS --- */
    function initChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');

        // Gradient for line (Richer Gradient)
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');   // Secondary cyan
        gradient.addColorStop(0.5, 'rgba(92, 51, 255, 0.4)'); // Purple mix
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0.01)');

        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Class Average %',
                    data: [65, 68, 75, 71, 82, 85],
                    borderColor: '#00d4ff', // Cyan
                    backgroundColor: gradient,
                    borderWidth: 4,
                    pointBackgroundColor: '#0b0f19', // Dark point
                    pointBorderColor: '#00d4ff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#5c33ff',
                    pointHoverBorderWidth: 4,
                    fill: true,
                    tension: 0.45 // Smoother curves
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 20, 35, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#00d4ff',
                        bodyFont: { weight: 'bold', size: 14 },
                        padding: 12,
                        borderColor: 'rgba(0, 212, 255, 0.3)',
                        borderWidth: 1,
                        displayColors: false,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '% Mastery';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#a0a5b5' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#a0a5b5', stepSize: 10 },
                        min: 0,
                        max: 100
                    }
                }
            }
        });

        // Add Chart Weekly/Monthly Toggle Logic
        const chartBtns = document.querySelectorAll('.stat-card .btn-group .btn-sm');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                chartBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (e.target.innerText === 'Monthly') {
                    myChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                    myChart.data.datasets[0].data = [60, 72, 68, 85, 80, 92];
                } else {
                    myChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
                    myChart.data.datasets[0].data = [65, 68, 75, 71, 82, 85];
                }
                myChart.update();
            });
        });
    }

    /* --- STUDENT MOCK DATABASE & RANKING --- */
    function generateStudentData() {
        // Mocking Data
        let students = [
            { id: 1, name: "Alexander Wright", class: "Grade 12", marks: 96 },
            { id: 2, name: "Sophia Martinez", class: "Grade 12", marks: 91 },
            { id: 3, name: "Liam Johnson", class: "Grade 12", marks: 88 },
            { id: 4, name: "Emma Davis", class: "Grade 12", marks: 74 },
            { id: 5, name: "Noah Thompson", class: "Grade 12", marks: 65 },
            { id: 6, name: "Oliver White", class: "Grade 12", marks: 38 },
            { id: 7, name: "Mia Brown", class: "Grade 12", marks: 32 }
        ];

        // 1. Sort students Highest to Lowest
        students.sort((a, b) => b.marks - a.marks);

        const topStudentsList = document.getElementById('top-students-list');
        const lowStudentsList = document.getElementById('low-students-list');
        const liveRankingList = document.getElementById('live-ranking-list');

        topStudentsList.innerHTML = '';
        lowStudentsList.innerHTML = '';
        liveRankingList.innerHTML = '';

        students.forEach((student, index) => {
            let rank = index + 1;
            
            // Build Base Card HTML
            let cardHTML = `
                <div class="student-card ${student.marks < 40 ? 'alert-student' : ''}">
                    <div class="sc-rank rank-${rank > 3 ? 'other' : rank}">${rank}</div>
                    <div class="sc-info">
                        <div class="sc-name">${student.name}</div>
                        <div class="sc-class">${student.class}</div>
                    </div>
                    <div class="sc-score">${student.marks}%</div>
                </div>
            `;

            // Populate Live Leaderboard (All)
            liveRankingList.insertAdjacentHTML('beforeend', cardHTML);

            // Populate Top Students (Top 3)
            if (rank <= 3) {
                topStudentsList.insertAdjacentHTML('beforeend', cardHTML);
            }

            // Populate Low Performing (<40 marks)
            if (student.marks < 40) {
                lowStudentsList.insertAdjacentHTML('beforeend', cardHTML);
            }
        });
    }

    /* --- AI QUIZ GENERATOR SIMULATION --- */
    function setupAIGenerator() {
        const form = document.getElementById('ai-quiz-form');
        const loadingZone = document.getElementById('ai-loading');
        const resultsZone = document.getElementById('ai-results');
        const generateBtn = document.getElementById('btn-generate-ai');
        const quizList = document.getElementById('quiz-list');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const subject = document.getElementById('ai-subject').value;
            const topic = document.getElementById('ai-topic').value;
            const loadingText = loadingZone.querySelector('.typed-text');

            // 1. Hide Form, Show Loading
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            
            form.parentElement.classList.add('hidden');
            loadingZone.classList.remove('hidden');
            resultsZone.classList.add('hidden');

            if (subject === 'Mixed') {
                loadingText.innerText = `Fusing Neural Pathways for Mixed Subjects...`;
            } else {
                loadingText.innerText = `Initializing Models for ${subject}...`;
            }

            // 2. Simulate Network Request (API Call) with Progress
            let currentQ = 0;
            const totalQ = 5;
            
            const aiInterval = setInterval(() => {
                currentQ++;
                if (currentQ <= totalQ) {
                    loadingText.innerText = `Synthesizing Question ${currentQ} of ${totalQ}...`;
                }
                
                if (currentQ > totalQ) {
                    clearInterval(aiInterval);
                    loadingZone.classList.add('hidden');
                    resultsZone.classList.remove('hidden');
                    
                    // Show form again (to allow another generation)
                    form.parentElement.classList.remove('hidden');
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Synthesize Quiz';

                    // 3. Render Simulated MCQs
                    renderMockAIQuestions(subject, topic, quizList);
                }
            }, 600); // 600ms per question -> 3 seconds total fake delay
        });
    }

    function renderMockAIQuestions(subject, topic, container) {
        // Dummy questions generator based on inputs
        let mcqs = [];
        if (subject === 'Mixed') {
            mcqs = [
                {
                    q: `How does the ${topic} principle in Physics correlate with Biological neural networks?`,
                    opts: ["Energy conservation", "Synaptic pruning", "Signal propagation", "Quantum entanglement"],
                    correct: 2
                },
                {
                    q: `Calculate the algorithmic complexity of simulating ${topic} in a mathematical model.`,
                    opts: ["O(n)", "O(log n)", "O(n^2)", "O(e^n)"],
                    correct: 3
                },
                {
                    q: `Which interdisciplinary field best utilizes ${topic} for practical applications?`,
                    opts: ["Bioinformatics", "Astrophysics", "Computational Linguistics", "Quantum Chemistry"],
                    correct: 0
                },
                {
                    q: `Identify the mathematical equation that bridges the gap between ${topic} and thermodynamics.`,
                    opts: ["E=mc^2", "Navier-Stokes", "Boltzmann entropy", "Schrodinger equation"],
                    correct: 2
                },
                {
                    q: `What is the primary biological limitation when attempting to compute ${topic} continuously?`,
                    opts: ["ATP depletion", "Overheating", "Memory overflow", "Genetic drift"],
                    correct: 0
                }
            ];
        } else {
            mcqs = [
                {
                    q: `What is the primary governing principle behind ${topic} in ${subject}?`,
                    opts: ["Quantum Entanglement", "Newton's First Law", "Thermodynamic Equilibrium", "Heisenberg Uncertainty"],
                    correct: 2
                },
                {
                    q: `Which scientist is most widely recognized for foundational work in ${topic}?`,
                    opts: ["Albert Einstein", "Marie Curie", "Isaac Newton", "Niels Bohr"],
                    correct: 0
                },
                {
                    q: `Calculate the derivative of the core equation related to ${topic}.`,
                    opts: ["0", "Infinity", "Undefined", "1"],
                    correct: 0
                },
                {
                    q: `In practical applications of ${subject}, how is ${topic} mainly utilized?`,
                    opts: ["Energy Storage", "Data Encryption", "Signal Modulation", "Biomedical Imaging"],
                    correct: 3
                },
                {
                    q: `Identify the false statement regarding ${topic} parameters.`,
                    opts: ["It is scalar", "It depends on temperature", "It is always positive", "It inversely scales with frequency"],
                    correct: 1
                }
            ];
        }

        container.innerHTML = '';
        mcqs.forEach((mcq, idx) => {
            let optionsHTML = '';
            mcq.opts.forEach((opt, oIdx) => {
                let isCorrect = oIdx === mcq.correct ? 'correct' : '';
                optionsHTML += `<div class="mcq-opt ${isCorrect}">${String.fromCharCode(65+oIdx)}. ${opt}</div>`;
            });

            const html = `
                <div class="mcq-card">
                    <div class="mcq-q">Q${idx+1}: ${mcq.q}</div>
                    <div class="mcq-options">
                        ${optionsHTML}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    /* --- SIDEBAR TOGGLE --- */
    function setupSidebar() {
        const links = document.querySelectorAll('.nav-links li');
        links.forEach(link => {
            link.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const text = link.querySelector('span').innerText;
                if (text === 'Dashboard') {
                    document.querySelector('.dashboard-grid').scrollIntoView({behavior: 'smooth', block: 'start'});
                } else if (text === 'AI Quiz Maker') {
                    document.getElementById('ai-generator-section').scrollIntoView({behavior: 'smooth', block: 'center'});
                } else if (text === 'Manual Quiz') {
                    document.getElementById('manual-quiz-section').scrollIntoView({behavior: 'smooth', block: 'center'});
                } else if (text === 'Students Matrix') {
                    document.getElementById('top-students-section').scrollIntoView({behavior: 'smooth', block: 'start'});
                }
            });
        });
        
        // Theme Toggle
        const themeBtn = document.getElementById('theme-btn');
        themeBtn.addEventListener('click', () => {
            const icon = themeBtn.querySelector('i');
            if (icon.classList.contains('fa-moon')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                document.body.style.filter = "invert(1) hue-rotate(180deg)";
                setTimeout(() => alert("Light mode engaged. (Visuals inverted for demo)"), 300);
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                document.body.style.filter = "none";
            }
        });

        // Logout
        const logoutBtn = document.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', () => {
            alert("Disconnecting Neural Link...");
            document.getElementById('dashboard-wrapper').classList.remove('dashboard-active');
            setTimeout(() => window.location.reload(), 800);
        });

        // Topbar Buttons
        const topBtns = document.querySelectorAll('.profile-area .nav-btn');
        topBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('notification-icon')) {
                    alert("System Alerts: 3 New Notifications. Class performance optimized.");
                } else {
                    alert("Initiating Deep Database Search...");
                }
            });
        });

        // Export Button
        const exportBtn = document.querySelector('#ai-results .btn-outline-sm');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting...';
                setTimeout(() => {
                    this.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded';
                    alert("Quiz Protocol successfully exported to local storage.");
                    setTimeout(() => {
                        this.innerHTML = '<i class="fa-solid fa-download"></i> Export';
                    }, 2000);
                }, 1500);
            });
        }

        // Manual Quiz Form Basic Prevention
        document.getElementById('manual-quiz-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Protocol Accepted: Question successfully appended to the local database!");
            e.target.reset();
        });
    }

});
