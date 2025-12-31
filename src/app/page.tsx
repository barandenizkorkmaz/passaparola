'use client';

import { useGame } from '@/hooks/useGame';
import AlphabetCircle from '@/components/AlphabetCircle';
import { TURKISH_ALPHABET } from '@/data/questions';

export default function Home() {
  const {
    gameState,
    currentAnswer,
    setCurrentAnswer,
    startGame,
    submitAnswer,
    passQuestion,
    endGame,
    getCurrentQuestion,
    currentLetter,
    letterStatuses,
  } = useGame();

  const currentQuestion = getCurrentQuestion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAnswer.trim()) {
      submitAnswer();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col">
      {!gameState.isGameActive && !gameState.gameComplete && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Oyuna Hoş Geldiniz!
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Türk alfabesindeki her harf için soruları yanıtlayın. 90 saniyeniz var!
            </p>
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Oyunu Başlat
            </button>
          </div>
        </div>
      )}

      {gameState.isGameActive && (
        <div className="flex-1 flex flex-col">
          {/* Top bar with timer, score, and end button */}
          <div className="px-8 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-2">
                <span className="text-white/80 text-sm">Süre:</span>
                <span className={`text-3xl font-bold ${gameState.timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(gameState.timeRemaining)}
                </span>
              </div>

              <button
                onClick={endGame}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Oyunu Bitir
              </button>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-2">
                <span className="text-white/80 text-sm">Skor:</span>
                <span className="text-3xl font-bold text-green-400">
                  {gameState.score}/{TURKISH_ALPHABET.length}
                </span>
              </div>
            </div>
          </div>

          {/* Main circle in center */}
          <div className="flex-1 flex items-center justify-center">
            <AlphabetCircle
              letterStatuses={letterStatuses}
              currentLetter={currentLetter}
            />
          </div>

          {/* Bottom answer panel */}
          <div className="bg-white/95 backdrop-blur-sm border-t-4 border-purple-600 px-8 py-6">
            <div className="max-w-4xl mx-auto">
              {/* Current question */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold shadow-lg">
                    {currentLetter}
                  </div>
                  <div className="flex-1">
                    {currentQuestion && (
                      <p className="text-xl text-gray-800 font-medium">
                        {currentQuestion.question}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Answer input */}
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Cevabınızı yazın..."
                  className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!currentAnswer.trim()}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-w-[120px]"
                >
                  Cevapla
                </button>
                <button
                  type="button"
                  onClick={passQuestion}
                  className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors min-w-[120px]"
                >
                  Pas
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {gameState.gameComplete && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
              Oyun Bitti!
            </h2>
            <div className="mb-6">
              <div className="text-7xl font-bold text-blue-600 mb-2 text-center">
                {gameState.score}
              </div>
              <div className="text-xl text-gray-600 text-center">
                doğru cevap / {TURKISH_ALPHABET.length} soru
              </div>
            </div>
            <div className="mb-8 bg-blue-50 rounded-lg p-4">
              <div className="text-lg text-gray-700 text-center">
                Başarı Oranı:{' '}
                <span className="font-bold text-green-600 text-2xl">
                  {Math.round((gameState.score / TURKISH_ALPHABET.length) * 100)}%
                </span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Tekrar Oyna
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
