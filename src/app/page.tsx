'use client';

import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import AlphabetCircle from '@/components/AlphabetCircle';
import { TURKISH_ALPHABET } from '@/data/questions';
import { Player } from '@/types/game';

export default function Home() {
  const {
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
    currentLetter,
    letterStatuses,
    hasNextPlayer,
    isLastPlayer,
  } = useGame();

  const [playerInputs, setPlayerInputs] = useState<{ id: string; name: string }[]>([
    { id: crypto.randomUUID(), name: '' }
  ]);
  const [tempTimeLimit, setTempTimeLimit] = useState(90);

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

  const handleStartSetup = () => {
    setShowSettings(true);
    setTempTimeLimit(gameSettings.timeLimit);
  };

  const handleAddPlayer = () => {
    setPlayerInputs([...playerInputs, { id: crypto.randomUUID(), name: '' }]);
  };

  const handleRemovePlayer = (id: string) => {
    setPlayerInputs(playerInputs.filter((input) => input.id !== id));
  };

  const handlePlayerNameChange = (id: string, name: string) => {
    setPlayerInputs(playerInputs.map((input) =>
      input.id === id ? { ...input, name } : input
    ));
  };

  const handleStartGameWithSettings = () => {
    const validPlayers = playerInputs
      .filter((input) => input.name.trim())
      .map((input) => ({
        id: input.id,
        name: input.name.trim(),
      }));

    // Update settings
    updateSettings({
      timeLimit: tempTimeLimit,
      players: validPlayers,
    });

    // Start game with players directly to avoid race condition
    if (validPlayers.length > 0) {
      startGame(0, validPlayers);
    } else {
      startGame();
    }
  };

  const handleBackToMenu = () => {
    goToMainMenu();
    setPlayerInputs([{ id: crypto.randomUUID(), name: '' }]);
    setTempTimeLimit(90);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col">
      {/* Main Menu */}
      {!gameState.isGameActive && !gameState.gameComplete && !showSettings && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 text-center">
              PASSAPAROLA
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Türkçe Kelime Oyunu
            </p>
            <button
              onClick={handleStartSetup}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Oyunu Başlat
            </button>

            {/* Leaderboard Display */}
            {leaderboard.length > 0 && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  Skor Tablosu
                </h3>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.player.id}
                      className="flex items-center justify-between bg-white rounded-lg p-3 shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {entry.player.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {entry.score}/{entry.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Settings */}
      {showSettings && !gameState.isGameActive && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Oyun Ayarları
            </h2>

            {/* Time Limit Setting */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Süre Limiti (saniye)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={tempTimeLimit}
                  onChange={(e) => setTempTimeLimit(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-blue-600 min-w-[80px]">
                  {formatTime(tempTimeLimit)}
                </span>
              </div>
            </div>

            {/* Player Names */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Oyuncular (İsteğe bağlı - çoklu oyuncu için)
              </label>
              <div className="space-y-3">
                {playerInputs.map((input, index) => (
                  <div key={input.id} className="flex gap-2">
                    <input
                      type="text"
                      value={input.name}
                      onChange={(e) => handlePlayerNameChange(input.id, e.target.value)}
                      placeholder={`Oyuncu ${index + 1} İsmi`}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    {playerInputs.length > 1 && (
                      <button
                        onClick={() => handleRemovePlayer(input.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddPlayer}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                >
                  + Oyuncu Ekle
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600 transition-all"
              >
                Geri
              </button>
              <button
                onClick={handleStartGameWithSettings}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Başla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Game */}
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

              <div className="text-center">
                {gameState.currentPlayer && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-2">
                    <div className="text-white/80 text-sm">Oyuncu</div>
                    <div className="text-xl font-bold text-white">
                      {gameState.currentPlayer.name}
                    </div>
                  </div>
                )}
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
          <div className="px-8 pb-8">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-400">
              {/* Current question */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
                    {currentLetter}
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-2xl p-4">
                    {currentQuestion && (
                      <p className="text-xl text-gray-800 font-medium">
                        {currentQuestion.question}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Answer input */}
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Cevabınızı buraya yazın..."
                  className="flex-1 px-6 py-4 text-xl border-3 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none shadow-md"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!currentAnswer.trim()}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[140px]"
                >
                  Cevapla
                </button>
                <button
                  type="button"
                  onClick={passQuestion}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[140px]"
                >
                  Pas
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.gameComplete && (
        <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            {/* Individual Player Summary */}
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
              Oyun Bitti!
            </h2>

            {gameState.currentPlayer && (
              <div className="mb-6 bg-purple-50 rounded-xl p-6 border-2 border-purple-300">
                <div className="text-center mb-4">
                  <div className="text-lg text-gray-600 mb-2">Oyuncu</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {gameState.currentPlayer.name}
                  </div>
                </div>

                <div className="flex justify-center items-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {gameState.score}
                    </div>
                    <div className="text-sm text-gray-600">
                      Doğru Cevap
                    </div>
                  </div>

                  <div className="text-4xl text-gray-300">/</div>

                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-400 mb-2">
                      {TURKISH_ALPHABET.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Toplam Soru
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Başarı Oranı</div>
                    <div className="text-4xl font-bold text-green-600">
                      {Math.round((gameState.score / TURKISH_ALPHABET.length) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show Leaderboard only for last player */}
            {isLastPlayer && leaderboard.length > 1 && (
              <div className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-400">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  🏆 Final Skor Tablosu 🏆
                </h3>

                <div className="space-y-3">
                  {leaderboard.map((entry, index) => {
                    const position = index + 1;
                    const isWinner = position === 1;

                    return (
                      <div
                        key={entry.player.id}
                        className={`flex items-center justify-between rounded-lg p-3 shadow ${
                          isWinner
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-yellow-600'
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${isWinner ? 'w-10 h-10' : 'w-8 h-8'} rounded-full flex items-center justify-center font-bold text-white shadow ${
                            position === 1 ? 'bg-yellow-600' : position === 2 ? 'bg-gray-400' : position === 3 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {position}
                          </div>
                          <div className="flex items-center gap-2">
                            {isWinner && <span className="text-lg">👑</span>}
                            <span className={`font-bold ${isWinner ? 'text-lg text-white' : 'text-base text-gray-800'}`}>
                              {entry.player.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${isWinner ? 'text-lg text-white' : 'text-base text-green-600'}`}>
                            {entry.score}/{entry.totalQuestions}
                          </div>
                          <div className={`text-xs ${isWinner ? 'text-white/90' : 'text-gray-600'}`}>
                            {entry.percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {hasNextPlayer && (
                <button
                  onClick={nextPlayer}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-green-700 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Sıradaki Oyuncu: {gameSettings.players[currentPlayerIndex + 1]?.name}
                </button>
              )}
              <button
                onClick={handleBackToMenu}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Ana Menü
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
