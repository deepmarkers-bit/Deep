document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTS
  const header = document.getElementById('main-header');
  const cartBtnDesktop = document.getElementById('desktop-cart-btn');
  const cartBtnMobile = document.getElementById('mobile-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');

  // 0. PASSWORD GATE LOGIC
  const passwordGate = document.getElementById('password-gate');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');

  if (passwordGate && passwordForm) {
    if (sessionStorage.getItem('deep_site_unlocked') === 'true') {
      passwordGate.style.display = 'none';
    } else {
      passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = passwordInput.value.trim();
        if (val === '1234') {
          passwordError.classList.add('opacity-0');
          passwordGate.classList.add('opacity-0', 'pointer-events-none');
          sessionStorage.setItem('deep_site_unlocked', 'true');

          document.documentElement.classList.remove('site-locked');
          document.documentElement.classList.add('site-unlocked');

          setTimeout(() => {
            passwordGate.style.display = 'none';
          }, 500);
        } else {
          passwordError.classList.remove('opacity-0');
          passwordInput.value = '';
          passwordInput.focus();
        }
      });
    }
  }


  // PRODUCT & CART STATE
  const DEEP_PRODUCTS = {
    'beveled-65': {
      id: 'beveled-65',
      size: '6,5mm Tip',
      type: 'FINE BEVELED V1',
      name: '6,5mm beveled',
      price: 3.95,
      image: 'assets/images/6,5mm beveled.png',
      ref: 'REF: D-BV-6.5MM-ST',
      desc: 'Precise angled control for sharper lines.'
    },
    'square-10': {
      id: 'square-10',
      size: '10mm Tip',
      type: 'LITTLE SQUARE V1',
      name: '10mm square',
      price: 5.55,
      image: 'assets/images/10mm square.png',
      ref: 'REF: D-SQ-10MM-ST',
      desc: 'Balanced strokes with clean coverage.'
    },
    'squeezer-10': {
      id: 'squeezer-10',
      size: '10mm Tip',
      type: 'SQUEEZER V1',
      name: '10mm squeezer',
      price: 4.95,
      image: 'assets/images/10mm squeezer.png',
      ref: 'REF: D-SH-10MM-FL',
      desc: 'SMOOTH PRESSURE FLOW FOR DRIPPING STROKES.'
    },
    'square-15': {
      id: 'square-15',
      size: '15mm Tip',
      type: 'BIG SQUARE V1',
      name: '15mm square',
      price: 6.25,
      image: 'assets/images/15mm square.png',
      ref: 'REF: D-SQ-15MM-ST',
      desc: 'Broad coverage for heavier fills.'
    }
  };

  let cartItems = [];
  let currentProduct = DEEP_PRODUCTS['square-10'];

  // 1. SCROLL LISTENER (Header styles & Active Sections)
  const sections = ['home']; // Only this matters for scroll spying in main view

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // 2. MOBILE MENU TOGGLE
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('mobile-menu-open');
    if (isOpen) {
      mobileMenu.classList.remove('mobile-menu-open');
      mobileMenuBackdrop.classList.remove('backdrop-open');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    } else {
      mobileMenu.classList.add('mobile-menu-open');
      mobileMenuBackdrop.classList.add('backdrop-open');
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    }
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  mobileMenuBackdrop.addEventListener('click', toggleMobileMenu);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu();
    });
  });

  // 3. CART DRAWER TOGGLE
  function openCart() {
    cartDrawer.classList.add('cart-drawer-open');
    cartOverlay.classList.add('backdrop-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('cart-drawer-open');
    cartOverlay.classList.remove('backdrop-open');
    document.body.style.overflow = '';
  }

  if (cartBtnDesktop) cartBtnDesktop.addEventListener('click', openCart);
  if (cartBtnMobile) cartBtnMobile.addEventListener('click', openCart);
  
  const mobileMenuCartBtn = document.getElementById('mobile-menu-cart-btn');
  if (mobileMenuCartBtn) {
    mobileMenuCartBtn.addEventListener('click', () => {
      toggleMobileMenu();
      openCart();
    });
  }
  
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // 3.5 VIEW TRANSITION LOGIC
  const viewMain = document.getElementById('view-main');
  const viewProduct = document.getElementById('view-product');
  const viewDealers = document.getElementById('view-dealers');
  const viewHistory = document.getElementById('view-history');
  const backToMainBtns = document.querySelectorAll('.back-to-main-btn');

  function updateActiveNav(targetView) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('text-white', 'opacity-100');
      link.classList.add('text-white/40');

      const href = link.getAttribute('href').substring(1);

      if (targetView === 'home' && href === 'home') {
        link.classList.remove('text-white/40');
        link.classList.add('text-white', 'opacity-100');
      } else if (targetView === 'product' && (href === 'product-section' || href === 'specs')) {
        link.classList.remove('text-white/40');
        link.classList.add('text-white', 'opacity-100');
      } else if (targetView === 'dealers' && href === 'dealers') {
        link.classList.remove('text-white/40');
        link.classList.add('text-white', 'opacity-100');
      }
    });
  }

  function showProductView(productId) {
    // If a productId is provided, update currentProduct
    if (productId && DEEP_PRODUCTS[productId]) {
      currentProduct = DEEP_PRODUCTS[productId];
      updateProductUI(currentProduct);
    }

    viewMain.classList.add('hidden', 'opacity-0');
    viewMain.classList.remove('flex');
    if (viewDealers) { viewDealers.classList.add('hidden', 'opacity-0'); viewDealers.classList.remove('flex'); }
    if (viewHistory) { viewHistory.classList.add('hidden', 'opacity-0'); viewHistory.classList.remove('flex'); }

    viewProduct.classList.remove('hidden');
    viewProduct.classList.add('flex');
    setTimeout(() => viewProduct.classList.remove('opacity-0'), 50);

    window.scrollTo({ top: 0, behavior: 'instant' });
    updateActiveNav('product');
  }

  function showDealersView() {
    viewMain.classList.add('hidden', 'opacity-0');
    viewMain.classList.remove('flex');
    viewProduct.classList.add('hidden', 'opacity-0');
    viewProduct.classList.remove('flex');
    if (viewHistory) { viewHistory.classList.add('hidden', 'opacity-0'); viewHistory.classList.remove('flex'); }

    if (viewDealers) {
      viewDealers.classList.remove('hidden');
      viewDealers.classList.add('flex');
      setTimeout(() => viewDealers.classList.remove('opacity-0'), 50);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateActiveNav('dealers');
  }

  function showMainView() {
    viewProduct.classList.add('hidden', 'opacity-0');
    viewProduct.classList.remove('flex');
    if (viewDealers) { viewDealers.classList.add('hidden', 'opacity-0'); viewDealers.classList.remove('flex'); }
    if (viewHistory) { viewHistory.classList.add('hidden', 'opacity-0'); viewHistory.classList.remove('flex'); }

    viewMain.classList.remove('hidden');
    viewMain.classList.add('flex');
    setTimeout(() => viewMain.classList.remove('opacity-0'), 50);

    window.scrollTo({ top: 0, behavior: 'instant' });
    updateActiveNav('home');

    if (window.cursorTrail) {
      window.cursorTrail.clear();
    }
  }

  function showHistoryView() {
    viewMain.classList.add('hidden', 'opacity-0');
    viewMain.classList.remove('flex');
    viewProduct.classList.add('hidden', 'opacity-0');
    viewProduct.classList.remove('flex');
    if (viewDealers) { viewDealers.classList.add('hidden', 'opacity-0'); viewDealers.classList.remove('flex'); }

    if (viewHistory) {
      viewHistory.classList.remove('hidden');
      viewHistory.classList.add('flex');
      setTimeout(() => viewHistory.classList.remove('opacity-0'), 50);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateActiveNav('history');
  }

  if (backToMainBtns) {
    backToMainBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showMainView();
      });
    });
  }

  updateActiveNav('home');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.classList.contains('model-select-link')) return;

    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);

      if (targetId === 'home' || targetId === 'history') {
        if (targetId === 'history') {
          if (viewHistory && viewHistory.classList.contains('hidden')) {
            showHistoryView();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else if (targetId === 'home') {
          if (viewMain.classList.contains('hidden')) {
            showMainView();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.cursorTrail) window.cursorTrail.clear();
          }
        }
      }
      else if (targetId === 'dealers') {
        if (viewDealers && viewDealers.classList.contains('hidden')) {
          showDealersView();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      else if (['product-section', 'specs', 'lab'].includes(targetId)) {
        if (viewProduct.classList.contains('hidden')) {
          // Product link in header opens currentProduct
          showProductView();
          if (targetId === 'specs' || targetId === 'lab') {
            setTimeout(() => {
              const tgt = document.getElementById(targetId);
              if (tgt) {
                const y = tgt.getBoundingClientRect().top + window.scrollY - 60;
                window.scrollTo({ top: y, behavior: 'instant' });
              }
            }, 50);
          }
        } else {
          if (targetId === 'product-section') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const tgt = document.getElementById(targetId);
            if (tgt) {
              const y = tgt.getBoundingClientRect().top + window.scrollY - 60;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }
        }
      }
    });
  });

  // 4. PRODUCT UI UPDATE LOGIC
  const priceDisplay = document.getElementById('product-price');
  const selectedTipName = document.getElementById('selected-tip-name'); // Keeping ID for compatibility
  const mainProductImage = document.getElementById('main-product-image');
  const refLabel = document.getElementById('ref-label');
  const productTitle = document.getElementById('product-title'); // NEW ID in HTML

  function updateProductUI(data) {
    if (priceDisplay) priceDisplay.textContent = `${data.price.toFixed(2).replace('.', ',')} €`;

    // Split title handling
    const sizeEl = document.getElementById('product-size');
    const typeEl = document.getElementById('product-type');
    if (sizeEl) sizeEl.textContent = data.size;
    if (typeEl) typeEl.textContent = data.type;

    // Combine for specs label if ID exists
    if (selectedTipName) selectedTipName.textContent = data.desc;

    if (refLabel) refLabel.textContent = data.ref;

    if (mainProductImage) {
      mainProductImage.style.opacity = '0';
      setTimeout(() => {
        mainProductImage.src = encodeURI(data.image);
        mainProductImage.style.opacity = '1';
      }, 300);
    }
  }

  // Initialize UI with default state
  updateProductUI(currentProduct);

  // HERO PRODUCT CLICK LOGIC
  const modelSelectLinks = document.querySelectorAll('.model-select-link');

  modelSelectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModel = link.dataset.model;
      if (targetModel) {
        showProductView(targetModel);
      }
    });
  });

  // 5. ADD TO CART LOGIC
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const scanline = document.getElementById('scanline');

  addToCartBtn.addEventListener('click', () => {
    const btnText = addToCartBtn.querySelector('.btn-text');
    const btnIcon = addToCartBtn.querySelector('.btn-icon');

    // Loading Simulation
    addToCartBtn.disabled = true;
    btnText.textContent = 'ADDING...';
    btnText.classList.add('animate-pulse');
    btnIcon.classList.add('hidden');

    setTimeout(() => {
      // Revert Button
      addToCartBtn.disabled = false;
      btnText.textContent = 'ADD TO CART';
      btnText.classList.remove('animate-pulse');
      btnIcon.classList.remove('hidden');

      // Visual Effect (Scanline)
      scanline.classList.add('scanline-active');

      // Update Cart Data
      const existing = cartItems.find(item => item.id === currentProduct.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cartItems.push({ ...currentProduct, quantity: 1 });
      }

      renderCart();

      setTimeout(() => {
        scanline.classList.remove('scanline-active');
        openCart(); // Auto open cart after adding
      }, 500);

    }, 600);
  });

  // 6. CART RENDER LOGIC
  function renderCart() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const badgeDesktop = document.getElementById('cart-item-count');
    const badgeMobile = document.getElementById('mobile-cart-badge');
    const subtotalDisplay = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Update badges
    badgeDesktop.textContent = totalItems;
    if (totalItems > 0) {
      badgeMobile.textContent = totalItems;
      badgeMobile.classList.remove('hidden');
      emptyState.classList.add('hidden');
      checkoutBtn.disabled = false;
    } else {
      badgeMobile.classList.add('hidden');
      emptyState.classList.remove('hidden');
      checkoutBtn.disabled = true;
    }

    subtotalDisplay.textContent = `${totalPrice.toFixed(2).replace('.', ',')} €`;

    // Clear existing item DOM (except empty state)
    const existingItems = container.querySelectorAll('.cart-item');
    existingItems.forEach(el => el.remove());

    // Render items
    cartItems.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item flex items-center gap-3 bg-[#111111] border border-white/5 p-3 rounded-sm';
      itemEl.innerHTML = `
        <div class="w-12 h-12 bg-black flex-shrink-0 flex items-center justify-center border border-white/5 overflow-hidden">
          <img src="${encodeURI(item.image)}" class="w-full h-full object-contain opacity-70 p-1" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-display font-medium text-[11px] truncate text-white/90 uppercase tracking-tight">${item.name}</div>
          <div class="font-mono text-[9px] text-white/30 mt-1">${item.price.toFixed(2).replace('.', ',')} €</div>
        </div>
        <div class="flex items-center bg-[#1a1a1a] border border-white/10 rounded-sm">
          <button data-action="decrease" data-id="${item.id}" class="p-1.5 text-deep-text/50 hover:text-white transition-colors">
            <i data-lucide="minus" class="w-3.5 h-3.5"></i>
          </button>
          <div class="w-5 text-center font-mono text-[10px]">${item.quantity}</div>
          <button data-action="increase" data-id="${item.id}" class="p-1.5 text-deep-text/50 hover:text-white transition-colors">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
      container.appendChild(itemEl);
    });

    // Re-initialize any new lucide icons injected
    lucide.createIcons();
  }

  // Delegate cart quantity clicks
  document.getElementById('cart-items-container').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (id && action) {
      const itemIndex = cartItems.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        if (action === 'increase') {
          cartItems[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
          cartItems[itemIndex].quantity -= 1;
          if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
          }
        }
        renderCart();
      }
    }
  });

  // 7. EMAIL POPUP LOGIC
  const emailPopup = document.getElementById('email-popup');
  const closePopup = document.getElementById('close-popup');
  const emailForm = document.getElementById('email-form');
  const formView = document.getElementById('popup-form-view');
  const successView = document.getElementById('popup-success-view');

  if (!localStorage.getItem('emailPopupSubmitted')) {
    setTimeout(() => {
      emailPopup.classList.remove('opacity-0', 'pointer-events-none');
    }, 4000);
  }

  function hideEmailPopup() {
    emailPopup.classList.add('opacity-0', 'pointer-events-none');
  }

  closePopup.addEventListener('click', hideEmailPopup);

  emailPopup.addEventListener('click', (e) => {
    if (e.target === emailPopup) {
      hideEmailPopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !emailPopup.classList.contains('pointer-events-none')) {
      hideEmailPopup();
    }
  });

  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('emailPopupSubmitted', 'true');
    formView.classList.add('hidden');
    successView.classList.remove('hidden');

    setTimeout(() => {
      emailPopup.classList.add('opacity-0', 'pointer-events-none');
    }, 2000);
  });

  // 8. GOOGLE MAPS DEALER LOCATOR
  const mapElement = document.getElementById('map');
  const dealerSearchInput = document.getElementById('dealer-search-input');
  const dealerSearchBtn = document.getElementById('dealer-search-btn');
  const mapCoordinatesDisplay = document.getElementById('map-coordinates');

  // Future-ready structure for dealer objects
  const dealers = [
    // { name: '', address: '', postalCode: '', city: '', phone: '', website: '', lat: 0, lng: 0 }
  ];

  if (mapElement && typeof google !== 'undefined') {
    // Premium light-mode minimalist map styles fitting the lab aesthetic but cleaner
    const mapStyle = [
      { "elementType": "geometry", "stylers": [{ "color": "#f8f8f8" }] },
      { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f8f8f8" }] },
      { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#e0e0e0" }] },
      { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#d0d0d0" }] },
      { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
      { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
      { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
      { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
      { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
      { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
      { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#e0e0e0" }] },
      { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#dadada" }] },
      { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#d8d8d8" }] },
      { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] }
    ];

    // Default center to BCN coordinates
    const defaultCenter = { lat: 41.3851, lng: 2.1734 };

    const map = new google.maps.Map(mapElement, {
      center: defaultCenter,
      zoom: 14, // Slightly closer zoom for more detailed gallery feel
      styles: mapStyle,
      disableDefaultUI: true,
      zoomControl: false, // Cleaner UI, less generic
      scrollwheel: false,
      backgroundColor: '#f8f8f8',
      gestureHandling: 'cooperative'
    });

    const geocoder = new google.maps.Geocoder();

    const handleSearch = () => {
      const address = dealerSearchInput.value.trim();
      if (!address) return;

      dealerSearchBtn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');

      const searchIcon = dealerSearchBtn.querySelector('i');
      if (searchIcon) {
        searchIcon.classList.replace('lucide-search', 'lucide-loader');
        searchIcon.classList.add('animate-spin');
      }

      geocoder.geocode({ address: address }, (results, status) => {
        dealerSearchBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');

        if (searchIcon) {
          searchIcon.classList.replace('lucide-loader', 'lucide-search');
          searchIcon.classList.remove('animate-spin');
        }

        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;

          // Animate pan to new location
          map.panTo(location);
          map.setZoom(13);

          if (mapCoordinatesDisplay) {
            mapCoordinatesDisplay.textContent = `LAT: ${location.lat().toFixed(4)} / LNG: ${location.lng().toFixed(4)}`;
          }

          // Future dealer integration: Here we would loop through the `dealers` array
          // and match marker distances, then render pins.

        } else {
          // Failure handling
          dealerSearchInput.value = '';
          dealerSearchInput.placeholder = 'INVALID LOCATION';

          setTimeout(() => {
            dealerSearchInput.placeholder = 'ENTER POSTAL CODE';
          }, 2000);
        }
      });
    };

    if (dealerSearchBtn) dealerSearchBtn.addEventListener('click', handleSearch);
    if (dealerSearchInput) {
      dealerSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }
  }

});
