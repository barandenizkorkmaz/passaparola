'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/questions/seed', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Failed to seed database' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to delete ALL questions?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/questions/seed', {
        method: 'DELETE',
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Failed to clear database' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Failed to fetch questions' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Database Management
        </h1>

        <div className="space-y-4 mb-6">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Processing...' : 'Seed Database (Add 28 Questions)'}
          </button>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Processing...' : 'Test - Fetch Random Questions'}
          </button>

          <button
            onClick={handleClear}
            disabled={loading}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Processing...' : 'Clear All Questions (Danger!)'}
          </button>

          <a
            href="/"
            className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
          >
            Back to Game
          </a>
        </div>

        {result && (
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">Result:</h2>
            <pre className="text-sm overflow-auto max-h-96 bg-white p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
