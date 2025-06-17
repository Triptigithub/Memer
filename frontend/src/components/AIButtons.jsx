import React, { useState } from 'react';
import { Sparkles, Heart, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function AIButtons({ tags }) {
  const [generatedCaption, setGeneratedCaption] = useState(null);
  const [generatedMood, setGeneratedMood] = useState(null);
  const [isLoadingCaption, setIsLoadingCaption] = useState(false);
  const [isLoadingMood, setIsLoadingMood] = useState(false);

  const handleCaptionGeneration = async () => {
    if (isLoadingCaption) return;

    setIsLoadingCaption(true);
    try {
      const res = await api.post('/ai/caption', { tags });
      setGeneratedCaption(res.data.data.caption);
    } catch (error) {
      console.error(error);
      alert('Failed to generate caption.');
    } finally {
      setIsLoadingCaption(false);
    }
  };

  const handleMoodGeneration = async () => {
    if (isLoadingMood) return;

    setIsLoadingMood(true);
    try {
      const res = await api.post('/ai/vibe', { tags });
      setGeneratedMood(res.data.data.vibe);
    } catch (error) {
      console.error(error);
      alert('Failed to generate mood.');
    } finally {
      setIsLoadingMood(false);
    }
  };

  const buttonBaseClasses =
    'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm font-medium';

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={handleCaptionGeneration}
          className={`${buttonBaseClasses} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`}
          disabled={isLoadingCaption}
        >
          {isLoadingCaption ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Generate Caption
        </button>

        <button
          onClick={handleMoodGeneration}
          className={`${buttonBaseClasses} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600`}
          disabled={isLoadingMood}
        >
          {isLoadingMood ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
          Generate Mood
        </button>
      </div>

      {generatedCaption && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 animate-fade-in">
          <p className="text-sm text-purple-800 italic font-medium">
            "{generatedCaption}"
          </p>
        </div>
      )}

      {generatedMood && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 animate-fade-in">
          <p className="text-sm text-orange-800">
            <span className="font-semibold">Mood:</span> {generatedMood}
          </p>
        </div>
      )}
    </div>
  );
}
