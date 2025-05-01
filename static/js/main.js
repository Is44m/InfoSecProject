// Main JavaScript for the PQC Demo Application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize copy buttons
    initializeCopyButtons();
    
    // Add any global UI functionality here
    initializeUIEffects();
});

/**
 * Initialize copy button functionality
 */
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Get the text content
                const textToCopy = targetElement.textContent || targetElement.innerText;
                
                // Create a temporary textarea element to copy from
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                
                // Select the text and copy it
                textarea.select();
                document.execCommand('copy');
                
                // Remove the temporary element
                document.body.removeChild(textarea);
                
                // Change button text temporarily
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.classList.add('copied');
                
                // Reset button text after a short delay
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            }
        });
    });
}

/**
 * Initialize UI effects and animations
 */
function initializeUIEffects() {
    // Add subtle hover animations for interactive elements
    const interactiveElements = document.querySelectorAll('.crypto-card, button, input, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
    
    // Handle scroll animations if needed
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const header = document.querySelector('header');
        
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Display a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // Create notification container if it doesn't exist
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create the notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        notificationContainer.removeChild(notification);
    });
    
    notification.appendChild(closeButton);
    notificationContainer.appendChild(notification);
    
    // Automatically remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notificationContainer.removeChild(notification);
        }
    }, 5000);
}