document.addEventListener('DOMContentLoaded', () => {

  // 1. Sticky Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  mobileToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  // 3. Scroll Progress Bar
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });

  // 4. Custom Cursor (Desktop Only)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    document.body.classList.add('has-custom-cursor');
    const cursor = document.getElementById('custom-cursor');
    cursor.style.display = 'block';

    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Expand cursor on links and buttons
    document.querySelectorAll('a, button, .magnetic, input, textarea, .ba-slider').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }

  // 5. Typed.js Setup
  if (typeof Typed !== 'undefined') {
    new Typed('.typed-text', {
      strings: ['service pages', 'WhatsApp enquiry buttons', 'booking forms', 'launch support'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true
    });
  }

  // 6. Magnetic Buttons
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const position = btn.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // 7. Parallax Scrolling
  const parallaxElements = document.querySelectorAll('.parallax');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed');
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });

  // 8. Intersection Observer (Reveal Animations & Counters)
  const revealElements = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('.counter');
  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger counters if it's a counter container
        if(entry.target.classList.contains('counters-grid')) {
          counters.forEach(counter => {
            const updateCount = () => {
              const target = +counter.getAttribute('data-target');
              const count = +counter.innerText;
              const inc = target / 50; // speed
              if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 30);
              } else {
                counter.innerText = target;
              }
            };
            updateCount();
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // 9. Interactive Before/After Slider
  const slider = document.getElementById('ba-slider-handle');
  const beforeImg = document.getElementById('ba-before');
  const baContainer = document.querySelector('.ba-slider-container');
  
  if(slider && baContainer) {
    let isDragging = false;
    const dragStart = () => isDragging = true;
    const dragEnd = () => isDragging = false;
    const drag = (e) => {
      if (!isDragging) return;
      let x = e.pageX - baContainer.getBoundingClientRect().left - window.scrollX;
      let width = baContainer.offsetWidth;
      // boundary constraints
      if(x < 0) x = 0;
      if(x > width) x = width;
      let percent = (x / width) * 100;
      beforeImg.style.width = percent + '%';
      slider.style.left = percent + '%';
    };

    slider.addEventListener('mousedown', dragStart);
    slider.addEventListener('touchstart', dragStart);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', (e) => {
      drag({ pageX: e.touches[0].pageX });
    });
  }

  // 10. Floating Chatbot Toggle & Interactions
  const chatTrigger = document.getElementById('chatbot-trigger');
  const chatContainer = document.getElementById('chatbot-container');
  const closeChat = document.getElementById('close-chatbot');
  
  chatTrigger.addEventListener('click', () => chatContainer.classList.add('open'));
  closeChat.addEventListener('click', () => chatContainer.classList.remove('open'));

  const chatOptions = document.querySelectorAll('.chat-opt-btn');
  const chatBody = document.getElementById('chatbot-body');
  const chatFooter = document.getElementById('chatbot-footer');
  const chatOptionsContainer = document.getElementById('chat-options');

  chatOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userText = e.target.getAttribute('data-reply');
      
      // Hide options
      chatOptionsContainer.style.display = 'none';
      
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-message sent';
      userMsg.innerText = userText;
      chatBody.appendChild(userMsg);

      // Simulate typing delay
      setTimeout(() => {
        const botReply = document.createElement('div');
        botReply.className = 'chat-message received';
        if (userText === "Just looking around") {
          botReply.innerText = "No problem! Take your time exploring our portfolio. If you have any questions later, we're just a click away.";
        } else {
          botReply.innerText = "Awesome! We'd love to help you with that. Let's hop on a quick WhatsApp chat to discuss your goals.";
          chatFooter.style.display = 'block'; // Show WhatsApp button
        }
        chatBody.appendChild(botReply);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 600);
    });
  });

  // 11. Form Real-time Validation & Confetti
  const contactForm = document.getElementById('main-contact-form');
  contactForm.addEventListener('submit', (e) => {
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('.required-field');
    
    requiredFields.forEach(field => {
      field.classList.remove('shake');
      if(field.value.trim() === '') {
        isValid = false;
        // Trigger reflow to restart animation
        void field.offsetWidth;
        field.classList.add('shake');
      }
    });

    if (!isValid) {
      e.preventDefault(); // Stop submission if invalid
    } else {
      e.preventDefault(); // Prevent instant redirect
      // Form is valid. Trigger confetti
      if(typeof confetti !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Wait 2.5 seconds for confetti, then submit programmatically
      setTimeout(() => {
        contactForm.submit();
      }, 2500);
    }
  });

});
