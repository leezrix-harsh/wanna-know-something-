// Game Logic Module for React
const TILE_SIZE = 40;
const PLAYER_SPEED = 5.0;

const GAME_STATE = {
    PLAYING: 'PLAYING',
    DIALOGUE: 'DIALOGUE',
    TELESCOPE: 'TELESCOPE'
};

export function initializeGame(canvas, onMoonClick) {
    const ctx = canvas.getContext('2d');

    const gameState = {
        ctx,
        canvas,
        onMoonClick,
        currentState: GAME_STATE.PLAYING,
        map: {
            width: 1600,
            height: 1200,
            trees: [],
            flowers: [],
            lanterns: [],
            houses: [],
            cats: [],
            npcs: [],
            telescopeZone: { x: 1400, y: 200, width: 100, height: 100 }
        },
        player: {
            x: 100,
            y: 1000,
            width: 30,
            height: 30,
            color: '#e94560',
            direction: 'down',
            isMoving: false,
            stepTimer: 0
        },
        camera: {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        },
        dialogueQueue: [],
        currentSpeaker: "",
        dialogueCallback: null,
        keys: {
            ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
            w: false, s: false, a: false, d: false, " ": false
        },
        animationId: null,
        telescopeStars: [],
        telescopeStep: 0 // 0: First text, 1: Second text, 2: Ready
    };

    // Initialize map
    initMap(gameState);

    // Set up event listeners
    setupEventListeners(gameState);

    // Initialize telescope stars once
    for (let i = 0; i < 100; i++) {
        gameState.telescopeStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1
        });
    }

    return gameState;
}

function initMap(state) {
    const { map } = state;

    // Borders
    for (let x = 0; x < map.width; x += TILE_SIZE) {
        map.trees.push({ x, y: 0, width: TILE_SIZE, height: TILE_SIZE });
        map.trees.push({ x, y: map.height - TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE });
    }
    for (let y = TILE_SIZE; y < map.height - TILE_SIZE; y += TILE_SIZE) {
        map.trees.push({ x: 0, y, width: TILE_SIZE, height: TILE_SIZE });
        map.trees.push({ x: map.width - TILE_SIZE, y, width: TILE_SIZE, height: TILE_SIZE });
    }

    // Forest
    for (let i = 0; i < 200; i++) {
        const x = Math.floor(Math.random() * map.width / TILE_SIZE) * TILE_SIZE;
        const y = Math.floor(Math.random() * map.height / TILE_SIZE) * TILE_SIZE;
        if (x < 400 && y > 700) continue;
        if (x > 1200 && y < 400) continue;
        map.trees.push({ x, y, width: TILE_SIZE, height: TILE_SIZE });
    }

    // Houses
    // Original cluster
    map.houses.push({ x: 150, y: 850, width: 100, height: 80, color: '#4a4e69' });
    map.houses.push({ x: 350, y: 900, width: 100, height: 80, color: '#4a4e69' });
    map.houses.push({ x: 250, y: 700, width: 120, height: 90, color: '#4a4e69' });

    // Top area
    map.houses.push({ x: 600, y: 100, width: 110, height: 85, color: '#4a4e69' });
    map.houses.push({ x: 800, y: 150, width: 100, height: 80, color: '#4a4e69' });

    // Bottom Right area
    map.houses.push({ x: 1300, y: 900, width: 120, height: 90, color: '#4a4e69' });
    map.houses.push({ x: 1450, y: 850, width: 100, height: 80, color: '#4a4e69' });

    // Cats
    for (let i = 0; i < 5; i++) {
        map.cats.push({
            x: 200 + Math.random() * 200,
            y: 800 + Math.random() * 200,
            color: Math.random() > 0.5 ? '#ffffff' : '#000000',
            state: 'idle',
            timer: 0
        });
    }

    // Flowers
    for (let i = 0; i < 200; i++) {
        map.flowers.push({
            x: Math.random() * map.width,
            y: Math.random() * map.height,
            size: Math.random() * 3 + 2,
            color: Math.random() > 0.5 ? '#a8dadc' : '#f1faee',
            pulseOffset: Math.random() * 100
        });
    }

    // Lanterns
    const path = [
        { x: 200, y: 900 }, { x: 400, y: 800 }, { x: 600, y: 600 },
        { x: 800, y: 500 }, { x: 1000, y: 300 }, { x: 1300, y: 250 }
    ];
    path.forEach(p => map.lanterns.push({ x: p.x, y: p.y, width: 20, height: 30 }));

    // NPCs
    const npcData = [
        { x: 250, y: 950, color: '#ff9f1c', name: "Asep", dialogue: ["Hey! You look great.", "Don't forget to take a deep breath.", "The view from the hill is amazing tonight.", "Go get 'em!"] },
        { x: 400, y: 850, color: '#ff006e', name: "Sapri", dialogue: ["Lovely evening for a walk, isn't it?", "My cat ran off somewhere... probably chasing fireflies."] },
        { x: 700, y: 600, color: '#2ec4b6', name: "Supri", dialogue: ["Ah, a fellow stargazer.", "The telescope is set up on the hill.", "Just follow the lanterns North-East.", "The moon is singing tonight."] },
        { x: 900, y: 400, color: '#f72585', name: "Herman", dialogue: ["The stars are especially bright tonight.", "I come here every evening to watch the sky.", "There's something magical about this place."] },
        { x: 500, y: 500, color: '#4cc9f0', name: "Bambang", dialogue: ["Beautiful night for a stroll, isn't it?", "I love the peace and quiet out here."] },
        // New Woman NPCs (no dialogue, just walking)
        { x: 700, y: 200, color: '#ff99c8', name: "Villager", dialogue: [] },
        { x: 1200, y: 800, color: '#e0aaff', name: "Villager", dialogue: [] },
        { x: 100, y: 400, color: '#ffc6ff', name: "Villager", dialogue: [] }
    ];

    npcData.forEach(data => {
        map.npcs.push({
            ...data,
            width: 30,
            height: 30,
            walkTimer: 0,
            walkState: 'idle',
            targetX: data.x,
            targetY: data.y,
            direction: 'down'
        });
    });
}

