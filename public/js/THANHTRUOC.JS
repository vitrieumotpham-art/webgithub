// PNT Timeline Carousel - plain JS
(() => {
  const data = [
    { title: '2015 – Thành lập', time: '2015', body: 'Công ty TNHH Kiến trúc & Xây dựng PNT được thành lập...' },
    { title: '2016 – Dự án đầu tiên', time: '2016', body: 'Hoàn thành dự án Biệt thự PNT Villa...' },
    { title: '2017–2019 – Mở rộng quy mô', time: '2017–2019', body: 'Mở rộng dịch vụ, mở chi nhánh TP.HCM...' },
    { title: '2020–2022 – Ứng dụng công nghệ', time: '2020–2022', body: 'Áp dụng BIM & 3D Visualization, đạt ISO 9001:2015...' },
    { title: '2023–2024 – Hợp tác quốc tế', time: '2023–2024', body: 'Hợp tác Nhật Bản, Singapore...' },
    { title: '2025 – Hướng tới bền vững', time: '2025', body: 'Tập trung kiến trúc xanh, vật liệu thân thiện...' }
  ];

  // DOM refs
  const slidesEl = document.getElementById('pnt-slides');
  const dotsEl = document.getElementById('pnt-dots');
  const prevBtn = document.getElementById('pnt-prev');
  const nextBtn = document.getElementById('pnt-next');
  const playBtn = document.getElementById('pnt-play');
  const viewport = document.getElementById('pnt-viewport');

  if (!slidesEl || !dotsEl) return; // safety

  // state
  let idx = 0;
  let autoplay = false;
  let timer = null;
  const DELAY = 4500;

  // helpers: create slide & dot
  function makeSlide(item) {
    const sec = document.createElement('section');
    sec.className = 'pnt-slide';
    sec.setAttribute('role', 'group');
    sec.setAttribute('aria-roledescription', 'slide');
    sec.setAttribute('aria-label', `${item.time} — ${item.title}`);
    sec.innerHTML = `<time class="pnt-time">${item.time}</time>
                     <h3 class="pnt-slide-title">${item.title}</h3>
                     <p class="pnt-slide-body">${item.body}</p>`;
    return sec;
  }
  function makeDot(i) {
    const btn = document.createElement('button');
    btn.className = 'pnt-dot';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Chuyển đến ${data[i].time}`);
    btn.addEventListener('click', () => goTo(i));
    return btn;
  }

  // render items
  data.forEach((d, i) => {
    slidesEl.appendChild(makeSlide(d));
    dotsEl.appendChild(makeDot(i));
  });
  const dots = Array.from(dotsEl.children);

  // update view
  function update() {
    slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function prev() { idx = (idx - 1 + data.length) % data.length; update(); }
  function next() { idx = (idx + 1) % data.length; update(); }
  function goTo(i) { idx = i % data.length; update(); }

  // autoplay
  function start() {
    if (timer) clearInterval(timer);
    autoplay = true;
    playBtn.textContent = '⏸ Dừng';
    playBtn.setAttribute('aria-pressed', 'true');
    timer = setInterval(next, DELAY);
  }
  function stop() {
    autoplay = false;
    playBtn.textContent = '▶ Tự động';
    playBtn.setAttribute('aria-pressed', 'false');
    if (timer) { clearInterval(timer); timer = null; }
  }
  function toggle() { autoplay ? stop() : start(); }

  // events
  prevBtn && prevBtn.addEventListener('click', () => { prev(); if (autoplay) restartTimer(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); if (autoplay) restartTimer(); });
  playBtn && playBtn.addEventListener('click', toggle);

  function restartTimer() {
    if (!autoplay) return;
    clearInterval(timer);
    timer = setInterval(next, DELAY);
  }

  // keyboard navigation (left/right) when focus inside component
  document.addEventListener('keydown', (e) => {
    const activeInside = document.activeElement && document.getElementById('pnt-timeline')?.contains(document.activeElement);
    if (!activeInside) return;
    if (e.key === 'ArrowLeft') { prev(); if (autoplay) restartTimer(); }
    if (e.key === 'ArrowRight') { next(); if (autoplay) restartTimer(); }
  });

  // touch/swipe (basic)
  (function addSwipe() {
    let startX = 0, dist = 0, threshold = 50;
    viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dist = 0; }, {passive:true});
    viewport.addEventListener('touchmove', (e) => { dist = e.touches[0].clientX - startX; }, {passive:true});
    viewport.addEventListener('touchend', () => {
      if (dist > threshold) prev();
      else if (dist < -threshold) next();
      if (autoplay) restartTimer();
    });
  })();

  // init
  update();
  // optional: start(); // uncomment to auto-start
})();
