import { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

const InterestsSection = ({ interests, onUpdateInterests }) => {
  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      onUpdateInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    onUpdateInterests(interests.filter(interest => interest !== interestToRemove));
  };

  return (
    <div className="bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">My Interests</h2>
          <p className="text-lg text-slate-600">
            Add tags to showcase your interests and skills. This helps us recommend relevant events for you.
          </p>
        </div>
        
        {/* Add Interest Form */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <form onSubmit={handleAddInterest} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest (e.g. React, Machine Learning, DevOps)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={!newInterest.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Interest
            </button>
          </form>
        </div>
        
        {/* Interest Tags */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Your Interests ({interests.length})</h3>
          
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full group hover:bg-indigo-200 transition-colors border border-indigo-200"
                >
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">{interest}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-900 ml-1"
                    title="Remove interest"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <Tag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No interests added yet</h3>
              <p className="text-slate-600">
                Start by adding your first interest above to get personalized event recommendations.
              </p>
            </div>
          )}
        </div>

        {/* Suggested Interests */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Tech Interests</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 
              'DevOps', 'Cloud Computing', 'Cybersecurity', 'Data Science', 
              'Mobile Development', 'Blockchain', 'AI/ML', 'UI/UX Design'
            ].filter(suggestion => !interests.includes(suggestion)).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onUpdateInterests([...interests, suggestion])}
                className="px-3 py-1.5 text-sm bg-white text-slate-700 rounded-full border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsSection;