# Passaparola - Turkish Word Game

A web-based implementation of the popular Turkish word game show "Passaparola" built with Next.js, TypeScript, and Tailwind CSS.

## About the Game

Passaparola is a Turkish quiz game where players answer questions for each letter of the Turkish alphabet. Players have 90 seconds to answer as many questions as possible, going around the alphabet circle.

### Game Features

- **Turkish Alphabet Support**: All 29 letters of the Turkish alphabet (A, B, C, Ç, D, E, F, G, Ğ, H, I, İ, J, K, L, M, N, O, Ö, P, R, S, Ş, T, U, Ü, V, Y, Z)
- **Circular Board**: Visual representation of the alphabet in a circle, just like the TV show
- **Timer**: 90-second countdown timer to add excitement
- **Pass System**: Skip questions and come back to them later
- **Score Tracking**: Real-time score display showing correct answers
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Ready for Vercel or Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game!

### Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

## Project Structure

```
passaparola/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Main game page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   └── AlphabetCircle.tsx  # Circular alphabet board
│   ├── hooks/
│   │   └── useGame.ts      # Game state management
│   ├── data/
│   │   └── questions.ts    # Turkish questions database
│   └── types/
│       └── game.ts         # TypeScript type definitions
```

## How to Play

1. Click "Oyunu Başlat" (Start Game) to begin
2. Read the question for the current letter
3. Type your answer in the input field
4. Press Enter or click "Cevapla" (Answer) to submit
5. Click "Pas" (Pass) to skip a question and come back to it later
6. Try to answer all 29 questions before time runs out!

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/passaparola)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy!

## Customization

### Adding More Questions

Edit `src/data/questions.ts` to add more questions for each letter. Each question should follow this format:

```typescript
{
  letter: 'A',
  question: 'Your question here',
  answer: 'your answer',
  hint: 'Optional hint' // optional
}
```

### Adjusting Game Time

Modify the `INITIAL_TIME` constant in `src/hooks/useGame.ts` to change the game duration (in seconds).

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
