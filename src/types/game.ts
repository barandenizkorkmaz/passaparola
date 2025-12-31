export interface Question {
  letter: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface GameState {
  currentLetterIndex: number;
  score: number;
  answers: { [key: string]: 'correct' | 'incorrect' | 'passed' | null };
  timeRemaining: number;
  isGameActive: boolean;
  gameComplete: boolean;
}

export type LetterStatus = 'current' | 'correct' | 'incorrect' | 'passed' | 'pending';
