export interface Question {
  letter: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface LeaderboardEntry {
  player: Player;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: number;
}

export interface GameState {
  currentLetterIndex: number;
  score: number;
  answers: { [key: string]: 'correct' | 'incorrect' | 'passed' | null };
  timeRemaining: number;
  isGameActive: boolean;
  gameComplete: boolean;
  currentPlayer?: Player;
}

export interface GameSettings {
  timeLimit: number;
  players: Player[];
}

export type LetterStatus = 'current' | 'correct' | 'incorrect' | 'passed' | 'pending';
