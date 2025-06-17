import React, { useState, useContext } from 'react';
import { Upload, Image, Tag, ArrowLeft, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export default function MemeForm({ isEdit = false, initialData = null, memeId = null }) {
  const { userId } = useContext(UserContext);
  const [title, setTitle] = useState(initialData?.title || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
    try {
      if (isEdit && memeId) {
        await api.put(`/memes/${memeId}`, { title, image_url: imageUrl, tags });
      } else {
        await api.post('/memes', { title, image_url: imageUrl, tags, owner_id: userId });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error saving meme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">      
      <div className="text-center mb-8">
    
     <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent mb-2">

          {isEdit ? 'Edit Your Meme' : 'Create New Meme'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update your meme details' : 'Share your creativity with the world'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor="title">
              <Sparkles className="w-4 h-4" />
              Meme Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Give your meme a catchy title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-black input-field"
              required
            />
            <p className="text-xs text-gray-500">Make it memorable and engaging!</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor="imageUrl">
              <Image className="w-4 h-4" />
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/your-meme-image.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="text-black input-field"
              required
            />
            <p className="text-xs text-gray-500">Paste a direct link to your meme image</p>
          </div>

          {imageUrl && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Preview</label>
              <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                <img
                  src={imageUrl}
                  alt="Meme preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor="tags">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <input
              id="tags"
              type="text"
              placeholder="funny, relatable, coding, cats..."
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="text-black input-field"
            />
            <p className="text-xs text-gray-500">Separate tags with commas to help people discover your meme</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none font-medium"
              disabled={loading || !title || !imageUrl}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  {isEdit ? 'Saving Changes...' : 'Creating Meme...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {isEdit ? 'Save Changes' : 'Create Meme'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}