document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const form = document.querySelector('form');
    
    // Update your form's action attribute to point to a form handling service
    // For example, with Formspree: form.action = "https://formspree.io/f/your-form-id";
    
    form.addEventListener('submit', function(event) {
        const messageField = document.getElementById('message');
        
        if (!messageField.value.trim()) {
            event.preventDefault();
            alert('Please enter your feedback message');
            messageField.focus();
            return;
        }
        
        // Form will submit to the form handling service
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});
