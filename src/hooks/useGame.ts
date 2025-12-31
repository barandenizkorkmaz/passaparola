import { useState, useEffect, useCallback } from 'react';
import { GameState, LetterStatus } from '@/types/game';
import { TURKISH_ALPHABET, SAMPLE_QUESTIONS } from '@/data/questions';

const INITIAL_TIME = 90;

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentLetterIndex: 0,
    score: 0,
    answers: {},
    timeRemaining: INITIAL_TIME,
    isGameActive: false,
    gameComplete: false,
  });

  const [currentAnswer, setCurrentAnswer] = useState('');

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

  const startGame = useCallback(() => {
    setGameState({
      currentLetterIndex: 0,
      score: 0,
      answers: {},
      timeRemaining: INITIAL_TIME,
      isGameActive: true,
      gameComplete: false,
    });
    setCurrentAnswer('');
  }, []);

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

  return {
    gameState,
    currentAnswer,
    setCurrentAnswer,
    startGame,
    submitAnswer,
    passQuestion,
    endGame,
    getCurrentQuestion,
    currentLetter: TURKISH_ALPHABET[gameState.currentLetterIndex],
    letterStatuses,
  };
}
