//  nav menu
console.log('main.js loaded');

// Expose debug helper to window for quick checks
// window.__campgramDebug = window.__campgramDebug || {};
// window.__campgramDebug.mainLoaded = true;

const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

//=============== hide mobile menu on link click=========
const navLink = document.querySelectorAll('.nav_link')

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu')
    // hide menu when click on nav link
    if (navMenu) navMenu.classList.remove('show-menu')
};
navLink.forEach(n => n.addEventListener('click', linkAction))

/*========== blur header on scroll ==========*/
const blurHeader = () => {
    const header = document.getElementById('header')
    if (!header) return;

    this.scrollY >= 50 ? header.classList.add('blur-header') : header.classList.remove('blur-header')
}
window.addEventListener('scroll', blurHeader)

/* Show Scroll Up */
const scrollUp = () => {
    const scrollUpEl = document.getElementById('scroll-up')
    if (!scrollUpEl) return;
    this.scrollY >= 350 ? scrollUpEl.classList.add('show-scroll')
        : scrollUpEl.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id')

        // find matching nav link safely (attribute selector uses quotes)
        let sectionsClass = null
        try {
            if (sectionId) {
                sectionsClass = document.querySelector('.nav_menu a[href*="' + sectionId + '"]')
            }
        } catch (e) {
            sectionsClass = null
        }

        if (sectionsClass) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link')
            } else {
                sectionsClass.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

// ===========email sent & validation=============
function sendEmail(event) {
    console.log('sendEmail invoked', { eventType: event && event.type });
    window.__campgramDebug = window.__campgramDebug || {};
    window.__campgramDebug.sendEmailCalled = true;
    if (event && typeof event.preventDefault === 'function') event.preventDefault();

    // Elements
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const numberEl = document.getElementById("number");
    const messageEl = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const numberError = document.getElementById("numberError");
    const messageError = document.getElementById("messageError");

    // helpers for UI
    function setError(inputEl, errorEl, msg) {
        if (errorEl) errorEl.textContent = msg || "";
        if (inputEl) {
            inputEl.classList.add('input-error');
            inputEl.setAttribute('aria-invalid', 'true');
            if (errorEl && errorEl.id) inputEl.setAttribute('aria-describedby', errorEl.id);
        }
    }

    function clearError(inputEl, errorEl) {
        if (errorEl) errorEl.textContent = '';
        if (inputEl) {
            inputEl.classList.remove('input-error');
            inputEl.removeAttribute('aria-invalid');
            inputEl.removeAttribute('aria-describedby');
        }
    }

    // Clear previous errors
    clearError(nameEl, nameError);
    clearError(emailEl, emailError);
    clearError(numberEl, numberError);
    clearError(messageEl, messageError);

    // Values
    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const number = numberEl ? numberEl.value.trim() : "";
    const message = messageEl ? messageEl.value.trim() : "";

    // validation
    let isValid = true;
    let firstInvalid = null;

    if (!name) {
        setError(nameEl, nameError, 'Please enter your name');
        isValid = false;
        firstInvalid = firstInvalid || nameEl;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        setError(emailEl, emailError, 'Please enter your email');
        isValid = false;
        firstInvalid = firstInvalid || emailEl;
    } else if (!emailPattern.test(email)) {
        setError(emailEl, emailError, 'Invalid email address');
        isValid = false;
        firstInvalid = firstInvalid || emailEl;
    }

    const phonePattern = /^\+?\d{7,15}$/;
    if (!number) {
        setError(numberEl, numberError, 'Please enter your phone number');
        isValid = false;
        firstInvalid = firstInvalid || numberEl;
    } else if (!phonePattern.test(number)) {
        setError(numberEl, numberError, 'Enter a valid phone number (7-15 digits)');
        isValid = false;
        firstInvalid = firstInvalid || numberEl;
    }

    if (!message) {
        setError(messageEl, messageError, 'Please enter a message');
        isValid = false;
        firstInvalid = firstInvalid || messageEl;
    }

    if (!isValid) {
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return; // stop and show errors
    }

    const data = { name, email, number, message };

    emailjs.send("service_wdsij6e", "template_2f5pgnd", data)
        .then(function (res) {
            alert("Message sent — thank you!");
            const form = document.getElementById('contact-form');
            if (form) form.reset();
        }, function (error) {
            console.error('EmailJS error:', error);
            alert("Failed to send message. Please try again later.");
        });
}

// Clear input errors on typing
function attachInputClearListeners() {
    ['name','email','number','message'].forEach(id => {
        const el = document.getElementById(id);
        const err = document.getElementById(id + 'Error');
        if (el) {
            el.addEventListener('input', () => {
                if (err) err.textContent = '';
                el.classList.remove('input-error');
                el.removeAttribute('aria-invalid');
                el.removeAttribute('aria-describedby');
            });
        }
    });
}

// Fallback: if the form exists, attach a JS listener in case inline onsubmit isn't firing
document.addEventListener('DOMContentLoaded', function () {
    try {
        const form = document.getElementById('contact-form');
        if (form) {
            // avoid double-binding
            if (!form.__sendListenerAttached) {
                form.addEventListener('submit', sendEmail);
                form.__sendListenerAttached = true;
                console.log('Attached submit listener to #contact-form');
            }
        } else {
            console.log('#contact-form not found on DOMContentLoaded');
        }
    } catch (e) {
        console.error('Error attaching form listener', e);
    }

    attachInputClearListeners();
});