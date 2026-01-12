// script.js - consolidated interactive behaviors with analytics

// EmailJS Configuration
(function() {
    emailjs.init("rF40lGBXuiItQQk4o");
})();

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // 2. Smooth Scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 3. Scroll Animations (Intersection Observer)
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // 4. Floating WhatsApp Button Show/Hide
    const floatingWhatsApp = document.getElementById('floatingWhatsapp');
    if (floatingWhatsApp) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                floatingWhatsApp.classList.remove('hidden');
            } else {
                floatingWhatsApp.classList.add('hidden');
            }
        });
    }

    // 5. FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            this.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active', !isExpanded);
            
            // Track FAQ interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_interaction', {
                    'faq_question': this.querySelector('span').textContent,
                    'action': !isExpanded ? 'open' : 'close'
                });
            }
        });
    });

    // 6. SEO Audit Tool Functionality
    const auditForm = document.getElementById('seoAuditForm');
    const submitBtn = document.getElementById('auditSubmitBtn');
    const resultsDiv = document.getElementById('auditResults');
    
    if (auditForm) {
        auditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            runSEOAudit();
        });
    }
    
    function runSEOAudit() {
        const formData = new FormData(auditForm);
        const website = formData.get('website');
        const restaurant = formData.get('restaurant');
        const city = formData.get('city');
        const email = formData.get('email');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'flex';
        
        // Track audit start
        if (typeof gtag !== 'undefined') {
            gtag('event', 'seo_audit_start', {
                'restaurant_name': restaurant,
                'city': city,
                'website': website
            });
        }
        
        // Simulate audit process (replace with real API calls)
        setTimeout(() => {
            const auditResults = simulateAuditResults(website, restaurant, city);
            displayAuditResults(auditResults, restaurant, city, email);
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'block';
            submitBtn.querySelector('.btn-loading').style.display = 'none';
            
            // Track audit completion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'seo_audit_complete', {
                    'restaurant_name': restaurant,
                    'city': city,
                    'seo_score': auditResults.seoScore
                });
            }
        }, 3000);
    }
    
    function simulateAuditResults(website, restaurant, city) {
        // Simulate realistic audit results
        const hasWww = website.includes('www.');
        const hasHttps = website.includes('https://');
        const domainAge = Math.random();
        
        let googleRanking = Math.floor(Math.random() * 20) + 1;
        let gmbStatus = Math.random() > 0.6 ? 'Trovato' : 'Non trovato';
        let siteSpeed = Math.floor(Math.random() * 40) + 60;
        let seoScore = Math.floor(Math.random() * 30) + 40;
        
        // Adjust based on website characteristics
        if (hasHttps) seoScore += 10;
        if (hasWww) seoScore += 5;
        if (domainAge > 0.7) seoScore += 15;
        
        return {
            googleRanking: googleRanking > 10 ? 'Non in top 10' : `#${googleRanking}`,
            gmbStatus: gmbStatus,
            siteSpeed: `${siteSpeed}/100`,
            seoScore: `${Math.min(seoScore, 100)}/100`
        };
    }
    
    function displayAuditResults(results, restaurant, city, email) {
        // Update result values
        document.getElementById('googleRanking').textContent = results.googleRanking;
        document.getElementById('gmbStatus').textContent = results.gmbStatus;
        document.getElementById('siteSpeed').textContent = results.siteSpeed;
        document.getElementById('seoScore').textContent = results.seoScore;
        
        // Add color classes based on performance
        const scoreValue = parseInt(results.seoScore.split('/')[0]);
        const scoreElement = document.getElementById('seoScore');
        scoreElement.className = 'result-value';
        if (scoreValue < 60) scoreElement.classList.add('poor');
        else if (scoreValue < 80) scoreElement.classList.add('average');
        else scoreElement.classList.add('good');
        
        // Update WhatsApp link
        const whatsappBtn = document.getElementById('auditWhatsAppBtn');
        const message = `Ciao! Ho fatto l'analisi SEO gratuita per il mio ristorante "${restaurant}" a ${city}. I risultati mostrano che posso migliorare molto. Vorrei sapere come potete aiutarmi. Email: ${email}`;
        whatsappBtn.href = `https://wa.me/+393123456789?text=${encodeURIComponent(message)}`;
        
        // Update audit message
        const auditMessage = document.getElementById('auditMessage');
        if (scoreValue < 60) {
            auditMessage.textContent = '⚠️ Il tuo ristorante ha bisogno di ottimizzazioni urgenti per essere trovato online. Contattaci per un piano di miglioramento personalizzato.';
        } else if (scoreValue < 80) {
            auditMessage.textContent = '📈 Buoni risultati ma c\'è margine di miglioramento. Possiamo aiutarti a raggiungere la top 3 di Google.';
        } else {
            auditMessage.textContent = '🎉 Ottimi risultati! Il tuo ristorante è ben posizionato. Contattaci per strategie avanzate di crescita.';
        }
        
        // Show results
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Track WhatsApp button click
        whatsappBtn.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'audit_whatsapp_click', {
                    'restaurant_name': restaurant,
                    'city': city,
                    'seo_score': scoreValue
                });
            }
        });
    }

    // 7. Examples popup functionality
    const popup = document.getElementById("iframePopup");
    const frame = document.getElementById("previewFrame");
    const closeBtn = document.querySelector(".popup-close");

    if (popup && frame && closeBtn) {
        document.querySelectorAll(".thumb").forEach(img => {
            img.addEventListener("click", () => {
                const url = img.dataset.url;
                frame.src = url;
                popup.classList.remove("hidden");
            });
        });

        closeBtn.addEventListener("click", () => {
            frame.src = "";
            popup.classList.add("hidden");
        });

        popup.addEventListener("click", e => {
            if (e.target === popup) {
                frame.src = "";
                popup.classList.add("hidden");
            }
        });
    }

    // 8. Contact Form Email Functionality
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendEmail();
        });
    }
    
    function sendEmail() {
        // Show loading state
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.querySelector('.btn-text').style.display = 'none';
        contactSubmitBtn.querySelector('.btn-loading').style.display = 'flex';
        hideMessage();
        
        // Get form data
        const formData = new FormData(contactForm);
        const templateParams = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefono: formData.get('telefono') || 'Non fornito',
            tipo_attivita: formData.get('tipo_attivita'),
            messaggio: formData.get('messaggio') || 'Nessun messaggio aggiuntivo',
            to_email: 'info@visibilitalocale.it',
            data_invio: new Date().toLocaleString('it-IT')
        };
        
        // Send email via EmailJS
        emailjs.send('service_t58unpo', 'template_d5bsjet', templateParams)
            .then(function(response) {
                showMessage('✅ Messaggio inviato con successo! Ti risponderemo entro 24 ore.', 'success');
                contactForm.reset();
                
                // Track successful form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_success', {
                        'business_type': templateParams.tipo_attivita,
                        'has_phone': templateParams.telefono !== 'Non fornito' ? 'yes' : 'no'
                    });
                }
            })
            .catch(function(error) {
                showMessage('❌ Errore nell\'invio del messaggio. Riprova o contattaci su WhatsApp.', 'error');
                console.error('EmailJS error:', error);
                
                // Track form error
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_error', {
                        'error_type': 'emailjs_error'
                    });
                }
            })
            .finally(function() {
                // Reset button state
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.querySelector('.btn-text').style.display = 'block';
                contactSubmitBtn.querySelector('.btn-loading').style.display = 'none';
            });
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function hideMessage() {
        formMessage.style.display = 'none';
    }

    // 9. Enhanced tracking for existing elements
    // Track existing WhatsApp buttons
    document.querySelectorAll('a[href*="wa.me"]').forEach(function(link) {
        link.addEventListener('click', function() {
            const source = this.closest('section')?.id || 'unknown';
            if (typeof trackWhatsAppClick === 'function') {
                trackWhatsAppClick(source);
            }
        });
    });
    
    // Track form submissions
    document.querySelectorAll('form').forEach(function(form) {
        form.addEventListener('submit', function() {
            const formType = this.id || this.className || 'unknown';
            if (typeof trackFormSubmit === 'function') {
                trackFormSubmit(formType);
            }
        });
    });
});

// Global tracking functions
function trackFormSubmit(formType) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'form_type': formType,
            'page_location': window.location.href
        });
    }
}

function trackWhatsAppClick(source) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'source': source,
            'page_location': window.location.href
        });
    }
}

function trackPhoneCall() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call', {
            'page_location': window.location.href
        });
    }
}