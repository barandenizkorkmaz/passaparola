import { useState, useEffect, useCallback } from 'react';
import { GameState, GameSettings, LeaderboardEntry, LetterStatus } from '@/types/game';
import { TURKISH_ALPHABET, SAMPLE_QUESTIONS } from '@/data/questions';

const DEFAULT_TIME = 90;

export function useGame() {
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: DEFAULT_TIME,
    players: [],
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [leaderboardMap, setLeaderboardMap] = useState<Map<string, LeaderboardEntry>>(new Map());
  const [showSettings, setShowSettings] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    currentLetterIndex: 0,
    score: 0,
    answers: {},
    timeRemaining: DEFAULT_TIME,
    isGameActive: false,
    gameComplete: false,
    currentPlayer: undefined,
  });

  const [currentAnswer, setCurrentAnswer] = useState('');

  // Timer effect
  useEffect(() => {
    if (!gameState.isGameActive || gameState.gameComplete) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          return { ...prev, timeRemaining: 0, isGameActive: false, gameComplete: true };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameActive, gameState.gameComplete]);

  // Auto-save to leaderboard when game completes
  useEffect(() => {
    if (gameState.gameComplete && gameState.currentPlayer) {
      const playerId = gameState.currentPlayer.id;
      const entry: LeaderboardEntry = {
        player: gameState.currentPlayer,
        score: gameState.score,
        totalQuestions: TURKISH_ALPHABET.length,
        percentage: Math.round((gameState.score / TURKISH_ALPHABET.length) * 100),
        timestamp: Date.now(),
      };

      setLeaderboardMap((prev) => {
        // Only add if this player hasn't been recorded yet
        if (prev.has(playerId)) {
          return prev;
        }
        const newMap = new Map(prev);
        newMap.set(playerId, entry);
        return newMap;
      });
    }
  }, [gameState.gameComplete, gameState.currentPlayer, gameState.score]);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    setGameSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const startGame = useCallback((playerIndex?: number) => {
    const index = playerIndex !== undefined ? playerIndex : currentPlayerIndex;
    const activePlayer = gameSettings.players[index];

    setGameState({
      currentLetterIndex: 0,
      score: 0,
      answers: {},
      timeRemaining: gameSettings.timeLimit,
      isGameActive: true,
      gameComplete: false,
      currentPlayer: activePlayer,
    });
    setCurrentAnswer('');
    setShowSettings(false);
  }, [gameSettings, currentPlayerIndex]);

  const goToMainMenu = useCallback(() => {
    setGameState({
      currentLetterIndex: 0,
      score: 0,
      answers: {},
      timeRemaining: gameSettings.timeLimit,
      isGameActive: false,
      gameComplete: false,
      currentPlayer: undefined,
    });
    setCurrentAnswer('');
    setShowSettings(false);
    setCurrentPlayerIndex(0);
    setLeaderboardMap(new Map());
  }, [gameSettings.timeLimit]);

  const getCurrentQuestion = useCallback(() => {
    const currentLetter = TURKISH_ALPHABET[gameState.currentLetterIndex];
    return SAMPLE_QUESTIONS.find((q) => q.letter === currentLetter);
  }, [gameState.currentLetterIndex]);

  const moveToNextUnansweredLetter = useCallback(() => {
    setGameState((prev) => {
      let nextIndex = (prev.currentLetterIndex + 1) % TURKISH_ALPHABET.length;
      let attempts = 0;

      while (attempts < TURKISH_ALPHABET.length) {
        const letter = TURKISH_ALPHABET[nextIndex];
        const status = prev.answers[letter];

        if (status !== 'correct' && status !== 'incorrect') {
          return { ...prev, currentLetterIndex: nextIndex };
        }

        nextIndex = (nextIndex + 1) % TURKISH_ALPHABET.length;
        attempts++;
      }

      return { ...prev, gameComplete: true, isGameActive: false };
    });
  }, []);

  const submitAnswer = useCallback(() => {
    const question = getCurrentQuestion();
    if (!question) return;

    const isCorrect =
      currentAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();

    setGameState((prev) => {
      const newAnswers = {
        ...prev.answers,
        [question.letter]: isCorrect ? ('correct' as const) : ('incorrect' as const),
      };

      const correctCount = Object.values(newAnswers).filter((a) => a === 'correct').length;

      return {
        ...prev,
        answers: newAnswers,
        score: correctCount,
      };
    });

    setCurrentAnswer('');
    moveToNextUnansweredLetter();
  }, [currentAnswer, getCurrentQuestion, moveToNextUnansweredLetter]);

  const passQuestion = useCallback(() => {
    const question = getCurrentQuestion();
    if (!question) return;

    setGameState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [question.letter]: 'passed' as const,
      },
    }));

    setCurrentAnswer('');
    moveToNextUnansweredLetter();
  }, [getCurrentQuestion, moveToNextUnansweredLetter]);

  const endGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isGameActive: false,
      gameComplete: true,
    }));
  }, []);

  const nextPlayer = useCallback(() => {
    const nextIndex = currentPlayerIndex + 1;
    setCurrentPlayerIndex(nextIndex);
    startGame(nextIndex);
  }, [currentPlayerIndex, startGame]);

  const getLetterStatus = useCallback(
    (letter: string): LetterStatus => {
      const currentLetter = TURKISH_ALPHABET[gameState.currentLetterIndex];
      const answer = gameState.answers[letter];

      if (letter === currentLetter && gameState.isGameActive) {
        return 'current';
      }

      if (answer === 'correct') return 'correct';
      if (answer === 'incorrect') return 'incorrect';
      if (answer === 'passed') return 'passed';

      return 'pending';
    },
    [gameState.currentLetterIndex, gameState.answers, gameState.isGameActive]
  );

  const letterStatuses = TURKISH_ALPHABET.reduce((acc, letter) => {
    acc[letter] = getLetterStatus(letter);
    return acc;
  }, {} as { [key: string]: LetterStatus });

  // Convert map to sorted array for display
  const leaderboard = Array.from(leaderboardMap.values()).sort((a, b) => b.score - a.score);

  const isLastPlayer = gameSettings.players.length > 0 && currentPlayerIndex >= gameSettings.players.length - 1;
  const hasNextPlayer = gameSettings.players.length > 0 && currentPlayerIndex < gameSettings.players.length - 1;

  return {
    gameState,
    gameSettings,
    currentAnswer,
    leaderboard,
    showSettings,
    currentPlayerIndex,
    setCurrentAnswer,
    setShowSettings,
    updateSettings,
    startGame,
    submitAnswer,
    passQuestion,
    endGame,
    goToMainMenu,
    nextPlayer,
    getCurrentQuestion,
    currentLetter: TURKISH_ALPHABET[gameState.currentLetterIndex],
    letterStatuses,
    hasNextPlayer,
    isLastPlayer,
  };
}
