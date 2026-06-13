window.addEventListener('DOMContentLoaded', function () {

  /* ── Particles ── */
  const particlesEl = document.getElementById('particles');
  if (particlesEl) {
    for (let i = 0; i < 40; i++) {
      const pt = document.createElement('div');
      pt.className = 'particle';
      pt.style.left = Math.random() * 100 + '%';
      pt.style.top = Math.random() * 100 + '%';
      pt.style.setProperty('--delay', Math.random() * 10 + 's');
      pt.style.setProperty('--dur', (Math.random() * 8 + 8) + 's');
      pt.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      particlesEl.appendChild(pt);
    }
  }

  /* ═══════════════════════════════════
     SNAKE
  ═══════════════════════════════════ */
  const sc = document.getElementById('snakeCanvas');
  if (sc) {
    const sctx = sc.getContext('2d');
    sc.width = sc.clientWidth || 520; sc.height = 300;
    let snake, sdir, food, sScore, sGame, sPause;

    function initSnake() {
      snake = [{ x: 150, y: 150 }];
      sdir = { x: 10, y: 0 };
      food = { x: 300, y: 150 };
      sScore = 0; sPause = false;
      document.getElementById('snakeScore').textContent = sScore;
    }
    initSnake();

    function startSnake() {
      if (sGame) return;
      initSnake(); genFood();
      sGame = setInterval(upSnake, 100);
    }
    function pauseSnake() { if (sGame) sPause = !sPause; }
    function resetSnake() {
      clearInterval(sGame); sGame = null;
      initSnake(); drSnake();
    }

    function upSnake() {
      if (sPause) return;
      const h = { x: snake[0].x + sdir.x, y: snake[0].y + sdir.y };
      if (h.x < 0 || h.x >= sc.width || h.y < 0 || h.y >= sc.height) {
        clearInterval(sGame); sGame = null;
        alert('Game Over! Score: ' + sScore); return;
      }
      for (let s of snake) {
        if (h.x === s.x && h.y === s.y) {
          clearInterval(sGame); sGame = null;
          alert('Game Over! Score: ' + sScore); return;
        }
      }
      snake.unshift(h);
      if (h.x === food.x && h.y === food.y) {
        sScore++;
        document.getElementById('snakeScore').textContent = sScore;
        genFood();
      } else snake.pop();
      drSnake();
    }
    function genFood() {
      food.x = Math.floor(Math.random() * (sc.width / 10)) * 10;
      food.y = Math.floor(Math.random() * (sc.height / 10)) * 10;
    }
    function drSnake() {
      sctx.fillStyle = '#060612'; sctx.fillRect(0, 0, sc.width, sc.height);
      sctx.fillStyle = '#A78BFA';
      for (let s of snake) {
        sctx.beginPath();
        sctx.roundRect(s.x + 1, s.y + 1, 8, 8, 3);
        sctx.fill();
      }
      sctx.fillStyle = '#F43F5E';
      sctx.beginPath();
      sctx.arc(food.x + 5, food.y + 5, 5, 0, Math.PI * 2);
      sctx.fill();
    }
    drSnake();

    document.addEventListener('keydown', e => {
      if (!sGame) return;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
      if ((e.key === 'ArrowUp'    || e.key === 'w' || e.key === 'W') && sdir.y === 0) sdir = { x: 0, y: -10 };
      if ((e.key === 'ArrowDown'  || e.key === 's' || e.key === 'S') && sdir.y === 0) sdir = { x: 0, y:  10 };
      if ((e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') && sdir.x === 0) sdir = { x: -10, y: 0 };
      if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && sdir.x === 0) sdir = { x:  10, y: 0 };
    });

    window.startSnake = startSnake;
    window.pauseSnake = pauseSnake;
    window.resetSnake = resetSnake;
  }

  /* ═══════════════════════════════════
     PONG
  ═══════════════════════════════════ */
  const pc = document.getElementById('pongCanvas');
  if (pc) {
    const pctx = pc.getContext('2d');
    pc.width = pc.clientWidth || 520; pc.height = 300;
    const PONG_MAX = 12;
    let pGame, pPause = false;
    let ball = { x: pc.width / 2, y: pc.height / 2, dx: 4, dy: 3, r: 7 };
    let p1 = { x: 12, y: pc.height / 2 - 40, w: 10, h: 80 };
    let p2 = { x: pc.width - 22, y: pc.height / 2 - 40, w: 10, h: 80 };
    let sc1 = 0, sc2 = 0;

    function drPong() {
      pctx.fillStyle = '#060612'; pctx.fillRect(0, 0, pc.width, pc.height);
      pctx.setLineDash([6, 6]);
      pctx.strokeStyle = 'rgba(124,58,237,.3)';
      pctx.beginPath(); pctx.moveTo(pc.width / 2, 0); pctx.lineTo(pc.width / 2, pc.height); pctx.stroke();
      pctx.setLineDash([]);
      pctx.fillStyle = '#A78BFA';
      pctx.beginPath(); pctx.roundRect(p1.x, p1.y, p1.w, p1.h, 5); pctx.fill();
      pctx.beginPath(); pctx.roundRect(p2.x, p2.y, p2.w, p2.h, 5); pctx.fill();
      pctx.fillStyle = '#F43F5E';
      pctx.beginPath(); pctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); pctx.fill();
    }
    drPong();

    function startPong() {
      if (pGame) return; pPause = false;
      pGame = setInterval(upPong, 1000 / 60);
    }
    function pausePong() { if (pGame) pPause = !pPause; }
    function resetPong() {
      clearInterval(pGame); pGame = null; sc1 = 0; sc2 = 0; pPause = false;
      document.getElementById('pongScore1').textContent = sc1;
      document.getElementById('pongScore2').textContent = sc2;
      ball = { x: pc.width / 2, y: pc.height / 2, dx: 4, dy: 3, r: 7 };
      p1.y = pc.height / 2 - 40; p2.y = pc.height / 2 - 40;
      drPong();
    }
    function upPong() {
      if (pPause) return;
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.y - ball.r < 0 || ball.y + ball.r > pc.height) ball.dy *= -1;
      if (ball.x - ball.r < p1.x + p1.w && ball.y > p1.y && ball.y < p1.y + p1.h) {
        ball.dx = Math.min(Math.abs(ball.dx) * 1.05, PONG_MAX);
      }
      if (ball.x + ball.r > p2.x && ball.y > p2.y && ball.y < p2.y + p2.h) {
        ball.dx = -Math.min(Math.abs(ball.dx) * 1.05, PONG_MAX);
      }
      if (ball.x < 0) {
        sc2++; document.getElementById('pongScore2').textContent = sc2;
        ball = { x: pc.width / 2, y: pc.height / 2, dx: 4, dy: 3, r: 7 };
      }
      if (ball.x > pc.width) {
        sc1++; document.getElementById('pongScore1').textContent = sc1;
        ball = { x: pc.width / 2, y: pc.height / 2, dx: -4, dy: 3, r: 7 };
      }
      p2.y += (ball.y - p2.y - p2.h / 2) * 0.07;
      p2.y = Math.max(0, Math.min(pc.height - p2.h, p2.y));
      drPong();
    }
    pc.addEventListener('mousemove', e => {
      const r = pc.getBoundingClientRect();
      p1.y = e.clientY - r.top - p1.h / 2;
      p1.y = Math.max(0, Math.min(pc.height - p1.h, p1.y));
    });

    window.startPong = startPong;
    window.pausePong = pausePong;
    window.resetPong = resetPong;
  }

  /* ═══════════════════════════════════
     BREAKOUT
  ═══════════════════════════════════ */
  const bc = document.getElementById('breakoutCanvas');
  if (bc) {
    const bctx = bc.getContext('2d');
    bc.width = bc.clientWidth || 520; bc.height = 300;
    let bGame, bPause = false;
    let bBall, bPad, brks, bSc, bLives;
    const BRICK_COLORS = ['#F43F5E', '#fb923c', '#facc15', '#4ade80', '#60a5fa'];

    function initBreakout() {
      bBall = { x: bc.width / 2, y: bc.height - 50, dx: 4, dy: -4, r: 7 };
      bPad = { x: bc.width / 2 - 50, y: bc.height - 22, w: 100, h: 14 };
      bSc = 0; bLives = 3; bPause = false;
      document.getElementById('breakoutScore').textContent = bSc;
      document.getElementById('breakoutLives').textContent = bLives;
      initBrks();
    }
    function initBrks() {
      brks = [];
      const cols = 8, rows = 5;
      const bw = (bc.width - 16) / cols - 6;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          brks.push({ x: c * (bw + 6) + 8, y: r * 26 + 30, w: bw, h: 18, a: true, color: BRICK_COLORS[r % 5] });
    }
    initBreakout();

    function drBreakout() {
      bctx.fillStyle = '#060612'; bctx.fillRect(0, 0, bc.width, bc.height);
      for (let b of brks) {
        if (!b.a) continue;
        bctx.fillStyle = b.color;
        bctx.beginPath(); bctx.roundRect(b.x, b.y, b.w, b.h, 4); bctx.fill();
      }
      bctx.fillStyle = '#A78BFA';
      bctx.beginPath(); bctx.roundRect(bPad.x, bPad.y, bPad.w, bPad.h, 7); bctx.fill();
      bctx.fillStyle = '#F43F5E';
      bctx.beginPath(); bctx.arc(bBall.x, bBall.y, bBall.r, 0, Math.PI * 2); bctx.fill();
    }
    drBreakout();

    function startBreakout() { if (bGame) return; bGame = setInterval(upBreakout, 1000 / 60); }
    function pauseBreakout() { if (bGame) bPause = !bPause; }
    function resetBreakout() {
      clearInterval(bGame); bGame = null;
      initBreakout(); drBreakout();
    }
    function upBreakout() {
      if (bPause) return;
      bBall.x += bBall.dx; bBall.y += bBall.dy;
      if (bBall.x - bBall.r < 0 || bBall.x + bBall.r > bc.width) bBall.dx *= -1;
      if (bBall.y - bBall.r < 0) bBall.dy *= -1;
      if (bBall.y + bBall.r > bc.height) {
        bLives--;
        document.getElementById('breakoutLives').textContent = bLives;
        if (bLives === 0) { clearInterval(bGame); bGame = null; alert('Game Over! Score: ' + bSc); return; }
        bBall = { x: bc.width / 2, y: bc.height - 50, dx: 4, dy: -4, r: 7 };
      }
      if (bBall.x > bPad.x && bBall.x < bPad.x + bPad.w && bBall.y + bBall.r > bPad.y)
        bBall.dy = -Math.abs(bBall.dy);
      for (let b of brks) {
        if (b.a && bBall.x > b.x && bBall.x < b.x + b.w && bBall.y - bBall.r < b.y + b.h && bBall.y + bBall.r > b.y) {
          b.a = false; bBall.dy *= -1; bSc += 10;
          document.getElementById('breakoutScore').textContent = bSc;
        }
      }
      if (brks.every(b => !b.a)) { clearInterval(bGame); bGame = null; alert('Bravo! Score: ' + bSc); }
      drBreakout();
    }
    bc.addEventListener('mousemove', e => {
      const r = bc.getBoundingClientRect();
      bPad.x = e.clientX - r.left - bPad.w / 2;
      bPad.x = Math.max(0, Math.min(bc.width - bPad.w, bPad.x));
    });

    window.startBreakout = startBreakout;
    window.pauseBreakout = pauseBreakout;
    window.resetBreakout = resetBreakout;
  }

  /* ═══════════════════════════════════
     FLAPPY BIRD
  ═══════════════════════════════════ */
  const fc = document.getElementById('flappyCanvas');
  if (fc) {
    const fctx = fc.getContext('2d');
    fc.width = fc.clientWidth || 520; fc.height = 300;
    let fGame, fPause = false, bird, pipes, fSc, fFrame;

    function initFlappy() {
      bird = { y: 150, v: 0, r: 14 };
      pipes = []; fSc = 0; fFrame = 0; fPause = false;
      document.getElementById('flappyScore').textContent = fSc;
    }
    initFlappy();

    function drFlappy() {
      fctx.fillStyle = '#060612'; fctx.fillRect(0, 0, fc.width, fc.height);
      fctx.fillStyle = '#1e3a1e';
      for (let p of pipes) {
        fctx.fillRect(p.x, 0, 52, p.top);
        fctx.fillRect(p.x, p.bot, 52, fc.height - p.bot);
        fctx.fillStyle = '#22c55e'; fctx.fillRect(p.x - 4, p.top - 16, 60, 16);
        fctx.fillRect(p.x - 4, p.bot, 60, 16);
        fctx.fillStyle = '#1e3a1e';
      }
      fctx.fillStyle = '#facc15';
      fctx.beginPath(); fctx.arc(80, bird.y, bird.r, 0, Math.PI * 2); fctx.fill();
      fctx.fillStyle = '#f97316';
      fctx.beginPath();
      fctx.moveTo(80 + bird.r, bird.y);
      fctx.lineTo(80 + bird.r + 8, bird.y - 4);
      fctx.lineTo(80 + bird.r + 8, bird.y + 4);
      fctx.fill();
    }
    drFlappy();

    function startFlappy() {
      if (fGame) return;
      initFlappy();
      fGame = setInterval(upFlappy, 1000 / 60);
    }
    function pauseFlappy() { if (fGame) fPause = !fPause; }
    function resetFlappy() {
      clearInterval(fGame); fGame = null;
      initFlappy(); drFlappy();
    }
    function upFlappy() {
      if (fPause) return;
      fFrame++;
      bird.v += 0.45; bird.y += bird.v;
      if (bird.y + bird.r > fc.height || bird.y - bird.r < 0) {
        clearInterval(fGame); fGame = null; alert('Game Over! Score: ' + fSc); return;
      }
      if (fFrame % 95 === 0) {
        const gap = 130, h = Math.random() * (fc.height - gap - 80) + 40;
        pipes.push({ x: fc.width, top: h, bot: h + gap });
      }
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2.5;
        if (pipes[i].x + 52 < 0) { pipes.splice(i, 1); continue; }
        if (pipes[i].x < 94 && pipes[i].x + 52 > 66) {
          if (bird.y - bird.r < pipes[i].top || bird.y + bird.r > pipes[i].bot) {
            clearInterval(fGame); fGame = null; alert('Game Over! Score: ' + fSc); return;
          }
        }
        if (Math.abs(pipes[i].x - 66) < 3) { fSc++; document.getElementById('flappyScore').textContent = fSc; }
      }
      drFlappy();
    }
    fc.addEventListener('click', () => { if (fGame && !fPause) bird.v = -8; });
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' && fGame) { e.preventDefault(); if (!fPause) bird.v = -8; }
    });

    window.startFlappy = startFlappy;
    window.pauseFlappy = pauseFlappy;
    window.resetFlappy = resetFlappy;
  }

  /* ═══════════════════════════════════
     SPACE INVADERS
  ═══════════════════════════════════ */
  const ic = document.getElementById('invadersCanvas');
  if (ic) {
    const ictx = ic.getContext('2d');
    ic.width = ic.clientWidth || 520; ic.height = 300;
    let iGame, iPause = false, ship, invaders, shots, iScore, iLives;

    function initInvaders() {
      iScore = 0; iLives = 3; shots = []; iPause = false;
      ship = { x: ic.width / 2 - 20, y: ic.height - 40, w: 40, h: 20 };
      document.getElementById('invadersScore').textContent = iScore;
      document.getElementById('invadersLives').textContent = iLives;
      invaders = [];
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 10; c++)
          invaders.push({ x: 35 + c * 52, y: 35 + r * 40, w: 30, h: 20, a: true });
    }
    initInvaders();

    function drInvaders() {
      ictx.fillStyle = '#060612'; ictx.fillRect(0, 0, ic.width, ic.height);
      ictx.fillStyle = '#A78BFA'; ictx.beginPath(); ictx.roundRect(ship.x, ship.y, ship.w, ship.h, 4); ictx.fill();
      ictx.fillRect(ship.x + 15, ship.y - 8, 10, 10);
      for (let inv of invaders) {
        if (!inv.a) continue;
        ictx.fillStyle = '#F43F5E';
        ictx.beginPath(); ictx.roundRect(inv.x, inv.y, inv.w, inv.h, 3); ictx.fill();
        ictx.fillStyle = '#fca5a5';
        ictx.fillRect(inv.x + 4, inv.y + 4, 4, 4);
        ictx.fillRect(inv.x + 14, inv.y + 4, 4, 4);
      }
      ictx.fillStyle = '#facc15';
      for (let s of shots) ictx.fillRect(s.x, s.y, s.w, s.h);
    }
    drInvaders();

    function startInvaders() { if (iGame) return; initInvaders(); iGame = setInterval(upInvaders, 1000 / 60); }
    function pauseInvaders() { if (iGame) iPause = !iPause; }
    function resetInvaders() { clearInterval(iGame); iGame = null; initInvaders(); drInvaders(); }

    let iKeys = {};
    document.addEventListener('keydown', e => {
      iKeys[e.key] = true; iKeys[e.code] = true;
      if (!iGame) return;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'Space') shots.push({ x: ship.x + ship.w / 2 - 2, y: ship.y, w: 4, h: 10 });
    });
    document.addEventListener('keyup', e => { iKeys[e.key] = false; iKeys[e.code] = false; });

    function upInvaders() {
      if (iPause) return;
      if (iKeys['ArrowLeft'])  { ship.x -= 4; ship.x = Math.max(0, ship.x); }
      if (iKeys['ArrowRight']) { ship.x += 4; ship.x = Math.min(ic.width - ship.w, ship.x); }
      for (let s of shots) s.y -= 8;
      const t = Date.now();
      for (let inv of invaders) if (inv.a) inv.x += Math.sin(t / 600) * 1.5;
      for (let s of shots) {
        for (let inv of invaders) {
          if (inv.a && s.x < inv.x + inv.w && s.x + s.w > inv.x && s.y < inv.y + inv.h && s.y + s.h > inv.y) {
            inv.a = false; s.y = -100; iScore += 10;
            document.getElementById('invadersScore').textContent = iScore;
          }
        }
      }
      shots = shots.filter(s => s.y > -20);
      if (invaders.some(inv => inv.a && inv.y + inv.h > ship.y)) {
        iLives--; document.getElementById('invadersLives').textContent = iLives;
        if (iLives === 0) { clearInterval(iGame); iGame = null; alert('Game Over! Score: ' + iScore); return; }
        for (let inv of invaders) inv.y -= 50;
      }
      if (invaders.every(inv => !inv.a)) {
        clearInterval(iGame); iGame = null; alert('Victoire! Score: ' + iScore);
      }
      drInvaders();
    }

    window.startInvaders = startInvaders;
    window.pauseInvaders = pauseInvaders;
    window.resetInvaders = resetInvaders;
  }

  /* ═══════════════════════════════════
     TETRIS
  ═══════════════════════════════════ */
  const tc = document.getElementById('tetrisCanvas');
  if (tc) {
    const tctx = tc.getContext('2d');
    tc.width = tc.clientWidth || 520; tc.height = 300;
    let tGame, tPause = false, tGrid, tPiece, tScore;
    const tRows = 20, tCols = 10;
    const tSize = Math.floor(tc.height / tRows);          // 15px — fits height
    const tOffX = Math.floor((tc.width - tCols * tSize) / 2); // center board
    const tShapes = [
      { s: [[1, 1, 1, 1]], c: '#22d3ee' },
      { s: [[1, 1], [1, 1]], c: '#facc15' },
      { s: [[0, 1, 1], [1, 1, 0]], c: '#4ade80' },
      { s: [[1, 1, 0], [0, 1, 1]], c: '#F43F5E' },
      { s: [[1, 1, 1], [0, 1, 0]], c: '#A78BFA' },
      { s: [[1, 0, 0], [1, 1, 1]], c: '#fb923c' },
      { s: [[0, 0, 1], [1, 1, 1]], c: '#60a5fa' }
    ];

    function initTetris() {
      tGrid = Array.from({ length: tRows }, () => Array(tCols).fill(null));
      tScore = 0; tPause = false;
      document.getElementById('tetrisScore').textContent = tScore;
      newTPiece();
    }
    function newTPiece() {
      const sh = tShapes[Math.floor(Math.random() * tShapes.length)];
      tPiece = { shape: sh.s.map(r => [...r]), x: 3, y: 0, color: sh.c };
    }

    function drTetris() {
      tctx.fillStyle = '#060612'; tctx.fillRect(0, 0, tc.width, tc.height);
      tctx.strokeStyle = 'rgba(124,58,237,.2)';
      tctx.lineWidth = 1;
      tctx.strokeRect(tOffX - 1, 0, tCols * tSize + 2, tRows * tSize);
      for (let r = 0; r < tRows; r++) {
        for (let c = 0; c < tCols; c++) {
          if (tGrid[r][c]) {
            tctx.fillStyle = tGrid[r][c];
            tctx.beginPath();
            tctx.roundRect(tOffX + c * tSize + 1, r * tSize + 1, tSize - 2, tSize - 2, 3);
            tctx.fill();
          }
        }
      }
      if (tPiece) {
        tctx.fillStyle = tPiece.color;
        for (let r = 0; r < tPiece.shape.length; r++) {
          for (let c = 0; c < tPiece.shape[0].length; c++) {
            if (tPiece.shape[r][c]) {
              tctx.beginPath();
              tctx.roundRect(tOffX + (tPiece.x + c) * tSize + 1, (tPiece.y + r) * tSize + 1, tSize - 2, tSize - 2, 3);
              tctx.fill();
            }
          }
        }
      }
    }

    function startTetris() {
      if (tGame) return;
      initTetris();
      tGame = setInterval(upTetris, 400);
    }
    function pauseTetris() { if (tGame) tPause = !tPause; }
    function resetTetris() { clearInterval(tGame); tGame = null; initTetris(); drTetris(); }

    function moveTPiece(dx, dy) {
      const { shape, x, y } = tPiece;
      for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c]) {
          const nx = x + c + dx, ny = y + r + dy;
          if (nx < 0 || nx >= tCols || ny >= tRows || (ny >= 0 && tGrid[ny][nx])) return false;
        }
      }
      tPiece.x += dx; tPiece.y += dy; return true;
    }
    function rotateTPiece() {
      const rot = tPiece.shape[0].map((_, i) => tPiece.shape.map(r => r[i])).reverse();
      const old = tPiece.shape; tPiece.shape = rot;
      if (!moveTPiece(0, 0)) tPiece.shape = old;
    }
    function placeTPiece() {
      for (let r = 0; r < tPiece.shape.length; r++) for (let c = 0; c < tPiece.shape[0].length; c++) {
        if (tPiece.shape[r][c] && tPiece.y + r >= 0) tGrid[tPiece.y + r][tPiece.x + c] = tPiece.color;
      }
    }
    function clearTLines() {
      for (let r = tRows - 1; r >= 0; r--) {
        if (tGrid[r].every(v => v)) {
          tGrid.splice(r, 1); tGrid.unshift(Array(tCols).fill(null)); tScore += 10;
          document.getElementById('tetrisScore').textContent = tScore; r++;
        }
      }
    }
    function upTetris() {
      if (tPause) return;
      if (!moveTPiece(0, 1)) {
        placeTPiece(); clearTLines(); newTPiece();
        if (!moveTPiece(0, 0)) { clearInterval(tGame); tGame = null; alert('Game Over! Score: ' + tScore); return; }
      }
      drTetris();
    }
    document.addEventListener('keydown', e => {
      if (!tGame || tPause) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); moveTPiece(-1, 0); drTetris(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); moveTPiece( 1, 0); drTetris(); }
      if (e.key === 'ArrowDown')  { e.preventDefault(); moveTPiece( 0, 1); drTetris(); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); rotateTPiece(); drTetris(); }
    });

    initTetris(); drTetris();
    window.startTetris = startTetris;
    window.pauseTetris = pauseTetris;
    window.resetTetris = resetTetris;
  }

  /* ═══════════════════════════════════
     ASTEROID
  ═══════════════════════════════════ */
  const ac = document.getElementById('asteroidCanvas');
  if (ac) {
    const actx = ac.getContext('2d');
    ac.width = ac.clientWidth || 520; ac.height = 300;
    let aGame, aPause = false, shipA, asteroids, aShots, aScore;

    function initAsteroid() {
      aScore = 0; aPause = false;
      document.getElementById('asteroidScore').textContent = aScore;
      shipA = { x: ac.width / 2, y: ac.height / 2, angle: -Math.PI / 2, dx: 0, dy: 0, r: 12 };
      asteroids = Array.from({ length: 5 }, () => ({
        x: Math.random() * ac.width, y: Math.random() * ac.height,
        r: 20 + Math.random() * 18, dx: (Math.random() - .5) * 2.5, dy: (Math.random() - .5) * 2.5
      }));
      aShots = [];
    }
    initAsteroid();

    function drAsteroid() {
      actx.fillStyle = '#060612'; actx.fillRect(0, 0, ac.width, ac.height);
      actx.save(); actx.translate(shipA.x, shipA.y); actx.rotate(shipA.angle);
      actx.strokeStyle = '#A78BFA'; actx.lineWidth = 2; actx.lineJoin = 'round';
      actx.beginPath(); actx.moveTo(14, 0); actx.lineTo(-10, -8); actx.lineTo(-6, 0); actx.lineTo(-10, 8); actx.closePath(); actx.stroke();
      actx.restore();
      actx.strokeStyle = '#7C3AED'; actx.lineWidth = 1.5;
      for (let ast of asteroids) {
        actx.beginPath(); actx.arc(ast.x, ast.y, ast.r, 0, Math.PI * 2); actx.stroke();
      }
      actx.fillStyle = '#F43F5E';
      for (let s of aShots) { actx.beginPath(); actx.arc(s.x, s.y, 3, 0, Math.PI * 2); actx.fill(); }
    }
    drAsteroid();

    let aKeys = {};
    document.addEventListener('keydown', e => {
      aKeys[e.key] = true; aKeys[e.code] = true;
      if (aGame && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault();
    });
    document.addEventListener('keyup', e => { aKeys[e.key] = false; aKeys[e.code] = false; });
    let lastShot = 0;

    function startAsteroid() { if (aGame) return; initAsteroid(); aGame = setInterval(upAsteroid, 1000 / 60); }
    function pauseAsteroid() { if (aGame) aPause = !aPause; }
    function resetAsteroid() { clearInterval(aGame); aGame = null; initAsteroid(); drAsteroid(); }

    function upAsteroid() {
      if (aPause) return;
      if (aKeys['ArrowLeft'])  shipA.angle -= 0.07;
      if (aKeys['ArrowRight']) shipA.angle += 0.07;
      if (aKeys['ArrowUp']) { shipA.dx += Math.cos(shipA.angle) * 0.25; shipA.dy += Math.sin(shipA.angle) * 0.25; }
      shipA.dx *= 0.98; shipA.dy *= 0.98;
      shipA.x = (shipA.x + shipA.dx + ac.width)  % ac.width;
      shipA.y = (shipA.y + shipA.dy + ac.height) % ac.height;

      const now = Date.now();
      if (aKeys['Space'] && now - lastShot > 220) {
        lastShot = now;
        aShots.push({
          x: shipA.x + Math.cos(shipA.angle) * 14,
          y: shipA.y + Math.sin(shipA.angle) * 14,
          dx: Math.cos(shipA.angle) * 8,
          dy: Math.sin(shipA.angle) * 8,
          life: 60
        });
      }
      for (let s of aShots) { s.x += s.dx; s.y += s.dy; s.life--; }
      aShots = aShots.filter(s => s.life > 0);

      for (let ast of asteroids) {
        ast.x = (ast.x + ast.dx + ac.width)  % ac.width;
        ast.y = (ast.y + ast.dy + ac.height) % ac.height;
        if (Math.hypot(shipA.x - ast.x, shipA.y - ast.y) < shipA.r + ast.r) {
          clearInterval(aGame); aGame = null; alert('Game Over! Score: ' + aScore); return;
        }
        for (let s of aShots) {
          if (Math.hypot(s.x - ast.x, s.y - ast.y) < ast.r) {
            s.life = 0; aScore += 10;
            document.getElementById('asteroidScore').textContent = aScore;
            if (ast.r > 14) {
              asteroids.push({ x: ast.x, y: ast.y, r: ast.r * .6, dx: -ast.dy, dy:  ast.dx });
              asteroids.push({ x: ast.x, y: ast.y, r: ast.r * .6, dx:  ast.dy, dy: -ast.dx });
            }
            ast.r = 0;
          }
        }
      }
      asteroids = asteroids.filter(a => a.r > 0);
      if (asteroids.length === 0) { clearInterval(aGame); aGame = null; alert('Victoire! Score: ' + aScore); }
      drAsteroid();
    }

    window.startAsteroid = startAsteroid;
    window.pauseAsteroid = pauseAsteroid;
    window.resetAsteroid = resetAsteroid;
  }

  /* ═══════════════════════════════════
     MEMORY
  ═══════════════════════════════════ */
  const mc = document.getElementById('memoryCanvas');
  if (mc) {
    const mctx = mc.getContext('2d');
    mc.width = mc.clientWidth || 520; mc.height = 300;
    let mCards = [], mOpen = [], mScore = 0, mLocked = false;
    const SYMBOLS = ['▲', '●', '■', '◆', '★', '♦', '♠', '♥'];

    function startMemory() {
      mScore = 0; mOpen = []; mLocked = false;
      document.getElementById('memoryScore').textContent = mScore;
      mCards = Array.from({ length: 16 }, (_, i) => ({ id: i % 8, open: false, found: false, symbol: SYMBOLS[i % 8] }))
        .sort(() => Math.random() - .5);
      drMemory();
    }
    function resetMemory() { startMemory(); }

    const cw = () => mc.width / 4, ch = () => mc.height / 4;
    function drMemory() {
      mctx.fillStyle = '#060612'; mctx.fillRect(0, 0, mc.width, mc.height);
      if (!mCards.length) return; // pas encore initialisé
      for (let i = 0; i < 16; i++) {
        const cx = i % 4, cy = Math.floor(i / 4);
        const x = cx * cw() + 4, y = cy * ch() + 4, w = cw() - 8, h = ch() - 8;
        mctx.fillStyle = mCards[i].found
          ? 'rgba(34,197,94,.2)'
          : mCards[i].open ? 'rgba(124,58,237,.3)' : 'rgba(124,58,237,.1)';
        mctx.beginPath(); mctx.roundRect(x, y, w, h, 8); mctx.fill();
        mctx.strokeStyle = mCards[i].found ? '#22c55e' : mCards[i].open ? '#A78BFA' : 'rgba(124,58,237,.4)';
        mctx.lineWidth = 1.5;
        mctx.beginPath(); mctx.roundRect(x, y, w, h, 8); mctx.stroke();
        if (mCards[i].open || mCards[i].found) {
          mctx.fillStyle = mCards[i].found ? '#22c55e' : '#A78BFA';
          mctx.font = `bold ${Math.floor(ch() * .45)}px sans-serif`;
          mctx.textAlign = 'center'; mctx.textBaseline = 'middle';
          mctx.fillText(mCards[i].symbol, x + w / 2, y + h / 2);
        }
      }
    }
    drMemory();

    mc.addEventListener('click', e => {
      if (mLocked || !mCards.length) return;
      const x = Math.floor(e.offsetX / cw()), y = Math.floor(e.offsetY / ch());
      const idx = y * 4 + x;
      if (mCards[idx].open || mCards[idx].found) return;
      mCards[idx].open = true; mOpen.push(idx); drMemory();
      if (mOpen.length === 2) {
        mLocked = true;
        setTimeout(() => {
          if (mCards[mOpen[0]].id === mCards[mOpen[1]].id) {
            mCards[mOpen[0]].found = true; mCards[mOpen[1]].found = true; mScore++;
            document.getElementById('memoryScore').textContent = mScore;
            if (mScore === 8) setTimeout(() => alert('Bravo! Toutes les paires trouvées!'), 100);
          }
          mCards[mOpen[0]].open = false; mCards[mOpen[1]].open = false;
          mOpen = []; mLocked = false; drMemory();
        }, 700);
      }
    });

    window.startMemory = startMemory;
    window.resetMemory = resetMemory;
  }

  /* ═══════════════════════════════════
     MAZE RUNNER
  ═══════════════════════════════════ */
  const mz = document.getElementById('mazeCanvas');
  if (mz) {
    const mzctx = mz.getContext('2d');
    mz.width = mz.clientWidth || 520; mz.height = 300;
    const COLS = 15, ROWS = 9; // both odd — required for DFS carving
    const cw = Math.floor(mz.width / COLS), ch = Math.floor(mz.height / ROWS);
    let mzMaze, mzPlayer, mzTime, mzTimer, mzActive = false;

    function generateMaze() {
      mzMaze = Array.from({ length: ROWS }, () => Array(COLS).fill(1));
      function carve(x, y) {
        mzMaze[y][x] = 0;
        const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]].sort(() => Math.random() - .5);
        for (let [dx, dy] of dirs) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && mzMaze[ny][nx] === 1) {
            mzMaze[y + dy / 2][x + dx / 2] = 0;
            carve(nx, ny);
          }
        }
      }
      carve(0, 0);
      mzMaze[ROWS - 1][COLS - 1] = 0;
    }

    function drMaze() {
      mzctx.fillStyle = '#060612'; mzctx.fillRect(0, 0, mz.width, mz.height);
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        if (mzMaze[y][x]) { mzctx.fillStyle = '#1e1e3f'; mzctx.fillRect(x * cw, y * ch, cw, ch); }
      }
      mzctx.fillStyle = 'rgba(34,197,94,.3)';
      mzctx.beginPath(); mzctx.roundRect((COLS - 1) * cw + 2, (ROWS - 1) * ch + 2, cw - 4, ch - 4, 4); mzctx.fill();
      mzctx.strokeStyle = '#22c55e'; mzctx.lineWidth = 1.5;
      mzctx.beginPath(); mzctx.roundRect((COLS - 1) * cw + 2, (ROWS - 1) * ch + 2, cw - 4, ch - 4, 4); mzctx.stroke();
      mzctx.fillStyle = '#A78BFA';
      mzctx.beginPath();
      mzctx.arc(mzPlayer.x * cw + cw / 2, mzPlayer.y * ch + ch / 2, Math.min(cw, ch) / 2 - 3, 0, Math.PI * 2);
      mzctx.fill();
    }

    function startMaze() {
      clearInterval(mzTimer);
      generateMaze();
      mzPlayer = { x: 0, y: 0 }; mzTime = 0; mzActive = true;
      document.getElementById('mazeTime').textContent = mzTime;
      mzTimer = setInterval(() => { if (mzActive) { mzTime++; document.getElementById('mazeTime').textContent = mzTime; } }, 1000);
      drMaze();
    }
    function resetMaze() {
      clearInterval(mzTimer); mzActive = false; mzTime = 0;
      document.getElementById('mazeTime').textContent = '0';
      generateMaze(); mzPlayer = { x: 0, y: 0 }; drMaze();
    }

    mzPlayer = { x: 0, y: 0 };
    generateMaze(); drMaze();

    document.addEventListener('keydown', e => {
      if (!mzActive) return;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault();
      let nx = mzPlayer.x, ny = mzPlayer.y;
      if (e.key === 'ArrowLeft')  nx--;
      if (e.key === 'ArrowRight') nx++;
      if (e.key === 'ArrowUp')    ny--;
      if (e.key === 'ArrowDown')  ny++;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS || mzMaze[ny][nx]) return;
      mzPlayer.x = nx; mzPlayer.y = ny; drMaze();
      if (nx === COLS - 1 && ny === ROWS - 1) {
        mzActive = false; clearInterval(mzTimer);
        alert('Bravo! Temps: ' + mzTime + 's');
      }
    });

    window.startMaze = startMaze;
    window.resetMaze = resetMaze;
  }

  /* ═══════════════════════════════════
     CATCH & DODGE
  ═══════════════════════════════════ */
  const cc = document.getElementById('catchCanvas');
  if (cc) {
    const cctx = cc.getContext('2d');
    cc.width = cc.clientWidth || 520; cc.height = 300;
    let cGame, cPause = false, cPlayer, cFruits, cScore, cLives;

    function initCatch() {
      cPlayer = { x: cc.width / 2, y: cc.height - 32, w: 60, h: 18 };
      cFruits = []; cScore = 0; cLives = 3; cPause = false;
      document.getElementById('catchScore').textContent = cScore;
      document.getElementById('catchLives').textContent = cLives;
    }
    initCatch();

    function drCatch() {
      cctx.fillStyle = '#060612'; cctx.fillRect(0, 0, cc.width, cc.height);
      cctx.fillStyle = '#A78BFA';
      cctx.beginPath(); cctx.roundRect(cPlayer.x, cPlayer.y, cPlayer.w, cPlayer.h, 9); cctx.fill();
      for (let f of cFruits) {
        cctx.fillStyle = f.type === 'good' ? '#22c55e' : '#ef4444';
        cctx.beginPath(); cctx.arc(f.x + 10, f.y + 10, 10, 0, Math.PI * 2); cctx.fill();
        cctx.fillStyle = f.type === 'good' ? '#86efac' : '#fca5a5';
        cctx.font = 'bold 11px sans-serif'; cctx.textAlign = 'center'; cctx.textBaseline = 'middle';
        cctx.fillText(f.type === 'good' ? '+' : '✕', f.x + 10, f.y + 10);
      }
    }
    drCatch();

    function startCatch() { if (cGame) return; initCatch(); cGame = setInterval(upCatch, 1000 / 60); }
    function pauseCatch() { if (cGame) cPause = !cPause; }
    function resetCatch() { clearInterval(cGame); cGame = null; initCatch(); drCatch(); }

    function upCatch() {
      if (cPause) return;
      if (Math.random() < 0.025)
        cFruits.push({ x: Math.random() * (cc.width - 20), y: 0, type: Math.random() < .65 ? 'good' : 'bad' });
      for (let f of cFruits) f.y += 3.5;
      cFruits = cFruits.filter(f => {
        if (f.y > cc.height) return false;
        if (f.x < cPlayer.x + cPlayer.w && f.x + 20 > cPlayer.x && f.y < cPlayer.y + cPlayer.h && f.y + 20 > cPlayer.y) {
          if (f.type === 'good') { cScore++; document.getElementById('catchScore').textContent = cScore; }
          else {
            cLives--; document.getElementById('catchLives').textContent = cLives;
            if (cLives === 0) { clearInterval(cGame); cGame = null; alert('Game Over! Score: ' + cScore); }
          }
          return false;
        }
        return true;
      });
      drCatch();
    }
    cc.addEventListener('mousemove', e => {
      const r = cc.getBoundingClientRect();
      cPlayer.x = e.clientX - r.left - cPlayer.w / 2;
      cPlayer.x = Math.max(0, Math.min(cc.width - cPlayer.w, cPlayer.x));
    });

    window.startCatch = startCatch;
    window.pauseCatch = pauseCatch;
    window.resetCatch = resetCatch;
  }

  /* ═══════════════════════════════════
     MINESWEEPER
  ═══════════════════════════════════ */
  const msC = document.getElementById('minesweeperCanvas');
  if (msC) {
    const msCtx = msC.getContext('2d');
    msC.width = msC.clientWidth || 520; msC.height = 300;

    const MS_COLS = 14, MS_ROWS = 8, MS_MINES = 15;
    const msCW = Math.floor(msC.width / MS_COLS);
    const msCH = Math.floor(msC.height / MS_ROWS);
    const msOX = Math.floor((msC.width  - MS_COLS * msCW) / 2);
    const msOY = Math.floor((msC.height - MS_ROWS * msCH) / 2);

    const MS_COLORS = ['', '#60a5fa', '#4ade80', '#F43F5E', '#818cf8', '#fb923c', '#22d3ee', '#A78BFA', '#e2e8f0'];

    let msGrid, msFirstClick, msGameOver, msWon, msFlags, msRevealed;

    function initMinesweeper() {
      msGrid = Array.from({ length: MS_ROWS }, () =>
        Array.from({ length: MS_COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
      );
      msFirstClick = true; msGameOver = false; msWon = false; msFlags = 0; msRevealed = 0;
      document.getElementById('minesweeperMines').textContent = MS_MINES;
      drMinesweeper();
    }

    function placeMines(fr, fc) {
      let placed = 0;
      while (placed < MS_MINES) {
        const r = Math.floor(Math.random() * MS_ROWS);
        const c = Math.floor(Math.random() * MS_COLS);
        if (Math.abs(r - fr) <= 1 && Math.abs(c - fc) <= 1) continue;
        if (msGrid[r][c].mine) continue;
        msGrid[r][c].mine = true;
        placed++;
      }
      for (let r = 0; r < MS_ROWS; r++) for (let c = 0; c < MS_COLS; c++) {
        if (msGrid[r][c].mine) continue;
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < MS_ROWS && nc >= 0 && nc < MS_COLS && msGrid[nr][nc].mine) cnt++;
        }
        msGrid[r][c].count = cnt;
      }
    }

    function revealCell(r, c) {
      if (r < 0 || r >= MS_ROWS || c < 0 || c >= MS_COLS) return;
      const cell = msGrid[r][c];
      if (cell.revealed || cell.flagged) return;
      cell.revealed = true; msRevealed++;
      if (cell.count === 0)
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          revealCell(r + dr, c + dc);
        }
    }

    function drMinesweeper() {
      msCtx.fillStyle = '#060612'; msCtx.fillRect(0, 0, msC.width, msC.height);
      for (let r = 0; r < MS_ROWS; r++) for (let c = 0; c < MS_COLS; c++) {
        const cell = msGrid[r][c];
        const x = msOX + c * msCW, y = msOY + r * msCH, p = 2;

        msCtx.fillStyle = cell.revealed
          ? (cell.mine ? 'rgba(244,63,94,.35)' : 'rgba(124,58,237,.12)')
          : cell.flagged ? 'rgba(244,63,94,.2)' : 'rgba(124,58,237,.15)';
        msCtx.beginPath(); msCtx.roundRect(x + p, y + p, msCW - p * 2, msCH - p * 2, 3); msCtx.fill();

        msCtx.strokeStyle = cell.revealed
          ? 'rgba(124,58,237,.2)'
          : cell.flagged ? 'rgba(244,63,94,.6)' : 'rgba(124,58,237,.4)';
        msCtx.lineWidth = 1;
        msCtx.beginPath(); msCtx.roundRect(x + p, y + p, msCW - p * 2, msCH - p * 2, 3); msCtx.stroke();

        const cx = x + msCW / 2, cy = y + msCH / 2;
        const fs = Math.floor(msCH * 0.5);
        msCtx.textAlign = 'center'; msCtx.textBaseline = 'middle';

        if (!cell.revealed && cell.flagged) {
          msCtx.fillStyle = '#F43F5E';
          msCtx.font = `bold ${fs}px sans-serif`;
          msCtx.fillText('⚑', cx, cy);
        } else if (cell.revealed && cell.mine) {
          msCtx.font = `${fs}px sans-serif`;
          msCtx.fillText('💣', cx, cy);
        } else if (cell.revealed && cell.count > 0) {
          msCtx.fillStyle = MS_COLORS[cell.count];
          msCtx.font = `bold ${fs}px 'JetBrains Mono', monospace`;
          msCtx.fillText(cell.count, cx, cy);
        }
      }
    }

    initMinesweeper();

    msC.addEventListener('click', e => {
      if (msGameOver || msWon) return;
      const rect = msC.getBoundingClientRect();
      const c = Math.floor((e.clientX - rect.left  - msOX) / msCW);
      const r = Math.floor((e.clientY - rect.top - msOY) / msCH);
      if (r < 0 || r >= MS_ROWS || c < 0 || c >= MS_COLS) return;
      const cell = msGrid[r][c];
      if (cell.flagged || cell.revealed) return;

      if (msFirstClick) { msFirstClick = false; placeMines(r, c); }

      if (cell.mine) {
        cell.revealed = true; msGameOver = true;
        for (let rr = 0; rr < MS_ROWS; rr++)
          for (let cc2 = 0; cc2 < MS_COLS; cc2++)
            if (msGrid[rr][cc2].mine) msGrid[rr][cc2].revealed = true;
        drMinesweeper();
        setTimeout(() => alert('Boom! Game Over! Cases révélées: ' + msRevealed), 80);
        return;
      }

      revealCell(r, c);
      if (msRevealed >= MS_ROWS * MS_COLS - MS_MINES) {
        msWon = true; drMinesweeper();
        setTimeout(() => alert('Bravo! Champ miné déminé!'), 80);
        return;
      }
      drMinesweeper();
    });

    msC.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (msGameOver || msWon || msFirstClick) return;
      const rect = msC.getBoundingClientRect();
      const c = Math.floor((e.clientX - rect.left  - msOX) / msCW);
      const r = Math.floor((e.clientY - rect.top - msOY) / msCH);
      if (r < 0 || r >= MS_ROWS || c < 0 || c >= MS_COLS) return;
      const cell = msGrid[r][c];
      if (cell.revealed) return;
      cell.flagged = !cell.flagged;
      msFlags += cell.flagged ? 1 : -1;
      document.getElementById('minesweeperMines').textContent = MS_MINES - msFlags;
      drMinesweeper();
    });

    window.startMinesweeper = () => initMinesweeper();
    window.resetMinesweeper = () => initMinesweeper();
  }

});