function setupEventListeners(state) {
    const handleKeyDown = (e) => {
        if (state.keys.hasOwnProperty(e.key)) state.keys[e.key] = true;
        if (e.key === " ") {
            if (state.currentState === GAME_STATE.PLAYING) checkForInteraction(state);
            else if (state.currentState === GAME_STATE.DIALOGUE) advanceDialogue(state);
        }
    };

    const handleKeyUp = (e) => {
        if (state.keys.hasOwnProperty(e.key)) state.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Store cleanup function
    state.cleanup = () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
}

export function handleCanvasClick(e, canvas, state) {
    if (state.currentState === GAME_STATE.TELESCOPE) {
        // Advance text sequence
        if (state.telescopeStep < 2) {
            state.telescopeStep++;
            state.textOpacity = 0; // Reset opacity for fade-in of new text
            state.lastTextChange = Date.now();
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const moonX = canvas.width / 2;
        const moonY = canvas.height / 2;
        const moonRadius = 100;

        const distance = Math.sqrt((clickX - moonX) ** 2 + (clickY - moonY) ** 2);

        if (distance <= moonRadius) {
            state.onMoonClick();
        }
    }
}

function updateCats(state) {
    state.map.cats.forEach(cat => {
        if (cat.state === 'idle') {
            cat.timer++;
            if (cat.timer > 100 && Math.random() < 0.05) {
                cat.state = 'walk';
                cat.timer = 0;
                cat.dx = (Math.random() - 0.5) * 2;
                cat.dy = (Math.random() - 0.5) * 2;
            }
        } else if (cat.state === 'walk') {
            cat.x += cat.dx;
            cat.y += cat.dy;
            cat.timer++;
            if (cat.timer > 50) {
                cat.state = 'idle';
                cat.timer = 0;
            }
        }
    });
}

function updateNPCs(state) {
    state.map.npcs.forEach(npc => {
        if (npc.walkState === 'idle') {
            npc.walkTimer++;
            if (npc.walkTimer > 120 && Math.random() < 0.03) {
                npc.walkState = 'walking';
                npc.walkTimer = 0;
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 150;
                npc.targetX = Math.max(50, Math.min(state.map.width - 50, npc.x + Math.cos(angle) * distance));
                npc.targetY = Math.max(50, Math.min(state.map.height - 50, npc.y + Math.sin(angle) * distance));
            }
        } else if (npc.walkState === 'walking') {
            const dx = npc.targetX - npc.x;
            const dy = npc.targetY - npc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 5) {
                npc.walkState = 'idle';
                npc.walkTimer = 0;
            } else {
                npc.x += dx / distance;
                npc.y += dy / distance;
                npc.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
            }
        }
    });
}

function checkCollision(state, newX, newY) {
    const rect = { x: newX, y: newY, width: state.player.width, height: state.player.height };
    return state.map.trees.some(t => rectIntersect(rect, t)) ||
        state.map.houses.some(h => rectIntersect(rect, { x: h.x, y: h.y + 20, width: h.width, height: h.height - 20 })) ||
        state.map.npcs.some(n => rectIntersect(rect, n));
}

function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
}

