// transitions.js

// Must load GSAP before this file. 
// e.g., <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

document.addEventListener("DOMContentLoaded", () => {
    initTransitionDOM();
    playEntryAnimation();
    hijackLinks();
});

function initTransitionDOM() {
    // 1. Create Overlay dynamically so we don't clutter HTML pages
    let overlay = document.getElementById("transition-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "transition-overlay";
        
        const brand = document.createElement("div");
        brand.className = "brand";
        brand.innerText = "Absent Mind";
        overlay.appendChild(brand);

        // Add depth particles
        for(let i = 0; i < 20; i++) {
            const p = document.createElement("div");
            p.className = "t-particle";
            // Random properties
            const size = Math.random() * 4 + 2;
            p.style.width = size + "px";
            p.style.height = size + "px";
            p.style.left = Math.random() * 100 + "vw";
            p.style.top = Math.random() * 100 + "vh";
            // Custom properties for GSAP
            p.dataset.z = Math.random() * 200 - 100;
            overlay.appendChild(p);
        }

        document.body.appendChild(overlay);
    }
}

// 2. Play immersive Entry Animation
function playEntryAnimation() {
    const wrapper = document.getElementById("page-wrapper");
    const overlay = document.getElementById("transition-overlay");
    if(!wrapper) {
        console.warn("transition.js requires a <div id='page-wrapper'> wrapping the body content.");
        return;
    }

    // Set initial initial states for entry
    gsap.set(wrapper, { 
        scale: 0.9, 
        transformOrigin: "center center",
        filter: "blur(15px)",
        opacity: 0
    });
    
    // Animate wrapper coming into focus
    gsap.to(wrapper, {
        scale: 1.0,
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.1
    });

    // Fade out overlay glassmorphism
    gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.2, // let the page stabilize a bit
        onComplete: () => {
            overlay.style.pointerEvents = "none"; // allow clicks
        }
    });

    // Make sure particles start with opacity 0
    gsap.set(".t-particle", { opacity: 0, scale: 0 });
}

// 3. Expose TransitTo function for manual triggers (like finishing a script)
window.TransitTo = function(url, options = {}) {
    const wrapper = document.getElementById("page-wrapper");
    const overlay = document.getElementById("transition-overlay");
    const brand = overlay.querySelector(".brand");

    // Optional dynamic colors based on destination or passed option
    let gradient = "radial-gradient(circle at center, rgba(108, 99, 255, 0.2) 0%, rgba(5, 5, 12, 1) 80%)";
    if (options.theme === 'emerald') {
        gradient = "radial-gradient(circle at center, rgba(46, 213, 137, 0.2) 0%, rgba(5, 5, 12, 1) 80%)";
    } else if (options.theme === 'orange') {
        gradient = "radial-gradient(circle at center, rgba(255, 159, 67, 0.2) 0%, rgba(5, 5, 12, 1) 80%)";
    }

    overlay.style.background = gradient;
    overlay.style.pointerEvents = "all"; // block user interaction during exit

    // --- EXIT ANIMATION PHASE ---
    
    // 1. Bring up the glass overlay
    gsap.to(overlay, { opacity: 1, duration: 0.6, ease: "power2.out" });

    // 2. Animate brand text
    gsap.to(brand, { opacity: 1, scale: 1.0, duration: 0.6, delay: 0.2, ease: "power3.out" });

    // 3. Animate particles for a "warp" depth effect
    gsap.to(".t-particle", { 
        opacity: 0.8, 
        scale: 1, 
        z: 200, // Move forward
        duration: 0.8, 
        stagger: { amount: 0.3, from: "random" },
        ease: "power2.out"
    });

    // 4. Push the current page wrapper back into 3D space
    if(wrapper) {
        gsap.to(wrapper, {
            scale: 0.9,
            filter: "blur(20px)",
            opacity: 0,
            duration: 1.0,
            ease: "power3.inOut",
            onComplete: () => {
                // Execute redirection when animation fully finishes
                window.location.href = url;
            }
        });
    } else {
        setTimeout(() => { window.location.href = url; }, 1000);
    }
};

// Automatically attach to all <a> tags that are meant to navigate away
function hijackLinks() {
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            
            // Skip anchor jumps and empty links
            if(!href || href.startsWith("#") || href === "") return;

            // Stop default nav instantly
            e.preventDefault();
            
            // Randomly choose theme for demo purposes (you can assign via data-attributes)
            const themes = ['default', 'emerald', 'orange'];
            const theme = link.dataset.theme || themes[Math.floor(Math.random() * themes.length)];

            // Play the 3D transition and route!
            window.TransitTo(href, { theme: theme });
        });
    });
}
