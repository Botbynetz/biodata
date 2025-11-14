// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for hash links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Image protection
    protectImages();
    
    // Initialize scroll reveals
    initScrollReveal();
    
    // Initialize bot demo animation (for projects page)
    if (document.getElementById('botDemo')) {
        initBotDemo();
    }
    
    // Initialize contact form (for contact page)
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
    
    // Initialize FAQ accordion (for contact page)
    initFAQAccordion();
    
    // Initialize skill bar animations (for skills page)
    initSkillBars();

    // Developer tools protection
    protectDeveloperTools();
    
    // Add hover effects to skill items
    addSkillHoverEffects();
});

// Image protection function
function protectImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Disable right-click context menu
        img.addEventListener('contextmenu', e => e.preventDefault());
        
        // Disable drag and drop
        img.addEventListener('dragstart', e => e.preventDefault());
        
        // Disable F12, Ctrl+Shift+I, Ctrl+U for images
        img.addEventListener('keydown', e => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
            }
        });
    });

    // Additional protection - Disable print screen for profile image
    document.addEventListener('keyup', e => {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText('');
            console.log('Screenshot disabled for privacy protection');
        }
    });
}

// Scroll reveal animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Apply scroll reveal to sections and cards
    const revealElements = document.querySelectorAll('.section, .glass-card, .overview-card, .skill-category, .project-card');
    revealElements.forEach(element => {
        element.classList.add('scroll-reveal');
        observer.observe(element);
    });
}

// Bot demo animation
function initBotDemo() {
    function startBotDemo() {
        const demoLines = document.querySelectorAll('.demo-line');
        let currentLine = 0;
        
        function showNextLine() {
            if (currentLine < demoLines.length) {
                demoLines[currentLine].style.opacity = '1';
                currentLine++;
                setTimeout(showNextLine, 1500);
            } else {
                // Reset animation after completion
                setTimeout(() => {
                    demoLines.forEach(line => line.style.opacity = '0');
                    currentLine = 0;
                    setTimeout(showNextLine, 1000);
                }, 3000);
            }
        }
        
        showNextLine();
    }

    // Start bot demo when projects section is visible
    const botDemo = document.getElementById('botDemo');
    if (botDemo) {
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(startBotDemo, 1000);
                }
            });
        }, { threshold: 0.5 });

        projectsObserver.observe(botDemo.closest('.section') || botDemo);
    }
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.form-submit');
    const successMessage = document.getElementById('formSuccess');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm(form)) {
            // Show loading state
            submitBtn.classList.add('loading');
            
            // Simulate form submission
            setTimeout(() => {
                // Hide loading state
                submitBtn.classList.remove('loading');
                
                // Show success message
                form.style.display = 'none';
                successMessage.classList.add('show');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'flex';
                    successMessage.classList.remove('show');
                }, 5000);
            }, 2000);
        }
    });
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const errorElement = field.parentNode.querySelector('.form-error');
        
        if (!field.value.trim()) {
            showFieldError(field, errorElement, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, errorElement, 'Please enter a valid email address');
            isValid = false;
        } else {
            hideFieldError(field, errorElement);
        }
    });
    
    return isValid;
}

function showFieldError(field, errorElement, message) {
    field.style.borderColor = '#ff6b6b';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideFieldError(field, errorElement) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    errorElement.style.display = 'none';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Skill bar animations
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0%';
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 500);
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Add hover effects to skill items
function addSkillHoverEffects() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
            item.style.background = 'rgba(0, 212, 255, 0.05)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
            item.style.background = 'transparent';
        });
    });
}

// Developer tools protection
function protectDeveloperTools() {
    // Disable F12
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+I (Inspector)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
    });

    // Disable right-click globally
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
    });
}

// Console messages
console.log('🚀 Multi-page Portfolio by Hamdanu Edy Irianto - DevOps Engineer');
console.log('🔒 Image protection enabled for privacy security');
console.log('✨ Animations and interactions loaded successfully');
console.log('🎵 Telegram Music Bot demo ready!');
console.log('📱 Responsive design activated');

// Page-specific initializations
if (window.location.pathname.includes('projects.html') || document.getElementById('botDemo')) {
    console.log('🤖 Projects page loaded - Bot demo animation ready');
}

if (window.location.pathname.includes('contact.html') || document.getElementById('contactForm')) {
    console.log('📧 Contact page loaded - Form validation ready');
}

if (window.location.pathname.includes('skills.html') || document.querySelector('.skill-progress')) {
    console.log('🛠️ Skills page loaded - Skill bar animations ready');
}

// Add loading animation completion
window.addEventListener('load', function() {
    document.body.classList.add('fade-in');
    console.log('✅ Page fully loaded and ready');
});