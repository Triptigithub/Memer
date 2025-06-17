import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Tag, Crown } from 'lucide-react';
import BidPanel from './BidPanel';
import VoteButtons from './VoteButtons';
import AIButtons from './AIButtons';
import { api } from '../services/api';

export default function MemeCard({ meme, userId }) {
  const [highestBid, setHighestBid] = useState(null);

  const fetchHighestBid = async () => {
    try {
      const { data } = await api.get(`/bids/${meme.id}`);
      setHighestBid(data.length ? data[0].credits : null);
    } catch (error) {
      console.error('Error fetching highest bid:', error);
    }
  };

  useEffect(() => {
    fetchHighestBid();
  }, [meme.id]);

  return (
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-cardHover transition-all duration-300 transform hover:-translate-y-2 p-6 animate-fade-in">
      
      {/* Meme Image */}
      <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={meme.image_url}
          alt={meme.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Meme Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
        {meme.title}
      </h2>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {meme.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
        {meme.tags.length > 3 && (
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            +{meme.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Bid and Vote Info */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
        {/* Highest Bid */}
        <div className="flex items-center gap-2">
          <Crown className={`w-4 h-4 ${highestBid != null ? 'text-yellow-500' : 'text-gray-400'}`} />
          {highestBid != null ? (
            <span className="text-sm font-semibold text-gray-700">
              Highest: <span className="text-green-600">${highestBid}</span>
            </span>
          ) : (
            <span className="text-sm text-gray-500">No bids yet</span>
          )}
        </div>

        {/* Upvotes */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            {meme.upvotes || 0} votes
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <BidPanel memeId={meme.id} userId={userId} onBidSuccess={fetchHighestBid} />
        <VoteButtons memeId={meme.id} />
        <AIButtons tags={meme.tags} />
      </div>
    </div>
  );
}
