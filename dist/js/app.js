 document.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementById('loading');
    if (!loading) return;

    // Fungsi sembunyikan loading
    const hideLoading = () => {
      if (!loading.classList.contains('hidden')) {
        loading.classList.add('hidden');
        
        // Inisialisasi AOS & Tilt setelah loading hilang
        if (typeof AOS !== 'undefined') {
          AOS.init({
            duration: 800,
            easing: 'ease-out-quad',
            once: true,
          });
        }
        
        if (typeof VanillaTilt !== 'undefined') {
          VanillaTilt.init(document.querySelectorAll('.floating-card'), {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
          });
        }
      }
    };

    // ✅ Strategi 1: Setelah DOM siap
    if (document.readyState === 'complete') {
      hideLoading();
    } else {
      window.addEventListener('load', hideLoading);
    }

    // ✅ Strategi 2: Timeout maksimal 2 detik
    setTimeout(hideLoading, 2000);

    // ✅ Strategi 3: Skip jika user interaksi
    ['click', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, hideLoading, { once: true });
    });

    // 🔁 Sisanya: Navbar, cursor, dll
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });

    mobileToggle?.addEventListener('click', () => {
      navMenu?.classList.toggle('show');
    });

    document.querySelectorAll('.nav-link, .btn').forEach(el => {
      el.addEventListener('click', () => {
        navMenu?.classList.remove('show');
      });
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        document.getElementById(`tab-${target}`)?.classList.add('active');
      });
    });

    // Marquee pause on hover
    document.querySelectorAll('.marquee').forEach(marquee => {
      marquee.addEventListener('mouseenter', () => {
        marquee.style.animationPlayState = 'paused';
      });
      marquee.addEventListener('mouseleave', () => {
        marquee.style.animationPlayState = 'running';
      });
    });

    // ✨ Cursor & ripple (hanya desktop)
    if (window.innerWidth > 768) {
      const cursor = document.createElement('div');
      cursor.className = 'cursor';
      const follower = document.createElement('div');
      follower.className = 'cursor-follower';
      document.body.appendChild(cursor);
      document.body.appendChild(follower);

      let x = 0, y = 0, fx = 0, fy = 0;
      const animate = () => {
        x += (window.clientX - x) / 5;
        y += (window.clientY - y) / 5;
        fx += (x - fx) / 10;
        fy += (y - fy) / 10;
        cursor.style.transform = `translate(${x}px, ${y}px)`;
        follower.style.transform = `translate(${fx}px, ${fy}px)`;
        requestAnimationFrame(animate);
      };

      document.addEventListener('mousemove', e => {
        window.clientX = e.clientX;
        window.clientY = e.clientY;
      });

      document.querySelectorAll('a, button, .nav-link, .solution-card, .pricing-card, .marquee-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
          follower.style.opacity = '0.1';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1)';
          follower.style.opacity = '0.5';
        });
      });

      animate();

      // Ripple effect
      document.addEventListener('click', e => {
        const btn = e.target.closest('.btn');
        if (!btn) return;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute; border-radius: 50%; background: rgba(255,255,255,0.3);
          transform: scale(0); animation: ripple 0.6s; pointer-events: none;
        `;
        
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size/2 + 'px';
        ripple.style.top = e.clientY - rect.top - size/2 + 'px';
        
        btn.style.position = 'relative';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });

      const style = document.createElement('style');
      style.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
      document.head.appendChild(style);
    }
  });