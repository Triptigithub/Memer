import React, { useState } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { socket } from '../socket';

export default function BidPanel({ memeId, userId, onBidSuccess }) {
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const handleBidSubmit = async () => {
    const amount = parseInt(bidAmount, 10);

    if (isNaN(amount) || amount < 0) return;

    setIsPlacingBid(true);
    try {
      await api.post('/bids', { meme_id: memeId, user_id: userId, credits: amount });
      socket.emit('bidPlaced', { memeId, userId, credits: amount });
      setBidAmount('');
      onBidSuccess?.();
    } catch (error) {
      console.error(error);
      alert('Failed to place bid');
    } finally {
      setIsPlacingBid(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="number"
          min="0"
          placeholder="Enter bid"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="text-black w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
          disabled={isPlacingBid}
        />
      </div>

      <button
        onClick={handleBidSubmit}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm font-medium min-w-[80px]"
        disabled={isPlacingBid || !bidAmount}
      >
        {isPlacingBid ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <DollarSign className="w-4 h-4" />
            Bid
          </>
        )}
      </button>
    </div>
  );
}
