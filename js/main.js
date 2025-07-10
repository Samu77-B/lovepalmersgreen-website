// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to a server
            // For now, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Business Directory Search
    const searchInput = document.getElementById('searchBusiness');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const businessCards = document.querySelectorAll('.business-card');
            
            businessCards.forEach(card => {
                const businessName = card.querySelector('.card-title').textContent.toLowerCase();
                const businessType = card.querySelector('.card-text').textContent.toLowerCase();
                
                if (businessName.includes(searchTerm) || businessType.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Category Filter Buttons
    const categoryButtons = document.querySelectorAll('.btn-group .btn');
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.textContent.toLowerCase();
                const businessCards = document.querySelectorAll('.business-card');
                
                businessCards.forEach(card => {
                    const businessType = card.querySelector('.card-text').textContent.toLowerCase();
                    
                    if (category === 'all' || businessType.includes(category)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Update active button state
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
