(() => {

  // ── TIME
  const timeEl = document.getElementById('navTime');
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    if (timeEl) timeEl.textContent = `${h}:${m}`;
  }
  updateTime();
  setInterval(updateTime, 10000);

  // ── PROJECTS
  const projects = [
    'TYPEFACE UNKNOWN',
    'MOTION DRAFT',
    'SYSTEM OVERRIDE',
    'RENDER LOOP',
    'GRID BREAK',
    'SIGNAL LOST',
    'FORM STUDY',
    'NOISE PATTERN',
    'DEPTH FIELD',
    'STATIC BLOOM'
  ];

  const TOTAL = projects.length;
  const COPIES = 5;
  const namesEl = document.getElementById('pgNames');
  const slots = Array.from(document.querySelectorAll('.pg-img-slot'));
  const allItems = [];

  // ── BUILD COPIES
  for (let c = 0; c < COPIES; c++) {
    for (let i = 0; i < TOTAL; i++) {
      const div = document.createElement('div');
      div.className = 'pg-item';
      div.textContent = projects[i];
      div.dataset.realIndex = i;
      namesEl.appendChild(div);
      allItems.push(div);
    }
  }

  // ── STATE
  let iH = 0;
  let currentY = 0;
  let targetY = 0;
  let activeRealIndex = -1;
  const NAV_H = 64;

  function measureItem() {
    iH = allItems[0].offsetHeight;
  }

  function getInitialY() {
    const viewH = window.innerHeight - NAV_H;
    const centerOffset = viewH / 2 - iH / 2;
    // Start centered on first item of middle copy (copy index 2)
    return -(TOTAL * iH * 2) + centerOffset + NAV_H;
  }

  function init() {
    measureItem();
    currentY = getInitialY();
    targetY = currentY;
  }

  // ── ACTIVE
  function setActive(realIndex) {
    if (realIndex === activeRealIndex) return;
    activeRealIndex = realIndex;
    allItems.forEach(item => {
      item.classList.toggle('active', Number(item.dataset.realIndex) === realIndex);
    });
    slots.forEach((slot, i) => {
      slot.classList.toggle('active', i === realIndex);
    });
  }

  // ── WHEEL
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetY -= e.deltaY * 0.7;
  }, { passive: false });

  // ── LOOP
  function loop() {
    currentY += (targetY - currentY) * 0.08;

    const oneCopy = TOTAL * iH;

    // Jump when we drift too far — always keep middle 3 copies in range
    if (currentY > -(oneCopy * 1)) {
      currentY -= oneCopy;
      targetY -= oneCopy;
    }
    if (currentY < -(oneCopy * 3)) {
      currentY += oneCopy;
      targetY += oneCopy;
    }

    namesEl.style.transform = `translateY(${currentY}px)`;

    // ── DETECT ACTIVE
    const screenCenter = NAV_H + (window.innerHeight - NAV_H) / 2;
    let closest = null;
    let closestDist = Infinity;

    allItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const dist = Math.abs(itemCenter - screenCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = item;
      }
    });

    if (closest) {
      setActive(Number(closest.dataset.realIndex));
    }

    requestAnimationFrame(loop);
  }

  // ── INIT
  window.addEventListener('load', () => {
    init();
    loop();
  });

  window.addEventListener('resize', () => {
    measureItem();
  });

})();
