// Hamburger menu submenu toggle
document.addEventListener('DOMContentLoaded', function() {
  // ...existing code...
  // Submenu toggles
  document.querySelectorAll('.menu-toggle-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const sublist = btn.nextElementSibling;
      if (sublist && sublist.classList.contains('menu-sublist')) {
        const isOpen = sublist.style.display === 'block';
        // Close all sublists first
        document.querySelectorAll('.menu-sublist').forEach(function(list) {
          list.style.display = 'none';
        });
        // Toggle current
        sublist.style.display = isOpen ? 'none' : 'block';
      }
    });
  });
});
// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('toc');
  let menuOpen = false;
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function() {
      menuOpen = !menuOpen;
      if (menuOpen) {
        nav.style.transform = 'translateX(0)';
      } else {
        nav.style.transform = 'translateX(-100%)';
      }
    });
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        nav.style.transform = 'translateX(-100%)';
        menuOpen = false;
      });
    });
  }
});
// 目次クリックでカテゴリ発光ギミック
document.addEventListener('DOMContentLoaded', function() {
  const tocLinks = document.querySelectorAll('#toc a[href^="#"]');
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').replace('#', '');
      const section = document.getElementById(targetId);
      if (section) {
        section.classList.add('glow');
        setTimeout(() => section.classList.remove('glow'), 900);
      }
    });
  });
});
// --- Cyberpunk Sparks Animation ---
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('sparks');
  const title = document.getElementById('title');
  if (!canvas || !title) return;
  // h1の上にcanvasを重ねる
  const header = title.parentElement;
  header.style.position = 'relative';
  canvas.style.position = 'absolute';
  canvas.style.left = '50%';
  canvas.style.transform = 'translateX(-50%)';
  canvas.style.top = title.offsetTop + 'px';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 3;
  canvas.width = 420;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');

  // よりリアルな火花表現
  const MAX_SPARKS = 18;
  const sparks = [];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createSpark(side = 'center') {
    // side: 'left', 'right', 'center'
    let x, y, angle, speed;
    if (side === 'left') {
      // テキストに被らないようcanvas左端寄り
      x = randomBetween(10, 50);
      y = randomBetween(32, 44);
      angle = randomBetween(-Math.PI / 8, Math.PI / 4); // 右上方向
      speed = randomBetween(2.5, 4.5);
    } else if (side === 'right') {
      // テキストに被らないようcanvas右端寄り
      x = randomBetween(370, 410);
      y = randomBetween(32, 44);
      angle = randomBetween((3/4)*Math.PI, (9/8)*Math.PI); // 左上方向
      speed = randomBetween(2.5, 4.5);
    } else {
      x = randomBetween(140, 280);
      y = randomBetween(28, 38);
      angle = randomBetween(-Math.PI / 3, Math.PI / 3);
      speed = randomBetween(2.2, 4.2);
    }
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - randomBetween(1.2, 2.2),
      alpha: 1,
      life: randomBetween(0.7, 1.3),
      size: randomBetween(1.2, 2.7),
      color: `hsl(${randomBetween(20, 60)}, 100%, 60%)`,
      tail: [],
      tailLength: Math.floor(randomBetween(6, 12)),
    };
  }

  // スパーク発生タイミング管理
  let leftTimer = 0, rightTimer = 0, centerTimer = 0;
  let leftNext = Math.random() * 0.25 + 0.08;
  let rightNext = Math.random() * 0.25 + 0.08;
  let centerNext = Math.random() * 0.18 + 0.05;

  function updateSparks(dt) {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      // 軌跡を記録
      s.tail.push({ x: s.x, y: s.y, alpha: s.alpha });
      if (s.tail.length > s.tailLength) s.tail.shift();
      // 物理挙動
      s.x += s.vx * dt * 60;
      s.y += s.vy * dt * 60;
      s.vy += 0.13 * dt * 60; // gravity強め
      s.vx *= 0.98; // 空気抵抗
      s.vy *= 0.98;
      s.alpha -= 0.018 * dt * 60;
      s.life -= dt;
      // 色を徐々に白っぽく
      if (s.life < 0.4) s.color = 'rgba(255,230,200,0.8)';
      if (s.life < 0.2) s.color = 'rgba(255,255,255,0.5)';
      if (s.life <= 0 || s.alpha <= 0) {
        sparks.splice(i, 1);
      }
    }
    // タイミングをずらして発生
    if (sparks.length < MAX_SPARKS) {
      leftTimer += dt;
      rightTimer += dt;
      centerTimer += dt;
      if (leftTimer > leftNext) {
        sparks.push(createSpark('left'));
        leftTimer = 0;
        leftNext = Math.random() * 0.25 + 0.08;
      }
      if (rightTimer > rightNext) {
        sparks.push(createSpark('right'));
        rightTimer = 0;
        rightNext = Math.random() * 0.25 + 0.08;
      }
      if (centerTimer > centerNext) {
        sparks.push(createSpark('center'));
        centerTimer = 0;
        centerNext = Math.random() * 0.18 + 0.05;
      }
    }
  }

  function drawSparks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of sparks) {
      // 軌跡
      for (let i = 0; i < s.tail.length - 1; i++) {
        const t1 = s.tail[i];
        const t2 = s.tail[i + 1];
        ctx.save();
        ctx.globalAlpha = t1.alpha * 0.5;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = Math.max(1, s.size * (i / s.tail.length));
        ctx.beginPath();
        ctx.moveTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.stroke();
        ctx.restore();
      }
      // 本体
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
    }
  }

  let last = performance.now();
  function animateSparks(now) {
    const dt = Math.min((now - last) / 1000, 0.033);
    updateSparks(dt);
    drawSparks();
    last = now;
    requestAnimationFrame(animateSparks);
  }
  animateSparks(performance.now());
});
document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".toggle-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      // 親要素内の子要素をループし、最初の.toggle-contentを取得
      const parent = header.parentElement;
      let content = null;
      for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].classList.contains("toggle-content")) {
          content = parent.children[i];
          break;
        }
      }
      if (content) {
        // 空の.toggle-contentならshakeアニメーション
        const isEmpty = !content.querySelector('*') && content.innerText.trim() === '';
        if (isEmpty) {
          content.classList.remove('shake');
          // 再トリガー用
          void content.offsetWidth;
          content.classList.add('shake');
        } else {
          content.classList.toggle("active");
        }
      }
      parent.classList.toggle("active");
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
  // トグル開閉 & 揺れアニメーション
  document.querySelectorAll('.toggle-header').forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      if (content && content.classList.contains('toggle-content')) {
        content.classList.toggle('open');
        // 空かどうかに関わらず揺れる
        content.classList.add('shake');
        setTimeout(() => content.classList.remove('shake'), 500);
      }
    });
  });
  // ...既存のスパークアニメーション等...
});
