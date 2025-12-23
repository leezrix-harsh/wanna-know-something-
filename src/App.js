import React, { useState } from 'react';
import Game from './components/Game';
import Confession from './components/Confession';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('game'); // 'game' or 'confession'

    const handleMoonClick = () => {
        setCurrentView('confession');
    };

    return (
        <div className="App">
            {currentView === 'game' && (
                <Game onMoonClick={handleMoonClick} />
            )}
            {currentView === 'confession' && (
                <Confession />
            )}
        </div>
    );
}

export default App;
