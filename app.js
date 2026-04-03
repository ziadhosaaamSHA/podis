document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href') || this.getAttribute('data-scroll');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Inject animation classes
  const elementsToAnimate = document.querySelectorAll(
    '.fade-up, \
    section > div > h2, \
    section > div > p, \
    .section-header, \
    .card, \
    .price-card, \
    .roi-form, \
    .waitlist-copy, \
    .lead-form, \
    details, \
    .step'
  );

  elementsToAnimate.forEach((el) => {
    el.classList.add('fade-up');
  });

  // Advanced Intersection Observer for high-end animation
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a slight stagger for items inside grids (like cards)
        const parentGrid = entry.target.closest('.cards, .pricing-grid, details');
        let delay = '0ms';
        
        if (parentGrid && !entry.target.matches('details')) {
          const siblings = Array.from(parentGrid.children);
          const index = siblings.indexOf(entry.target);
          delay = `${(index % 4) * 150}ms`;
        }
        
        entry.target.style.transitionDelay = delay;
        // Request animation frame ensures the delay is set before the class is added
        window.requestAnimationFrame(() => {
          entry.target.classList.add('animate-in');
          entry.target.classList.add('is-visible');
        });
        
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => observer.observe(el));

  // Scroll progress indicator + parallax depth layers
  const progressBar = document.querySelector('.scroll-progress');
  const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
  const nav = document.querySelector('.nav');

  let rafScheduled = false;
  const applyScrollEffects = () => {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const progress = Math.min((scrollTop / maxScroll) * 100, 100);

    if (progressBar) {
      progressBar.style.width = `${progress.toFixed(2)}%`;
    }

    if (nav) {
      nav.classList.toggle('nav-scrolled', scrollTop > 12);
    }

    if (!prefersReducedMotion) {
      parallaxElements.forEach((el) => {
        const speed = Number(el.getAttribute('data-parallax')) || 0;
        const y = Math.round(scrollTop * speed * -0.35);
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    }

    rafScheduled = false;
  };

  const onScroll = () => {
    if (!rafScheduled) {
      window.requestAnimationFrame(applyScrollEffects);
      rafScheduled = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  applyScrollEffects();

  // ROI Calculator Logic
  const membersInput = document.getElementById('members');
  const priceInput = document.getElementById('price');
  const conversionInput = document.getElementById('conversion');
  const roiValue = document.getElementById('roiValue');

  function calculateROI() {
    if (!membersInput || !priceInput || !conversionInput || !roiValue) return;

    const members = parseInt(membersInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const conversion = parseFloat(conversionInput.value) || 0;
    
    // Monthly recurring revenue (MRR)
    const mrr = members * (conversion / 100) * price;
    
    // Formatting currency
    roiValue.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(mrr);
  }

  [membersInput, priceInput, conversionInput].forEach(input => {
    if (input) input.addEventListener('input', calculateROI);
  });
  
  if (roiValue) calculateROI();

  // Basic form handling with simulated wait
  const leadForm = document.getElementById('leadForm');
  const submitBtn = leadForm ? leadForm.querySelector('button[type="submit"]') : null;

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Securing spot...';
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        submitBtn.textContent = 'Spot Secured ✓';
        submitBtn.style.backgroundColor = '#10b981'; // Green success state
        
        // Reset form after a few seconds
        setTimeout(() => {
          leadForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = ''; 
        }, 3000);
      }, 1200);
    });
  }

  // Pre-fill hidden UTM fields if present in URL
  const urlParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlParams.entries()) {
    const input = document.querySelector(`input[name="${key}"]`);
    if (input) {
      input.value = value;
    }
  }

  // Lead intent scoring built-in
  const emailInput = document.getElementById('email');
  const intentScoreInput = document.getElementById('intentScore');
  
  if (emailInput && intentScoreInput) {
    emailInput.addEventListener('blur', () => {
      let score = 50;
      const email = emailInput.value.toLowerCase();
      
      // Deduct points for free mail providers, add for professional domains
      if (email.match(/@gmail\.com|@yahoo\.com|@hotmail\.com|@outlook\.com/)) {
        score -= 20;
      } else if (email.includes('@')) {
        score += 30; // Business email bump
      }
      
      // Adjust hidden value to send to CRM
      intentScoreInput.value = score.toString();
    });
  }
});
