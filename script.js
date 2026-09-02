/* ==========================================================================
   CafeBey — script.js
   Not: Menü ve galeri içerikleri DEMO amaçlıdır. Gerçek ürün/fiyat/görsel
   bilgileri işletmeden alındığında aşağıdaki veri yapıları güncellenmelidir.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Konum / Google Maps bağlantısı                                      */
  /* ------------------------------------------------------------------ */
  var BUSINESS_NAME = "CafeBey";
  var BUSINESS_ADDRESS = "Bağcılar, Bağlar, Diyarbakır, 21090";
  var MAPS_QUERY = encodeURIComponent(BUSINESS_NAME + ", " + BUSINESS_ADDRESS);
  var MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + MAPS_QUERY;

  var heroDirections = document.getElementById("heroDirections");
  var contactDirections = document.getElementById("contactDirections");
  if (heroDirections) heroDirections.href = MAPS_URL;
  if (contactDirections) contactDirections.href = MAPS_URL;

  /* ------------------------------------------------------------------ */
  /* Navbar: scroll durumu + mobil menü                                  */
  /* ------------------------------------------------------------------ */
  var navbar = document.getElementById("navbar");
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  var mobileMenuClose = document.getElementById("mobileMenuClose");

  function updateNavbarState() {
    if (window.scrollY > 40) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });

  // Menü açıkken arka sayfanın scroll edilmesini engellemek için
  // (iOS/Android'de "overflow:hidden" tek başına yeterli olmadığından
  // sayfayı geçici olarak position:fixed yapıp scroll konumunu koruyoruz).
  var lockedScrollY = 0;

  function lockBodyScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = "-" + lockedScrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.classList.add("mobile-menu-open");
  }

  function unlockBodyScroll() {
    document.body.classList.remove("mobile-menu-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, lockedScrollY);
  }

  function isMobileMenuOpen() {
    return mobileMenu.classList.contains("is-open");
  }

  function openMobileMenu() {
    if (isMobileMenuOpen()) return;
    mobileMenu.classList.add("is-open");
    mobileMenuOverlay.classList.add("is-open");
    mobileMenuOverlay.hidden = false;
    hamburger.setAttribute("aria-expanded", "true");
    lockBodyScroll();
    // Odağı kapatma butonuna taşı (klavye/ekran okuyucu erişilebilirliği)
    if (mobileMenuClose) mobileMenuClose.focus();
  }

  function closeMobileMenu() {
    if (!isMobileMenuOpen()) return;
    mobileMenu.classList.remove("is-open");
    mobileMenuOverlay.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    unlockBodyScroll();
    hamburger.focus();
    // Overlay'i geçiş animasyonu bittikten sonra tamamen gizle
    window.setTimeout(function () {
      if (!isMobileMenuOpen()) mobileMenuOverlay.hidden = true;
    }, 400);
  }

  function toggleMobileMenu() {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", closeMobileMenu);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isMobileMenuOpen()) {
      closeMobileMenu();
    }
  });

  document.querySelectorAll(".mobile-menu__link, .mobile-menu__cta").forEach(function (link) {
    link.addEventListener("click", closeMobileMenu);
  });

  // Ekran 860px üzerine büyütülürse (ör. tablet yatay/masaüstü) menü açık
  // kalmışsa temiz bir şekilde kapatıp scroll kilidini kaldır.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860 && isMobileMenuOpen()) {
      closeMobileMenu();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Scroll reveal animasyonları (IntersectionObserver)                  */
  /* ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: IntersectionObserver desteklenmiyorsa doğrudan göster
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------------ */
  /* MENÜ VERİSİ (DEMO)                                                   */
  /* Gerçek ürünler/fiyatlar işletmeden alındığında bu diziyi güncelleyin.*/
  /* ------------------------------------------------------------------ */
  var PRICE_PLACEHOLDER = "Fiyat bilgisi işletmeden alınacaktır";

  var MENU_DATA = {
    "Sıcak Kahveler": [
      { name: "Espresso", desc: "Yoğun ve aromatik demleme." },
      { name: "Latte", desc: "Espresso ve buharda ısıtılmış süt." },
      { name: "Cappuccino", desc: "Dengeli süt köpüğü ile klasik lezzet." },
      { name: "Americano", desc: "Sadeleştirilmiş, hafif içim." }
    ],
    "Soğuk Kahveler": [
      { name: "Ice Latte", desc: "Buzla serinletilmiş kahve sütü." },
      { name: "Cold Brew", desc: "Soğuk demleme, yumuşak asidite." },
      { name: "Ice Americano", desc: "Ferahlatıcı klasik soğuk kahve." }
    ],
    "Tatlılar": [
      { name: "Cheesecake", desc: "Kremamsı kıvamda klasik tatlı." },
      { name: "Brownie", desc: "Yoğun çikolatalı dilim." },
      { name: "Tiramisu", desc: "Kahve aromalı katmanlı tatlı." }
    ],
    "İçecekler": [
      { name: "Taze Limonata", desc: "Ferahlatıcı ve doğal." },
      { name: "Bitki Çayı", desc: "Günün seçkisine göre değişir." },
      { name: "Sıcak Çikolata", desc: "Kadife dokulu, yoğun kakao." }
    ],
    "Kahvaltı": [
      { name: "Serpme Kahvaltı", desc: "Paylaşımlık, geniş tabak." },
      { name: "Omlet Tabağı", desc: "Günlük malzemelerle hazırlanır." },
      { name: "Tost Çeşitleri", desc: "Sıcak servis edilen seçenekler." }
    ]
  };

  var menuTabsEl = document.getElementById("menuTabs");
  var menuGridEl = document.getElementById("menuGrid");
  var categories = Object.keys(MENU_DATA);

  function renderMenuCategory(category) {
    menuGridEl.innerHTML = "";
    MENU_DATA[category].forEach(function (item, index) {
      var card = document.createElement("article");
      card.className = "menu-card reveal";

      var top = document.createElement("div");
      top.className = "menu-card__top";

      var name = document.createElement("h3");
      name.className = "menu-card__name";
      name.textContent = item.name;

      var price = document.createElement("span");
      price.className = "menu-card__price";
      price.textContent = PRICE_PLACEHOLDER;

      top.appendChild(name);
      top.appendChild(price);

      var desc = document.createElement("p");
      desc.className = "menu-card__desc";
      desc.textContent = item.desc;

      card.appendChild(top);
      card.appendChild(desc);
      menuGridEl.appendChild(card);

      // Yeni eklenen kartları da reveal gözlemcisine bağla
      if ("IntersectionObserver" in window) {
        requestAnimationFrame(function () {
          var obs = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  obs.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.1 }
          );
          obs.observe(card);
        });
      } else {
        card.classList.add("is-visible");
      }
    });
  }

  function renderMenuTabs() {
    menuTabsEl.innerHTML = "";
    categories.forEach(function (category, index) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "menu-tab" + (index === 0 ? " is-active" : "");
      tab.textContent = category;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", index === 0 ? "true" : "false");

      tab.addEventListener("click", function () {
        menuTabsEl.querySelectorAll(".menu-tab").forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        renderMenuCategory(category);
      });

      menuTabsEl.appendChild(tab);
    });
  }

  if (menuTabsEl && menuGridEl) {
    renderMenuTabs();
    renderMenuCategory(categories[0]);
  }

  /* ------------------------------------------------------------------ */
  /* GALERİ VERİSİ (DEMO IMAGE)                                           */
  /* Gerçek fotoğraflar teslim alındığında sadece "src" alanlarını        */
  /* /assets/images/ klasöründeki gerçek dosyalarla değiştirin.           */
  /* ------------------------------------------------------------------ */
  var GALLERY_DATA = [
    { seed: "cafebey-g1", alt: "Kahve hazırlama — demo görsel", size: "tall" },
    { seed: "cafebey-g2", alt: "Latte sanatı — demo görsel", size: "" },
    { seed: "cafebey-g3", alt: "Cafe atmosferi — demo görsel", size: "wide" },
    { seed: "cafebey-g4", alt: "Espresso fincanı — demo görsel", size: "" },
    { seed: "cafebey-g5", alt: "Tatlı tabağı — demo görsel", size: "" },
    { seed: "cafebey-g6", alt: "Masa düzeni — demo görsel", size: "tall" },
    { seed: "cafebey-g7", alt: "Kahve çekirdekleri — demo görsel", size: "" },
    { seed: "cafebey-g8", alt: "Cafe iç mekan — demo görsel", size: "wide" }
  ];

  var galleryGridEl = document.getElementById("galleryGrid");

  if (galleryGridEl) {
    GALLERY_DATA.forEach(function (item) {
      var figure = document.createElement("figure");
      figure.className = "gallery-item reveal" + (item.size ? " gallery-item--" + item.size : "");

      var img = document.createElement("img");
      img.loading = "lazy";
      img.alt = item.alt;
      // DEMO IMAGE — gerçek CafeBey fotoğrafı değildir.
      img.src = "https://picsum.photos/seed/" + item.seed + "/800/800";

      figure.appendChild(img);
      galleryGridEl.appendChild(figure);
    });

    if ("IntersectionObserver" in window) {
      var galleryObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              galleryObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      document.querySelectorAll(".gallery-item").forEach(function (el) {
        galleryObserver.observe(el);
      });
    } else {
      document.querySelectorAll(".gallery-item").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }
})();
