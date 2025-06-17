import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/votes/leaderboard');
        setLeaderboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const renderRankIcon = (rank) => {
    switch (rank) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRankCardStyle = (rank) => {
    switch (rank) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-lg';
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-md';
      case 2:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-md';
      default:
        return 'bg-white border-gray-200 hover:shadow-md';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="xl" />
        <p className="text-gray-500 mt-4 text-lg">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Meme Leaderboard
        </h1>
        <p className="text-gray-600 text-lg">
          The most popular memes ranked by community votes
        </p>
      </div>

      {leaderboardData.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No rankings yet</h3>
          <p className="text-gray-500">
            Be the first to vote on memes and start the competition!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${getRankCardStyle(index)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm">
                {renderRankIcon(index)}
              </div>

              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-lg">
                  {entry.title}
                </h3>
              </div>

              {index < 3 && (
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    index === 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : index === 1
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {index === 0 ? '🥇 Champion' : index === 1 ? '🥈 Runner-up' : '🥉 Third Place'}
                </div>
              )}

              <div className="text-right">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary-600">
                  <TrendingUp className="w-6 h-6" />
                  {entry.upvotes}
                </div>
                <p className="text-gray-500 text-sm">
                  {entry.upvotes === 1 ? 'vote' : 'votes'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
