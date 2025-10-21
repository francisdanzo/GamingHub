// Particles
        const p = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const pt = document.createElement('div');
            pt.className = 'particle';
            pt.style.left = Math.random() * 100 + '%';
            pt.style.animationDelay = Math.random() * 8 + 's';
            pt.style.animationDuration = (Math.random() * 5 + 5) + 's';
            p.appendChild(pt);
        }

        // SNAKE
        const sc = document.getElementById('snakeCanvas');
        const sctx = sc.getContext('2d');
        sc.width = sc.offsetWidth;
        sc.height = 300;
        let snake = [{x: 150, y: 150}], sdir = {x: 0, y: 0}, food = {x: 300, y: 150};
        let sScore = 0, sGame, sPause = false;

        function startSnake() {
            if (sGame) return;
            snake = [{x: 150, y: 150}];
            sdir = {x: 10, y: 0};
            sScore = 0;
            sPause = false;
            document.getElementById('snakeScore').textContent = sScore;
            genFood();
            sGame = setInterval(upSnake, 100);
        }

        function pauseSnake() { sPause = !sPause; }

        function upSnake() {
            if (sPause) return;
            const h = {x: snake[0].x + sdir.x, y: snake[0].y + sdir.y};
            if (h.x < 0 || h.x >= sc.width || h.y < 0 || h.y >= sc.height) {
                clearInterval(sGame); sGame = null; alert('Game Over! Score: ' + sScore); return;
            }
            for (let s of snake) {
                if (h.x === s.x && h.y === s.y) {
                    clearInterval(sGame); sGame = null; alert('Game Over! Score: ' + sScore); return;
                }
            }
            snake.unshift(h);
            if (h.x === food.x && h.y === food.y) {
                sScore++; document.getElementById('snakeScore').textContent = sScore; genFood();
            } else snake.pop();
            drSnake();
        }

        function genFood() {
            food.x = Math.floor(Math.random() * (sc.width / 10)) * 10;
            food.y = Math.floor(Math.random() * (sc.height / 10)) * 10;
        }

        function drSnake() {
            sctx.fillStyle = '#000'; sctx.fillRect(0, 0, sc.width, sc.height);
            sctx.fillStyle = '#00ffff';
            for (let s of snake) sctx.fillRect(s.x, s.y, 10, 10);
            sctx.fillStyle = '#ff00ff'; sctx.fillRect(food.x, food.y, 10, 10);
        }

        document.addEventListener('keydown', e => {
            if (!sGame) return;
            if (e.key === 'ArrowUp' && sdir.y === 0) sdir = {x: 0, y: -10};
            if (e.key === 'ArrowDown' && sdir.y === 0) sdir = {x: 0, y: 10};
            if (e.key === 'ArrowLeft' && sdir.x === 0) sdir = {x: -10, y: 0};
            if (e.key === 'ArrowRight' && sdir.x === 0) sdir = {x: 10, y: 0};
        });

        // PONG
        const pc = document.getElementById('pongCanvas');
        const pctx = pc.getContext('2d');
        pc.width = pc.offsetWidth; pc.height = 300;
        let pGame, ball = {x: pc.width/2, y: pc.height/2, dx: 3, dy: 3, r: 8};
        let p1 = {x: 10, y: pc.height/2-40, w: 10, h: 80};
        let p2 = {x: pc.width-20, y: pc.height/2-40, w: 10, h: 80};
        let sc1 = 0, sc2 = 0;

        function startPong() {
            if (pGame) return;
            pGame = setInterval(upPong, 1000/60);
        }

        function resetPong() {
            clearInterval(pGame); pGame = null; sc1 = 0; sc2 = 0;
            document.getElementById('pongScore1').textContent = sc1;
            document.getElementById('pongScore2').textContent = sc2;
            ball = {x: pc.width/2, y: pc.height/2, dx: 3, dy: 3, r: 8};
        }

        function upPong() {
            ball.x += ball.dx; ball.y += ball.dy;
            if (ball.y - ball.r < 0 || ball.y + ball.r > pc.height) ball.dy *= -1;
            if (ball.x - ball.r < p1.x + p1.w && ball.y > p1.y && ball.y < p1.y + p1.h) ball.dx = Math.abs(ball.dx);
            if (ball.x + ball.r > p2.x && ball.y > p2.y && ball.y < p2.y + p2.h) ball.dx = -Math.abs(ball.dx);
            if (ball.x < 0) {
                sc2++; document.getElementById('pongScore2').textContent = sc2;
                ball = {x: pc.width/2, y: pc.height/2, dx: 3, dy: 3, r: 8};
            }
            if (ball.x > pc.width) {
                sc1++; document.getElementById('pongScore1').textContent = sc1;
                ball = {x: pc.width/2, y: pc.height/2, dx: -3, dy: 3, r: 8};
            }
            p2.y = ball.y - p2.h/2;
            p2.y = Math.max(0, Math.min(pc.height - p2.h, p2.y));
            drPong();
        }

        function drPong() {
            pctx.fillStyle = '#000'; pctx.fillRect(0, 0, pc.width, pc.height);
            pctx.fillStyle = '#00ffff';
            pctx.fillRect(p1.x, p1.y, p1.w, p1.h);
            pctx.fillRect(p2.x, p2.y, p2.w, p2.h);
            pctx.beginPath(); pctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
            pctx.fillStyle = '#ff00ff'; pctx.fill(); pctx.closePath();
        }

        pc.addEventListener('mousemove', e => {
            const r = pc.getBoundingClientRect();
            p1.y = e.clientY - r.top - p1.h/2;
            p1.y = Math.max(0, Math.min(pc.height - p1.h, p1.y));
        });

        // BREAKOUT
        const bc = document.getElementById('breakoutCanvas');
        const bctx = bc.getContext('2d');
        bc.width = bc.offsetWidth; bc.height = 300;
        let bGame, bBall = {x: bc.width/2, y: bc.height-50, dx: 4, dy: -4, r: 8};
        let bPad = {x: bc.width/2-50, y: bc.height-20, w: 100, h: 15};
        let brks = [], bSc = 0, bLives = 3;

        function initBrks() {
            brks = [];
            const rows = 5, cols = 8, bw = bc.width/cols - 10, bh = 20;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    brks.push({x: c*(bw+10)+5, y: r*(bh+10)+30, w: bw, h: bh, a: true});
                }
            }
        }

        function startBreakout() {
            if (bGame) return;
            initBrks();
            bGame = setInterval(upBreakout, 1000/60);
        }

        function resetBreakout() {
            clearInterval(bGame); bGame = null; bSc = 0; bLives = 3;
            document.getElementById('breakoutScore').textContent = bSc;
            document.getElementById('breakoutLives').textContent = bLives;
            bBall = {x: bc.width/2, y: bc.height-50, dx: 4, dy: -4, r: 8};
            initBrks();
        }

        function upBreakout() {
            bBall.x += bBall.dx; bBall.y += bBall.dy;
            if (bBall.x - bBall.r < 0 || bBall.x + bBall.r > bc.width) bBall.dx *= -1;
            if (bBall.y - bBall.r < 0) bBall.dy *= -1;
            if (bBall.y + bBall.r > bc.height) {
                bLives--; document.getElementById('breakoutLives').textContent = bLives;
                if (bLives === 0) {
                    clearInterval(bGame); bGame = null; alert('Game Over! Score: ' + bSc); return;
                }
                bBall = {x: bc.width/2, y: bc.height-50, dx: 4, dy: -4, r: 8};
            }
            if (bBall.x > bPad.x && bBall.x < bPad.x + bPad.w && bBall.y + bBall.r > bPad.y)
                bBall.dy = -Math.abs(bBall.dy);
            for (let b of brks) {
                if (b.a && bBall.x > b.x && bBall.x < b.x + b.w &&
                    bBall.y - bBall.r < b.y + b.h && bBall.y + bBall.r > b.y) {
                    b.a = false; bBall.dy *= -1; bSc += 10;
                    document.getElementById('breakoutScore').textContent = bSc;
                }
            }
            drBreakout();
        }

        function drBreakout() {
            bctx.fillStyle = '#000'; bctx.fillRect(0, 0, bc.width, bc.height);
            bctx.fillStyle = '#00ffff'; bctx.fillRect(bPad.x, bPad.y, bPad.w, bPad.h);
            bctx.beginPath(); bctx.arc(bBall.x, bBall.y, bBall.r, 0, Math.PI*2);
            bctx.fillStyle = '#ff00ff'; bctx.fill(); bctx.closePath();
            const cols = ['#f00', '#f80', '#ff0', '#0f0', '#08f'];
            for (let b of brks) {
                if (b.a) {
                    bctx.fillStyle = cols[Math.floor(b.y/30) % cols.length];
                    bctx.fillRect(b.x, b.y, b.w, b.h);
                }
            }
        }

        bc.addEventListener('mousemove', e => {
            const r = bc.getBoundingClientRect();
            bPad.x = e.clientX - r.left - bPad.w/2;
            bPad.x = Math.max(0, Math.min(bc.width - bPad.w, bPad.x));
        });

        initBrks();

        // FLAPPY BIRD
        const fc = document.getElementById('flappyCanvas');
        const fctx = fc.getContext('2d');
        fc.width = fc.offsetWidth; fc.height = 300;
        let fGame, bird = {y: 150, v: 0, r: 15};
        let pipes = [], fSc = 0, fFrame = 0;

        function startFlappy() {
            if (fGame) return;
            bird = {y: 150, v: 0, r: 15};
            pipes = [];
            fSc = 0; fFrame = 0;
            document.getElementById('flappyScore').textContent = fSc;
            fGame = setInterval(upFlappy, 1000/60);
        }

        function upFlappy() {
            fFrame++;
            bird.v += 0.5;
            bird.y += bird.v;
            if (bird.y + bird.r > fc.height || bird.y - bird.r < 0) {
                clearInterval(fGame); fGame = null; alert('Game Over! Score: ' + fSc); return;
            }
            if (fFrame % 90 === 0) {
                const gap = 120, h = Math.random() * (fc.height - gap - 100) + 50;
                pipes.push({x: fc.width, top: h, bot: h + gap});
            }
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].x -= 2;
                if (pipes[i].x + 50 < 0) pipes.splice(i, 1);
                else {
                    if (pipes[i].x < 100 && pipes[i].x + 50 > 60) {
                        if (bird.y - bird.r < pipes[i].top || bird.y + bird.r > pipes[i].bot) {
                            clearInterval(fGame); fGame = null; alert('Game Over! Score: ' + fSc); return;
                        }
                    }
                    if (pipes[i].x + 50 === 80) {
                        fSc++; document.getElementById('flappyScore').textContent = fSc;
                    }
                }
            }
            drFlappy();
        }

        function drFlappy() {
            fctx.fillStyle = '#87CEEB'; fctx.fillRect(0, 0, fc.width, fc.height);
            fctx.fillStyle = '#0f0';
            for (let p of pipes) {
                fctx.fillRect(p.x, 0, 50, p.top);
                fctx.fillRect(p.x, p.bot, 50, fc.height - p.bot);
            }
            fctx.beginPath(); fctx.arc(80, bird.y, bird.r, 0, Math.PI*2);
            fctx.fillStyle = '#ff0'; fctx.fill(); fctx.closePath();
        }

        fc.addEventListener('click', () => { if (fGame) bird.v = -8; });
        document.addEventListener('keydown', e => { 
            if (e.code === 'Space' && fGame) { e.preventDefault(); bird.v = -8; }
        });

        // SPACE INVADERS
        const ic = document.getElementById('invadersCanvas');
        const ictx = ic.getContext('2d');
        ic.width = ic.offsetWidth; ic.height = 300;
        let iGame, ship = {x: ic