function handleMovement(state) {
    state.player.isMoving = false;
    let dx = 0, dy = 0;

    if (state.keys.ArrowUp || state.keys.w) { dy = -PLAYER_SPEED; state.player.direction = 'up'; }
    if (state.keys.ArrowDown || state.keys.s) { dy = PLAYER_SPEED; state.player.direction = 'down'; }
    if (state.keys.ArrowLeft || state.keys.a) { dx = -PLAYER_SPEED; state.player.direction = 'left'; }
    if (state.keys.ArrowRight || state.keys.d) { dx = PLAYER_SPEED; state.player.direction = 'right'; }

    if (dx !== 0 || dy !== 0) {
        const newX = state.player.x + dx;
        const newY = state.player.y + dy;

        if (!checkCollision(state, newX, state.player.y)) state.player.x = newX;
        if (!checkCollision(state, state.player.x, newY)) state.player.y = newY;

        state.player.isMoving = true;
        state.player.stepTimer++;
        state.player.x = Math.max(0, Math.min(state.map.width - state.player.width, state.player.x));
        state.player.y = Math.max(0, Math.min(state.map.height - state.player.height, state.player.y));
    }
}

function updateCamera(state) {
    state.camera.x = Math.max(0, Math.min(state.map.width - state.camera.width,
        state.player.x + state.player.width / 2 - state.camera.width / 2));
    state.camera.y = Math.max(0, Math.min(state.map.height - state.camera.height,
        state.player.y + state.player.height / 2 - state.camera.height / 2));
}

