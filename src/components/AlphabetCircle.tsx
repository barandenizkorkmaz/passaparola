import { TURKISH_ALPHABET } from '@/data/questions';
import { LetterStatus } from '@/types/game';

interface AlphabetCircleProps {
  letterStatuses: { [key: string]: LetterStatus };
  currentLetter: string;
}

export default function AlphabetCircle({ letterStatuses, currentLetter }: AlphabetCircleProps) {
  const getLetterColor = (letter: string): string => {
    const status = letterStatuses[letter];
    if (letter === currentLetter && status === 'current') {
      return 'bg-blue-500 text-white shadow-2xl ring-4 ring-blue-300 scale-125';
    }
    if (status === 'correct') return 'bg-green-500 text-white';
    if (status === 'incorrect') return 'bg-red-500 text-white';
    if (status === 'passed') return 'bg-yellow-500 text-white';
    return 'bg-gray-300 text-gray-700';
  };

  const circleSize = 600;
  const letterSize = 56;
  const radius = 240;

  return (
    <div
      className="relative"
      style={{
        width: `${circleSize}px`,
        height: `${circleSize}px`
      }}
    >
      {TURKISH_ALPHABET.map((letter, index) => {
        const angle = (index * 360) / TURKISH_ALPHABET.length - 90;
        const radian = (angle * Math.PI) / 180;
        const x = circleSize / 2 + radius * Math.cos(radian) - letterSize / 2;
        const y = circleSize / 2 + radius * Math.sin(radian) - letterSize / 2;

        return (
          <div
            key={letter}
            className={`absolute rounded-full flex items-center justify-center font-bold text-2xl transition-all duration-300 ${getLetterColor(letter)}`}
            style={{
              width: `${letterSize}px`,
              height: `${letterSize}px`,
              left: `${x}px`,
              top: `${y}px`,
            }}
          >
            {letter}
          </div>
        );
      })}

      {/* Center display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full w-40 h-40 flex items-center justify-center shadow-2xl">
          <div className="text-6xl font-bold">{currentLetter}</div>
        </div>
      </div>
    </div>
  );
}
