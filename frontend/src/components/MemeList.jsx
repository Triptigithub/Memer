import React, { useEffect, useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import MemeCard from './MemeCard';
import LoadingSpinner from './LoadingSpinner';
import { socket } from '../socket';
import { UserContext } from '../contexts/UserContext';

export default function MemeList() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { userId } = useContext(UserContext);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/memes');
      setMemes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
    socket.emit('join');
    socket.on('bidUpdate', () => fetchMemes());
    socket.on('voteUpdate', () => fetchMemes());
    return () => {
      socket.off('bidUpdate');
      socket.off('voteUpdate');
    };
  }, []);

  const filteredMemes = memes.filter(meme =>
    meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="xl" />
        <p className="text-gray-500 mt-4 text-lg">Loading amazing memes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="text-center space-y-4">
     <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
      Discover Memes
     </h1>


        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore, vote, and bid on the most creative memes in the community
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search memes or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {searchTerm && (
        <div className="text-center">
          <p className="text-gray-600">
            Found <span className="font-semibold text-primary-600">{filteredMemes.length}</span> memes
            matching "<span className="font-medium">{searchTerm}</span>"
          </p>
        </div>
      )}

      {filteredMemes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No memes found' : 'No memes yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms or clear the search to browse all memes'
              : 'Be the first to create and share a meme!'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMemes.map((meme, index) => (
            <div
              key={meme.id}
              style={{ animationDelay: `${index * 0.1}s` }} 
              className="animate-fade-in"
            >
              <MemeCard meme={meme} userId={userId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