function drawHuman(ctx, x, y, color, direction, isMoving, stepTimer) {
    const cx = x + 15, cy = y + 15, headSize = 12;
    const legOffset = isMoving ? Math.sin(stepTimer * 0.2) * 5 : 0;

    ctx.fillStyle = '#16213e';
    ctx.fillRect(cx - 6, cy + 5, 4, 10 + legOffset);
    ctx.fillRect(cx + 2, cy + 5, 4, 10 - legOffset);
    ctx.fillStyle = color;
    ctx.fillRect(cx - 8, cy - 8, 16, 18);
    ctx.fillStyle = '#fca311';
    ctx.fillRect(cx - 9, cy - 10, 18, 4);
    if (isMoving) ctx.fillRect(cx + 8, cy - 8, 4, 6);
    ctx.fillStyle = '#f1c27d';
    ctx.beginPath();
    ctx.arc(cx, cy - 12, headSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a2e';
    if (direction === 'left') ctx.fillRect(cx - 8, cy - 14, 3, 3);
    else if (direction === 'right') ctx.fillRect(cx + 5, cy - 14, 3, 3);
    else {
        ctx.fillRect(cx - 4, cy - 14, 3, 3);
        ctx.fillRect(cx + 1, cy - 14, 3, 3);
    }
}

function drawHouse(ctx, house) {
    ctx.fillStyle = house.color;
    ctx.fillRect(house.x, house.y + 20, house.width, house.height - 20);
    ctx.fillStyle = '#22223b';
    ctx.beginPath();
    ctx.moveTo(house.x - 10, house.y + 20);
    ctx.lineTo(house.x + house.width / 2, house.y - 10);
    ctx.lineTo(house.x + house.width + 10, house.y + 20);
    ctx.fill();
    ctx.fillStyle = '#fca311';
    ctx.globalAlpha = 0.8 + Math.sin(Date.now() / 500) * 0.2;
    ctx.fillRect(house.x + 20, house.y + 40, 20, 20);
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(house.x + house.width - 40, house.y + house.height - 30, 20, 30);
}

function drawMap(state) {
    const { ctx, map } = state;
    const time = Date.now() / 1000;

    map.flowers.forEach(f => {
        const pulse = (Math.sin(time * 2 + f.pulseOffset) + 1) / 2 * 0.5 + 0.5;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    map.houses.forEach(h => drawHouse(ctx, h));

    ctx.fillStyle = '#050a14';
    map.trees.forEach(tree => {
        ctx.fillRect(tree.x, tree.y, tree.width, tree.height);
        ctx.fillStyle = '#0f1c2e';
        ctx.beginPath();
        ctx.moveTo(tree.x, tree.y + tree.height);
        ctx.lineTo(tree.x + tree.width / 2, tree.y);
        ctx.lineTo(tree.x + tree.width, tree.y + tree.height);
        ctx.fill();
        ctx.fillStyle = '#050a14';
    });

    map.lanterns.forEach(l => {
        ctx.fillStyle = '#4a4e69';
        ctx.fillRect(l.x + 8, l.y + 10, 4, 20);
        ctx.fillStyle = '#fca311';
        ctx.beginPath();
        ctx.arc(l.x + 10, l.y + 5, 8, 0, Math.PI * 2);
        ctx.fill();
        const glow = (Math.sin(time * 3) + 2) * 5;
        ctx.fillStyle = `rgba(252, 163, 17, 0.3)`;
        ctx.beginPath();
        ctx.arc(l.x + 10, l.y + 5, 8 + glow, 0, Math.PI * 2);
        ctx.fill();
    });

    map.cats.forEach(cat => {
        ctx.fillStyle = cat.color;
        ctx.fillRect(cat.x, cat.y, 15, 10);
        ctx.fillRect(cat.x, cat.y - 5, 5, 5);
        ctx.fillRect(cat.x + 15, cat.y - 5, 2, 10);
    });

    map.npcs.forEach(npc => {
        drawHuman(ctx, npc.x, npc.y, npc.color, npc.direction, npc.walkState === 'walking', Date.now() / 50);
        ctx.fillStyle = 'white';
        ctx.font = '10px Outfit';
        ctx.fillText(npc.name, npc.x - 5, npc.y - 25);
    });

    const tx = map.telescopeZone.x + 50, ty = map.telescopeZone.y + 50;
    ctx.fillStyle = '#e5e5e5';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - 15, ty + 30);
    ctx.lineTo(tx + 15, ty + 30);
    ctx.fill();
    ctx.fillStyle = '#a8dadc';
    ctx.save();
    ctx.translate(tx, ty - 10);
    ctx.rotate(-Math.PI / 4);
    ctx.fillRect(-10, -20, 20, 40);
    ctx.restore();
}

function drawTelescopeView(state) {
    const { ctx, canvas } = state;

    // Initialize text opacity if not exists
    if (state.textOpacity === undefined) {
        state.textOpacity = 0;
        state.lastTextChange = Date.now();
    }

    // Calculate time since last text change for fade effect
    const now = Date.now();
    const timeSinceChange = now - (state.lastTextChange || now);
    
    // Update text opacity with easing for smooth fade-in
    if (timeSinceChange < 1000) { // 1 second fade in
        state.textOpacity = Math.min(1, timeSinceChange / 1000);
    } else {
        state.textOpacity = 1;
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 250, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#0b0d17';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars (Static)
    ctx.fillStyle = 'white';
    state.telescopeStars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    const moonX = canvas.width / 2, moonY = canvas.height / 2 - 60, moonRadius = 100;

    // Moon gradient
    const gradient = ctx.createRadialGradient(moonX - 20, moonY - 20, 10, moonX, moonY, moonRadius);
    gradient.addColorStop(0, '#f5f5f5');
    gradient.addColorStop(0.7, '#e0e0e0');
    gradient.addColorStop(1, '#b0b0b0');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Moon craters
    ctx.fillStyle = 'rgba(180, 180, 180, 0.4)';
    [[moonX - 35, moonY - 15, 28], [moonX + 30, moonY + 25, 22], [moonX + 15, moonY - 35, 18]].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = 'rgba(160, 160, 160, 0.5)';
    [[moonX - 20, moonY + 40, 15], [moonX + 45, moonY - 10, 12], [moonX - 50, moonY + 20, 10]].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = 'rgba(140, 140, 140, 0.6)';
    for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const dist = 40 + Math.random() * 50;
        const size = 3 + Math.random() * 5;
        ctx.beginPath();
        ctx.arc(moonX + Math.cos(angle) * dist, moonY + Math.sin(angle) * dist, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw the telescope border first (moved this up in the draw order)
    ctx.restore(); // Restore the clip
    
    // Draw the telescope border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 250, 0, Math.PI * 2);
    ctx.stroke();
    
    // Save the context before any text drawing
    ctx.save();
    
    // Text styling
    const textY = canvas.height - 100; // Position at the bottom
    const textPadding = 20;
    const lineHeight = 36; // Slightly increased line height
    const glowColor = 'rgba(255, 255, 255, 0.7)'; // White glow
    
    let text = "";
    let subtext = "";
    let textSize = 28; // Slightly larger text
    let textColor = '#ffffff'; // Pure white
    
    if (state.telescopeStep === 0) {
        text = "The moon is beautiful, isn't it?";
        subtext = "(Click to continue)";
    } else if (state.telescopeStep === 1) {
        text = "But never as beautiful as you...";
        subtext = "(Click to continue)";
    } else {
        text = "Click the moon...";
        textSize = 20;
        textColor = 'rgba(255, 255, 255, 0.8)';
    }
    
    // Draw text with glow effect
    const drawTextWithGlow = (text, x, y, size, glowIntensity = 3) => {
        ctx.font = `italic ${size}px Poppins`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw glow (multiple layers for effect)
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw multiple layers for stronger glow
        for (let i = 0; i < glowIntensity; i++) {
            ctx.fillStyle = i === glowIntensity - 1 ? 
                `rgba(255, 255, 255, ${state.textOpacity})` : 
                `rgba(255, 255, 255, ${0.3 * state.textOpacity})`;
            
            ctx.fillText(text, x, y);
            ctx.shadowBlur -= 2; // Reduce glow for inner layers
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    };
    
    // Draw main text with glow
    if (text) {
        drawTextWithGlow(text, canvas.width / 2, textY, textSize, 3);
    }
    
    // Draw subtext with smaller glow if it exists
    if (subtext) {
        drawTextWithGlow(subtext, canvas.width / 2, textY + lineHeight, 16, 2);
    }

    // Restore the context after text drawing
    ctx.restore();
    
    // Make sure cursor is a pointer when over the canvas
    canvas.style.cursor = 'pointer';
}

function draw(state) {
    const { ctx, canvas } = state;

    if (state.currentState === GAME_STATE.TELESCOPE) {
        drawTelescopeView(state);
        return;
    }

    canvas.style.cursor = 'default';
    ctx.fillStyle = '#0f1c2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-state.camera.x, -state.camera.y);
    drawMap(state);
    drawHuman(ctx, state.player.x, state.player.y, state.player.color, state.player.direction,
        state.player.isMoving, state.player.stepTimer);
    ctx.restore();
}

function update(state) {
    if (state.currentState === GAME_STATE.PLAYING) {
        handleMovement(state);
        updateCamera(state);
        updateCats(state);
        updateNPCs(state);
        checkInteractionProximity(state);
    }
}

function checkInteractionProximity(state) {
    let nearInteractable = false;
    const centerPlayer = {
        x: state.player.x + state.player.width / 2,
        y: state.player.y + state.player.height / 2
    };

    if (state.map.npcs.some(npc =>
        Math.hypot(centerPlayer.x - (npc.x + 15), centerPlayer.y - (npc.y + 15)) < 60)) {
        nearInteractable = true;
    }

    const distTelescope = Math.hypot(
        state.player.x - (state.map.telescopeZone.x + 50),
        state.player.y - (state.map.telescopeZone.y + 50)
    );

    if (distTelescope < 60) nearInteractable = true;

    const interactionPrompt = document.getElementById('interaction-prompt');
    if (interactionPrompt) {
        if (nearInteractable) {
            interactionPrompt.classList.remove('hidden');
            interactionPrompt.innerText = distTelescope < 60 ? "Press SPACE to Look" : "Press SPACE";
        } else {
            interactionPrompt.classList.add('hidden');
        }
    }
}

function checkForInteraction(state) {
    const distTelescope = Math.hypot(
        state.player.x - (state.map.telescopeZone.x + 50),
        state.player.y - (state.map.telescopeZone.y + 50)
    );

    if (distTelescope < 60) {
        triggerTelescope(state);
        return;
    }

    const centerPlayer = {
        x: state.player.x + state.player.width / 2,
        y: state.player.y + state.player.height / 2
    };

    for (const npc of state.map.npcs) {
        if (Math.hypot(centerPlayer.x - (npc.x + 15), centerPlayer.y - (npc.y + 15)) < 60) {
            if (npc.dialogue.length > 0) {
                startDialogue(state, npc.name, npc.dialogue);
            }
            return;
        }
    }
}

function triggerTelescope(state) {
    if (state.currentState === GAME_STATE.TELESCOPE) return;
    state.currentState = GAME_STATE.TELESCOPE;
    state.telescopeStep = 0; // Reset sequence

    const dialogueOverlay = document.getElementById('dialogue-overlay');
    const interactionPrompt = document.getElementById('interaction-prompt');

    if (dialogueOverlay) dialogueOverlay.classList.add('hidden');
    if (interactionPrompt) interactionPrompt.classList.add('hidden');
}

function startDialogue(state, name, lines, callback) {
    state.currentState = GAME_STATE.DIALOGUE;
    state.dialogueQueue = [...lines];
    state.currentSpeaker = name;
    state.dialogueCallback = callback;

    const dialogueOverlay = document.getElementById('dialogue-overlay');
    const interactionPrompt = document.getElementById('interaction-prompt');

    if (dialogueOverlay) dialogueOverlay.classList.remove('hidden');
    if (interactionPrompt) interactionPrompt.classList.add('hidden');

    state.player.isMoving = false;
    advanceDialogue(state);
}

function advanceDialogue(state) {
    if (state.dialogueQueue.length > 0) {
        const text = state.dialogueQueue.shift();
        const dialogueText = document.getElementById('dialogue-text');
        const dialogueName = document.getElementById('dialogue-name');

        if (dialogueText) dialogueText.innerText = text;
        if (dialogueName) dialogueName.innerText = state.currentSpeaker;
    } else {
        closeDialogue(state);
    }
}

function closeDialogue(state) {
    state.currentState = GAME_STATE.PLAYING;
    const dialogueOverlay = document.getElementById('dialogue-overlay');

    if (dialogueOverlay) dialogueOverlay.classList.add('hidden');
    state.keys[" "] = false;

    if (state.dialogueCallback) {
        state.dialogueCallback();
        state.dialogueCallback = null;
    }
}

export function gameLoop(state) {
    function loop() {
        update(state);
        draw(state);
        state.animationId = requestAnimationFrame(loop);
    }

    loop();
    return state.animationId;
}
