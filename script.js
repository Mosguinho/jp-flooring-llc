document.addEventListener('DOMContentLoaded', () => {
  // Sticky header
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Mobile drawer
  const drawer = document.getElementById('mobileDrawer');
  const openDrawer = () => drawer.classList.add('open');
  const closeDrawer = () => drawer.classList.remove('open');
  document.getElementById('menuToggle').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // Hero slider
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  let curSlide = 0;

  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (idx === 0 ? ' active' : '');
    dot.ariaLabel = `Slide ${idx + 1}`;
    dot.addEventListener('click', () => goSlide(idx));
    dotsWrap.appendChild(dot);
  });

  const goSlide = (n) => {
    slides[curSlide].classList.remove('active');
    dotsWrap.children[curSlide].classList.remove('active');
    curSlide = (n + slides.length) % slides.length;
    slides[curSlide].classList.add('active');
    dotsWrap.children[curSlide].classList.add('active');
  };

  document.getElementById('heroPrevBtn').addEventListener('click', () => goSlide(curSlide - 1));
  document.getElementById('heroNextBtn').addEventListener('click', () => goSlide(curSlide + 1));
  setInterval(() => goSlide(curSlide + 1), 6000);

  // Before & After comparison slider
  const baRange = document.getElementById('baRange');
  const baBeforeWrap = document.getElementById('baBeforeWrap');
  const baHandle = document.getElementById('baHandle');
  const baSlider = document.getElementById('baSlider');
  const baBeforeImg = baBeforeWrap.querySelector('img');

  const syncBaWidth = () => {
    baBeforeImg.style.width = `${baSlider.offsetWidth}px`;
  };
  syncBaWidth();
  window.addEventListener('resize', syncBaWidth);

  baRange.addEventListener('input', (e) => {
    const val = e.target.value;
    baBeforeWrap.style.width = `${val}%`;
    baHandle.style.left = `${val}%`;
  });

  // Cost Estimator
  const rates = {
    tile: [14, 24],
    hardwood: [11, 18],
    vinyl: [6, 11],
    remodel: [28, 45]
  };
  let selectedService = 'tile';
  const sqftRange = document.getElementById('sqftRange');
  const sqftValue = document.getElementById('sqftValue');
  const tierSelect = document.getElementById('tierSelect');
  const estPrice = document.getElementById('estPrice');

  const updateEstimate = () => {
    const sqft = Number(sqftRange.value);
    const mult = Number(tierSelect.value);
    const [low, high] = rates[selectedService];
    const min = Math.round((sqft * low * mult) / 50) * 50;
    const max = Math.round((sqft * high * mult) / 50) * 50;
    sqftValue.textContent = `${sqft.toLocaleString()} sq ft`;
    estPrice.textContent = `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  };

  document.querySelectorAll('.est-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.est-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedService = btn.dataset.service;
      updateEstimate();
    });
  });
  sqftRange.addEventListener('input', updateEstimate);
  tierSelect.addEventListener('change', updateEstimate);
  updateEstimate();

  // Gallery filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.cat !== filter);
      });
    });
  });

  // Lightbox for gallery & evolution cards
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.gallery-item img, .evolution-card img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('modal-close')) {
      lightbox.classList.remove('open');
    }
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
    });
  });

  // Consultation Modal
  const consultModal = document.getElementById('consultationModal');
  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      consultModal.classList.add('open');
    });
  });
  consultModal.addEventListener('click', (e) => {
    if (e.target === consultModal || e.target.classList.contains('modal-close')) {
      consultModal.classList.remove('open');
    }
  });

  // Forms + Toast
  const toast = document.getElementById('toast');
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  };

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      consultModal.classList.remove('open');
      showToast('Thank you! Your free estimate request was received. We will call you shortly.');
    });
  });
});
