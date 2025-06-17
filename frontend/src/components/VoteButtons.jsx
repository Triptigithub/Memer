import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { socket } from '../socket';

export default function VoteButtons({ memeId }) {
  const [loading, setLoading] = useState(false);

  const vote = async (delta) => {
    if (loading) return;
    setLoading(true);
    try {
      await api.post('/votes', { meme_id: memeId, delta });
      socket.emit('votePlaced', { memeId, delta });
    } catch (err) {
      console.error(err);
      alert('Error voting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => vote(1)}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm font-medium"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ThumbsUp className="w-4 h-4" />
        )}
        Upvote
      </button>
      <button
        onClick={() => vote(-1)}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm font-medium"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ThumbsDown className="w-4 h-4" />
        )}
        Downvote
      </button>
    </div>
  );
}