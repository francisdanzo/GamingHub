window.addEventListener('DOMContentLoaded', function() {
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
            clearInterval(sGame); sGame = null;
            showGameOver(sctx, sc.width, sc.height, 'Score: ' + sScore);
            return;
        }
        for (let s of snake) {
            if (h.x === s.x && h.y === s.y) {
                clearInterval(sGame); sGame = null;
                showGameOver(sctx, sc.width, sc.height, 'Score: ' + sScore);
                return;
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
    let iGame, ship = {x: ic.width/2-20, y: ic.height-40, w: 40, h: 20}, invaders = [], shots = [], iScore = 0, iLives = 3;

    function startInvaders() {
        if (iGame) return;
        iScore = 0; iLives = 3;
        document.getElementById('invadersScore').textContent = iScore;
        document.getElementById('invadersLives').textContent = iLives;
        ship.x = ic.width/2-20;
        invaders = [];
        shots = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 10; c++) {
                invaders.push({x: 40+c*50, y: 40+r*40, w: 30, h: 20, a: true});
            }
        }
        iGame = setInterval(upInvaders, 1000/60);
    }

    document.addEventListener('keydown', e => {
        if (!iGame) return;
        if (e.key === 'ArrowLeft') ship.x -= 20;
        if (e.key === 'ArrowRight') ship.x += 20;
        if (e.code === 'Space') shots.push({x: ship.x+ship.w/2-2, y: ship.y, w: 4, h: 10});
        ship.x = Math.max(0, Math.min(ic.width-ship.w, ship.x));
    });

    function upInvaders() {
        for (let s of shots) s.y -= 8;
        for (let inv of invaders) if (inv.a) inv.x += Math.sin(Date.now()/500)*2;
        for (let s of shots) {
            for (let inv of invaders) {
                if (inv.a && s.x < inv.x+inv.w && s.x+s.w > inv.x && s.y < inv.y+inv.h && s.y+s.h > inv.y) {
                    inv.a = false; s.y = -100; iScore += 5;
                    document.getElementById('invadersScore').textContent = iScore;
                }
            }
        }
        shots = shots.filter(s => s.y > -20);
        if (invaders.some(inv => inv.a && inv.y+inv.h > ship.y)) {
            iLives--;
            document.getElementById('invadersLives').textContent = iLives;
            if (iLives === 0) { clearInterval(iGame); iGame = null; alert('Game Over! Score: '+iScore); return; }
            for (let inv of invaders) inv.y -= 40;
        }
        drInvaders();
    }

    function drInvaders() {
        ictx.fillStyle = '#000'; ictx.fillRect(0, 0, ic.width, ic.height);
        ictx.fillStyle = '#0ff'; ictx.fillRect(ship.x, ship.y, ship.w, ship.h);
        for (let inv of invaders) if (inv.a) {
            ictx.fillStyle = '#f0f'; ictx.fillRect(inv.x, inv.y, inv.w, inv.h);
        }
        ictx.fillStyle = '#ff0';
        for (let s of shots) ictx.fillRect(s.x, s.y, s.w, s.h);
    }

    // TETRIS
    const tc = document.getElementById('tetrisCanvas');
    const tctx = tc.getContext('2d');
    tc.width = tc.offsetWidth; tc.height = 300;
    let tGame, tGrid, tPiece, tScore = 0;
    const tRows = 20, tCols = 10, tSize = tc.width/tCols;
    const tShapes = [
        [[1,1,1,1]], [[1,1],[1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]], [[1,1,1],[0,1,0]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]]
    ];
    function startTetris() {
        if (tGame) return;
        tGrid = Array.from({length:tRows},()=>Array(tCols).fill(0));
        tScore = 0;
        document.getElementById('tetrisScore').textContent = tScore;
        newTPiece();
        tGame = setInterval(upTetris, 400);
    }
    function newTPiece() {
        const s = tShapes[Math.floor(Math.random()*tShapes.length)];
        tPiece = {shape:s, x:3, y:0};
    }
    function upTetris() {
        if (!moveTPiece(0,1)) {
            placeTPiece();
            clearTLines();
            newTPiece();
            if (!moveTPiece(0,0)) { clearInterval(tGame); tGame=null; alert('Game Over! Score: '+tScore); }
        }
        drTetris();
    }
    function moveTPiece(dx,dy) {
        const {shape,x,y} = tPiece;
        for (let r=0;r<shape.length;r++) for (let c=0;c<shape[0].length;c++) {
            if (shape[r][c]) {
                let nx=x+c+dx, ny=y+r+dy;
                if (nx<0||nx>=tCols||ny>=tRows||(ny>=0&&tGrid[ny][nx])) return false;
            }
        }
        tPiece.x+=dx; tPiece.y+=dy; return true;
    }
    document.addEventListener('keydown',e=>{
        if (!tGame) return;
        if (e.key==='ArrowLeft') moveTPiece(-1,0);
        if (e.key==='ArrowRight') moveTPiece(1,0);
        if (e.key==='ArrowDown') moveTPiece(0,1);
        if (e.key==='ArrowUp') rotateTPiece();
        drTetris();
    });
    function rotateTPiece() {
        const s = tPiece.shape;
        const rot = s[0].map((_,i)=>s.map(r=>r[i])).reverse();
        const old = tPiece.shape;
        tPiece.shape = rot;
        if (!moveTPiece(0,0)) tPiece.shape = old;
    }
    function placeTPiece() {
        const {shape,x,y} = tPiece;
        for (let r=0;r<shape.length;r++) for (let c=0;c<shape[0].length;c++) {
            if (shape[r][c]&&y+r>=0) tGrid[y+r][x+c]=1;
        }
    }
    function clearTLines() {
        for (let r=tRows-1;r>=0;r--) {
            if (tGrid[r].every(v=>v)) {
                tGrid.splice(r,1);
                tGrid.unshift(Array(tCols).fill(0));
                tScore+=10;
                document.getElementById('tetrisScore').textContent = tScore;
            }
        }
    }
    function drTetris() {
        tctx.fillStyle='#000'; tctx.fillRect(0,0,tc.width,tc.height);
        for (let r=0;r<tRows;r++) for (let c=0;c<tCols;c++) {
            if (tGrid[r][c]) { tctx.fillStyle='#0ff'; tctx.fillRect(c*tSize,r*tSize,tSize,tSize); }
        }
        const {shape,x,y} = tPiece;
        tctx.fillStyle='#f0f';
        for (let r=0;r<shape.length;r++) for (let c=0;c<shape[0].length;c++) {
            if (shape[r][c]) tctx.fillRect((x+c)*tSize,(y+r)*tSize,tSize,tSize);
        }
    }

    // ASTEROID
    const ac = document.getElementById('asteroidCanvas');
    const actx = ac.getContext('2d');
    ac.width = ac.offsetWidth; ac.height = 300;
    let aGame, shipA = {x: ac.width/2, y: ac.height/2, r: 15, dx:0, dy:0}, asteroids = [], aScore=0;
    function startAsteroid() {
        if (aGame) return;
        aScore=0; document.getElementById('asteroidScore').textContent=aScore;
        shipA.x=ac.width/2; shipA.y=ac.height/2; shipA.dx=0; shipA.dy=0;
        asteroids = Array.from({length:5},()=>({x:Math.random()*ac.width,y:Math.random()*ac.height,r:20+Math.random()*20,dx:2*Math.random()-1,dy:2*Math.random()-1}));
        aGame=setInterval(upAsteroid,1000/60);
    }
    document.addEventListener('keydown',e=>{
        if (!aGame) return;
        if (e.key==='ArrowLeft') shipA.dx-=0.5;
        if (e.key==='ArrowRight') shipA.dx+=0.5;
        if (e.key==='ArrowUp') shipA.dy-=0.5;
        if (e.code==='Space') { aScore++; document.getElementById('asteroidScore').textContent=aScore; }
    });
    function upAsteroid() {
        shipA.x+=shipA.dx; shipA.y+=shipA.dy;
        shipA.x=(shipA.x+ac.width)%ac.width; shipA.y=(shipA.y+ac.height)%ac.height;
        for (let ast of asteroids) {
            ast.x+=ast.dx; ast.y+=ast.dy;
            ast.x=(ast.x+ac.width)%ac.width; ast.y=(ast.y+ac.height)%ac.height;
            if (Math.hypot(shipA.x-ast.x,shipA.y-ast.y)<shipA.r+ast.r) {
                clearInterval(aGame); aGame=null; alert('Game Over! Score: '+aScore); return;
            }
        }
        drAsteroid();
    }
    function drAsteroid() {
        actx.fillStyle='#000'; actx.fillRect(0,0,ac.width,ac.height);
        actx.fillStyle='#0ff'; actx.beginPath(); actx.arc(shipA.x,shipA.y,shipA.r,0,Math.PI*2); actx.fill();
        actx.fillStyle='#f0f';
        for (let ast of asteroids) { actx.beginPath(); actx.arc(ast.x,ast.y,ast.r,0,Math.PI*2); actx.fill(); }
    }

    // MEMORY
    const mc = document.getElementById('memoryCanvas');
    const mctx = mc.getContext('2d');
    mc.width = mc.offsetWidth; mc.height = 300;
    let mGame, mCards=[], mOpen=[], mScore=0;
    function startMemory() {
        mScore=0; document.getElementById('memoryScore').textContent=mScore;
        mCards = Array.from({length:16},(_,i)=>({id:i%8,open:false,found:false})).sort(()=>Math.random()-0.5);
        drMemory();
    }
    mc.addEventListener('click',e=>{
        const x=Math.floor(e.offsetX/(mc.width/4)),y=Math.floor(e.offsetY/(mc.height/4));
        const idx=y*4+x;
        if (mCards[idx].open||mCards[idx].found) return;
        mCards[idx].open=true; mOpen.push(idx);
        drMemory();
        if (mOpen.length===2) {
            setTimeout(()=>{
                if (mCards[mOpen[0]].id===mCards[mOpen[1]].id) {
                    mCards[mOpen[0]].found=true; mCards[mOpen[1]].found=true; mScore++;
                    document.getElementById('memoryScore').textContent=mScore;
                }
                mCards[mOpen[0]].open=false; mCards[mOpen[1]].open=false; mOpen=[];
                drMemory();
            },700);
        }
    });
    function drMemory() {
        mctx.fillStyle='#000'; mctx.fillRect(0,0,mc.width,mc.height);
        for(let i=0;i<16;i++){
            const x=i%4,y=Math.floor(i/4);
            mctx.strokeStyle='#fff'; mctx.strokeRect(x*mc.width/4,y*mc.height/4,mc.width/4-4,mc.height/4-4);
            if(mCards[i].open||mCards[i].found){
                mctx.fillStyle='#0ff'; mctx.fillRect(x*mc.width/4+4,y*mc.height/4+4,mc.width/4-8,mc.height/4-8);
                mctx.fillStyle='#fff'; mctx.fillText(mCards[i].id,x*mc.width/4+mc.width/8,y*mc.height/4+mc.height/8);
            }
        }
    }

    // MAZE RUNNER
    const mz = document.getElementById('mazeCanvas');
    const mzctx = mz.getContext('2d');
    mz.width = mz.offsetWidth; mz.height = 300;
    let mzGame, mzMaze, mzPlayer, mzTime=0, mzTimer;
    function startMaze() {
        mzMaze = Array.from({length:10},()=>Array(10).fill(0));
        for(let i=0;i<30;i++) mzMaze[Math.floor(Math.random()*10)][Math.floor(Math.random()*10)]=1;
        mzPlayer={x:0,y:0}; mzTime=0;
        document.getElementById('mazeTime').textContent=mzTime;
        mzTimer=setInterval(()=>{mzTime++;document.getElementById('mazeTime').textContent=mzTime;},1000);
        mzGame=true; drMaze();
    }
    document.addEventListener('keydown',e=>{
        if(!mzGame) return;
        let nx=mzPlayer.x,ny=mzPlayer.y;
        if(e.key==='ArrowLeft') nx--;
        if(e.key==='ArrowRight') nx++;
        if(e.key==='ArrowUp') ny--;
        if(e.key==='ArrowDown') ny++;
        if(nx<0||nx>9||ny<0||ny>9||mzMaze[ny][nx]) return;
        mzPlayer.x=nx; mzPlayer.y=ny;
        drMaze();
        if(nx===9&&ny===9){mzGame=false;clearInterval(mzTimer);alert('Bravo! Temps: '+mzTime+'s');}
    });
    function drMaze() {
        mzctx.fillStyle='#000'; mzctx.fillRect(0,0,mz.width,mz.height);
        for(let y=0;y<10;y++)for(let x=0;x<10;x++){
            if(mzMaze[y][x]){mzctx.fillStyle='#f00';mzctx.fillRect(x*30,y*30,30,30);}
        }
        mzctx.fillStyle='#0ff';mzctx.fillRect(mzPlayer.x*30,mzPlayer.y*30,30,30);
        mzctx.fillStyle='#0f0';mzctx.fillRect(9*30,9*30,30,30);
    }

    // CATCH & DODGE
    const cc = document.getElementById('catchCanvas');
    const cctx = cc.getContext('2d');
    cc.width = cc.offsetWidth; cc.height = 300;
    let cGame, cPlayer={x:cc.width/2,y:cc.height-30,w:40,h:20}, cFruits=[], cScore=0, cLives=3;
    function startCatch() {
        cScore=0; cLives=3;
        document.getElementById('catchScore').textContent=cScore;
        document.getElementById('catchLives').textContent=cLives;
        cPlayer.x=cc.width/2;
        cFruits=[];
        cGame=setInterval(upCatch,1000/60);
    }
    cc.addEventListener('mousemove',e=>{
        const r=cc.getBoundingClientRect();
        cPlayer.x=e.clientX-r.left-cPlayer.w/2;
        cPlayer.x=Math.max(0,Math.min(cc.width-cPlayer.w,cPlayer.x));
    });
    function upCatch() {
        if(Math.random()<0.03) cFruits.push({x:Math.random()*cc.width,y:0,w:20,h:20,type:Math.random()<0.7?'good':'bad'});
        for(let f of cFruits) f.y+=4;
        for(let f of cFruits) {
            if(f.y>cc.height) f.y=-100;
            if(f.x<cPlayer.x+cPlayer.w&&f.x+f.w>cPlayer.x&&f.y<cPlayer.y+cPlayer.h&&f.y+f.h>cPlayer.y){
                if(f.type==='good'){cScore++;document.getElementById('catchScore').textContent=cScore;}
                else{cLives--;document.getElementById('catchLives').textContent=cLives;if(cLives===0){clearInterval(cGame);cGame=null;alert('Game Over! Score: '+cScore);}}
                f.y=-100;
            }
        }
        cFruits=cFruits.filter(f=>f.y>-50);
        drCatch();
    }
    function drCatch() {
        cctx.fillStyle='#000';cctx.fillRect(0,0,cc.width,cc.height);
        cctx.fillStyle='#0ff';cctx.fillRect(cPlayer.x,cPlayer.y,cPlayer.w,cPlayer.h);
        for(let f of cFruits){
            cctx.fillStyle=f.type==='good'?'#0f0':'#f00';
            cctx.fillRect(f.x,f.y,f.w,f.h);
        }
    }

    function showGameOver(ctx, width, height, scoreText) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ff00ff";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2 - 20);
        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "#00ffff";
        ctx.fillText(scoreText, width / 2, height / 2 + 30);
        ctx.restore();
    }

    window.startSnake = startSnake;
    window.pauseSnake = pauseSnake;
    window.startPong = startPong;
    window.resetPong = resetPong;
    window.startBreakout = startBreakout;
    window.resetBreakout = resetBreakout;
    window.startFlappy = startFlappy;
    window.startInvaders = startInvaders;
    window.startTetris = startTetris;
    window.startAsteroid = startAsteroid;
    window.startMemory = startMemory;
    window.startMaze = startMaze;
    window.startCatch = startCatch;
});