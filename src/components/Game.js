import React, { useEffect, useRef, useState } from 'react';
import './Game.css';
import { initializeGame, gameLoop, handleCanvasClick } from '../gameLogic';

function Game({ onMoonClick }) {
    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const gameStateRef = useRef(null);

    useEffect(() => {
        if (!gameStarted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Initialize game
        gameStateRef.current = initializeGame(canvas, onMoonClick);

        // Start game loop
        const animationId = gameLoop(gameStateRef.current);

        // Cleanup
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [gameStarted, onMoonClick]);

    const handleStartClick = () => {
        setGameStarted(true);
    };

    const handleClick = (e) => {
        if (gameStateRef.current) {
            handleCanvasClick(e, canvasRef.current, gameStateRef.current);
        }
    };

    return (
        <div className="game-container">
            <canvas
                ref={canvasRef}
                id="gameCanvas"
                width={800}
                height={600}
                onClick={handleClick}
            />

            <div className="ui-layer">
                {!gameStarted && (
                    <div className="start-screen" onClick={handleStartClick}>
                        <h1>Hi, wanna know something?</h1>
                        <p>Click if you say yes!</p>
                        <small>Use Arrow Keys or WASD to Move</small>
                    </div>
                )}

                <div id="interaction-prompt" className="hidden">
                    Press SPACE
                </div>

                <div id="dialogue-overlay" className="hidden">
                    <div id="dialogue-box">
                        <div id="dialogue-name">???</div>
                        <p id="dialogue-text">...</p>
                        <span id="dialogue-hint">Press SPACE to continue</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
