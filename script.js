const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.process-card, .card, .thesis-text, .thesis-image');
animatedElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
});

const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
        const icon = question.querySelector('i');
        if (item.classList.contains('active')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
});

const actionButtons = document.querySelectorAll('.action-btn');
const saveButton = document.getElementById('save-btn');
const measureInputs = document.querySelectorAll('.measure-input');
const sendMsgButton = document.getElementById('send-msg-btn');
const contactInputs = document.querySelectorAll('.contact-input');

const toast = document.getElementById('toast-notification');
let toastTimeout;

function showNotification(title, message, isError = false) {
    if (!toast) return;

    if (toast.classList.contains('active')) {
        toast.classList.remove('active');
        clearTimeout(toastTimeout);
        setTimeout(() => {
            triggerPopup(title, message, isError);
        }, 300);
    } else {
        triggerPopup(title, message, isError);
    }
}

function triggerPopup(title, message, isError) {
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const icon = toast.querySelector('i');
    const progress = toast.querySelector('.progress-line');

    toastTitle.innerText = title;
    toastMessage.innerText = message;

    if (isError) {
        toast.style.borderLeftColor = "#e74c3c";
        icon.style.color = "#e74c3c";
        icon.className = "fa-solid fa-circle-exclamation";
        progress.style.backgroundColor = "#e74c3c";
    } else {
        toast.style.borderLeftColor = "#2b6777";
        icon.style.color = "#2b6777";
        icon.className = "fa-solid fa-circle-info";
        progress.style.backgroundColor = "#2b6777";
    }

    toast.classList.add('active');
    toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
    }, 5000);
}

if (saveButton) {
    saveButton.addEventListener('click', function (e) {
        e.preventDefault();
        let allValid = true;
        measureInputs.forEach(input => {
            if (input.value.trim() === "") {
                allValid = false;
                input.classList.add('error');
                const errorMsg = input.parentElement.querySelector('.error-text');
                if (errorMsg) errorMsg.style.display = 'block';
            }
        });
        if (allValid) {
            showNotification("Measurements Saved", "Your profile has been updated successfully.");
        } else {
            showNotification("Missing Information", "Please fill in all the required measurement fields.", true);
        }
    });

    measureInputs.forEach(input => {
        input.addEventListener('input', function () {
            if (this.value.trim() !== "") {
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-text');
                if (errorMsg) errorMsg.style.display = 'none';
            }
        });
    });
}

if (sendMsgButton) {
    sendMsgButton.addEventListener('click', function (e) {
        e.preventDefault();
        let allValid = true;
        contactInputs.forEach(input => {
            if (input.value.trim() === "") {
                allValid = false;
                input.classList.add('error');
                const errorMsg = input.parentElement.querySelector('.error-text');
                if (errorMsg) errorMsg.style.display = 'block';
            }
        });
        if (allValid) {
            showNotification("Message Sent", "Our support team will contact you shortly.");
            contactInputs.forEach(input => input.value = "");
        } else {
            showNotification("Error", "Please fill in all required fields.", true);
        }
    });

    contactInputs.forEach(input => {
        input.addEventListener('input', function () {
            if (this.value.trim() !== "") {
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-text');
                if (errorMsg) errorMsg.style.display = 'none';
            }
        });
    });
}

actionButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const buttonText = this.innerText.toLowerCase();
        let titleText = "Feature Locked";
        let msgText = "This feature will be unlocked soon.";

        if (buttonText.includes("book")) {
            titleText = "Booking Request";
            msgText = "Booking functionality is currently in beta. Please call us to confirm.";
        } else if (buttonText.includes("select")) {
            titleText = "Fabric Selected";
            msgText = "Excellent choice! This fabric has been added to your draft.";
        }
        showNotification(titleText, msgText);
    });
});