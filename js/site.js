/* ============================================================
   Infa's Fiesta 2026 — countdown with tearing sticky stacks,
   confetti + toasts.
   ============================================================ */
(function () {
  'use strict';

  // ---- Event: Thursday, 20 August 2026 @ 4:30 PM (local time) ----
  var TARGET = new Date(2026, 7, 20, 16, 30, 0, 0);
  var EVENT_DATE_LABEL = '20 Aug 2026';

  /* =========================================================
     COUNTDOWN — each unit is a stack of sticky notes. Every
     time the unit's value changes (seconds→every sec, minutes→
     every min, hours→every hour, days→every day) the front note
     is TORN off and another sticky behind it is revealed.
     ========================================================= */
  var board = document.getElementById('stickyBoard');
  var cells = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s')
  };

  var units = {};
  ['d', 'h', 'm', 's'].forEach(function (u) {
    var box = board.querySelector('.unit-stack[data-unit="' + u + '"]');
    units[u] = { box: box, tearing: false, order: [] };
    rebuildOrder(units[u]);
  });

  function rebuildOrder(unit) {
    unit.order = Array.prototype.slice.call(unit.box.querySelectorAll('.stack-layer'));
    unit.order.forEach(function (el, i) { el.className = 'stack-layer sl' + i; });
  }

  function tearUnit(unit) {
    if (unit.tearing) return;
    unit.tearing = true;
    var front = unit.order[0];

    // tear the front note off...
    front.className = 'stack-layer sl0 tearing';

    // ...and reveal a fresh sticky behind it
    setTimeout(function () {
      var fresh = document.createElement('div');
      fresh.className = 'stack-layer sl2';
      unit.box.appendChild(fresh);
      if (front.parentNode) front.parentNode.removeChild(front);
      rebuildOrder(unit);
      unit.tearing = false;
    }, 580);
  }

  var prev = { d: -1, h: -1, m: -1, s: -1 };
  var eventReached = false;

  function fmt(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var now = new Date();
    var diff = Math.max(0, TARGET.getTime() - now.getTime());

    var vals = {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000)
    };

    Object.keys(vals).forEach(function (u) {
      var v = vals[u];
      if (cells[u].textContent !== fmt(v)) {
        cells[u].textContent = fmt(v);
        tearUnit(units[u]);          // one sticky torn off this tick
        prev[u] = v;
      } else if (prev[u] === -1) {
        prev[u] = v;                 // first paint
      }
    });

    // The stickies are always visible — they show 0 and wrap back
    // up (seconds 0→59, minutes 0→59, hours 0→23, days 0→...) so the
    // stack stays full and tearing continues until the very end.

    if (diff <= 0 && !eventReached) {
      eventReached = true;
      fiestaMessage();
    }
  }

  function fiestaMessage() {
    var el = document.getElementById('fiestaTime');
    if (!el || el.getAttribute('data-fiesta') === '1') return;
    el.setAttribute('data-fiesta', '1');
    el.innerHTML =
      '<span class="marker pink" style="font-size:34px">&#127881; It\'s Fiesta Time! &#127881;</span>' +
      '<span class="hand" style="font-size:25px">The bells are ringing &mdash; see you at 4:30 PM!</span>';
    fireConfetti(320);
  }

  /* =========================================================
     BUTTONS — everything should do something
     ========================================================= */
  var $ = function (s) { return document.querySelector(s); };

  function saveTheDate() {
    fireConfetti(90);
    popToast('Daily reminder set \u2714 See you on ' + EVENT_DATE_LABEL + '!');
  }

  // Save the Date: hero button + top icons
  $('#saveBtn').addEventListener('click', saveTheDate);
  $('#toastBtn').addEventListener('click', saveTheDate);
  $('#userBtn').addEventListener('click', function () {
    popToast('You\u2019re our guest of honour too \u2764');
  });

  // Share the invite
  $('#shareBtn').addEventListener('click', function () {
    var data = {
      title: "Infa's Fiesta 2026 \u2014 Annual Day Invitation",
      text: "You're invited to Infa's Fiesta 2026! \u2728 Annual Day of Infant Jesus Matric Hr. Sec. School, Tiruppur \u2014 Thu, 20 Aug 2026 @ 4:30 PM.",
      url: location.href
    };
    if (navigator.share) { navigator.share(data).catch(function () {}); }
    else {
      window.open('https://wa.me/?text=' + encodeURIComponent(data.text + ' ' + data.url), '_blank');
    }
  });

  // Clicking a countdown stack rips off a sticky (fun on touch)
  board.addEventListener('click', function (e) {
    var box = e.target.closest('.unit-stack');
    if (box) {
      var u = box.getAttribute('data-unit');
      if (u) tearUnit(units[u]);
    }
  });

  // Speech bubble → confetti
  var bubble = document.querySelector('.speech-bubble');
  if (bubble) bubble.addEventListener('click', function () { fireConfetti(70); });

  /* =========================================================
     CONFETTI
     ========================================================= */
  var cv = document.getElementById('confetti');
  var ctx = cv.getContext('2d');
  var pieces = [];
  var animating = false;

  function fireConfetti(count) {
    cv.width = window.innerWidth * devicePixelRatio;
    cv.height = window.innerHeight * devicePixelRatio;
    cv.classList.add('active');
    var colors = ['#e9506a', '#3b6fd4', '#f2c94c', '#ffe066', '#ffb3c7', '#7a4bb0', '#b8e6a8', '#ffffff'];
    for (var i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * cv.width,
        y: -20 - Math.random() * cv.height * 0.4,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        vy: 3 + Math.random() * 5,
        vx: -2 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        color: colors[(Math.random() * colors.length) | 0]
      });
    }
    if (!animating) { animating = true; requestAnimationFrame(drawConfetti); }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pieces.forEach(function (p) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.y / 30) * 1.2;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter(function (p) { return p.y < cv.height + 40; });
    if (pieces.length) requestAnimationFrame(drawConfetti);
    else {
      animating = false;
      ctx.clearRect(0, 0, cv.width, cv.height);
      cv.classList.remove('active');
    }
  }

  /* =========================================================
     TOAST
     ========================================================= */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function popToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  // ---- start the clock ----
  tick();
  setInterval(tick, 1000);
})();