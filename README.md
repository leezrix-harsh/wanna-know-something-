# Combined Love Confession Experience - React Version 💖

A beautiful interactive journey combining a 2D exploration game with a heartfelt confession message, built with React.

## 🎮 How It Works

1. **Start the Game**: Click "Click to Start" to begin your journey
2. **Explore the World**: Use Arrow Keys or WASD to move around the stargazing-themed world
3. **Talk to NPCs**: Press SPACE when near characters to hear their hints
4. **Find the Telescope**: Follow the lanterns to the northeast hill
5. **Look Through the Telescope**: Press SPACE near the telescope to see the moon
6. **Click the Moon**: Click on the beautiful moon to reveal the confession
7. **Experience the Confession**: Navigate through the heartfelt message pages

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm build
```

## 📦 Tech Stack

- **React** - UI framework
- **Framer Motion** - Smooth animations
- **Emotion/Styled** - Styled components
- **Canvas API** - 2D game rendering

## 🎨 Features

### Game Phase
- 2D top-down exploration with canvas rendering
- Walking NPCs with dialogue
- Animated cats and environmental details
- Lantern-lit path to guide you
- Beautiful stargazing atmosphere

### Confession Phase
- Multi-page story with smooth transitions
- Interactive heart animation
- **Teleporting "No" button** - Click it and it instantly teleports to a random position!
- Progress indicators
- Cosmic gradient backgrounds with floating planets

## 💝 Special Features

- **Clickable Moon**: Instead of showing text in the telescope, you click the moon to transition
- **Teleporting No Button**: On click, the "No" button instantly teleports to a random position (not smooth movement)
- **Smooth Transitions**: Beautiful fade effects between game and confession
- **Responsive Design**: Works on different screen sizes

## 📁 Project Structure

```
src/
├── App.js                 # Main app component
├── App.css               # App styles
├── index.js              # Entry point
├── index.css             # Global styles
├── gameLogic.js          # Game logic module
└── components/
    ├── Game.js           # Game component
    ├── Game.css          # Game styles
    ├── Confession.js     # Confession component
    └── Confession.css    # Confession styles
```

## 🎯 The Journey

This project combines two experiences into one seamless love confession:
- The anticipation and exploration of the game
- The heartfelt emotion of the confession message

Made with love! ✨

---

**Note**: The "No" button teleports instantly when clicked - it doesn't smoothly move, it jumps to a new random position!
