import { useState, useEffect } from 'react';
import { Plus, X, Tag, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const InterestsSection = ({ 
  interests: initialInterests = [], 
  setInterests: setParentInterests,
  participantId,
  onInterestsUpdate
}) => {
  const [interests, setInterests] = useState(initialInterests);
  const [newInterest, setNewInterest] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Base API URL - adjust this to match your backend
  const API_BASE_URL = 'http://localhost:8080';

  // Update local interests when parent interests change
  useEffect(() => {
    setInterests(initialInterests);
  }, [initialInterests]);

  // Load interests from backend
  const loadInterests = async () => {
    if (!participantId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Loading interests for participant:', participantId);
      const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}/interests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded interests:', data);
        const interestsArray = Array.isArray(data) ? data : [];
        setInterests(interestsArray);
        if (setParentInterests) {
          setParentInterests(interestsArray);
        }
        if (onInterestsUpdate) {
          onInterestsUpdate();
        }
      } else {
        const errorData = await response.json().catch(() => ({ 
          error: 'Failed to load interests',
          message: `HTTP ${response.status}: ${response.statusText}` 
        }));
        
        setError(errorData.message || errorData.error || 'Failed to load interests');
        console.error('Error loading interests:', errorData);
        
        // If participant not found, still show the interface
        if (response.status === 404) {
          setInterests([]);
        }
      }
    } catch (error) {
      console.error('Network error loading interests:', error);
      setError('Network error. Please check your connection and ensure the backend is running.');
      setInterests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a single interest using POST endpoint
  const handleAddInterest = async (e) => {
    e.preventDefault();
    const trimmedInterest = newInterest.trim();
    
    if (!trimmedInterest) {
      setError('Please enter a valid interest');
      return;
    }
    
    if (interests.includes(trimmedInterest)) {
      setError('Interest already exists');
      return;
    }

    setIsUpdating(true);
    setError('');
    
    try {
      console.log('Adding interest:', trimmedInterest);
      
      const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interest: trimmedInterest }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Interest added successfully:', data);
        
        // Update with backend response
        if (data.tags && Array.isArray(data.tags)) {
          setInterests(data.tags);
          if (setParentInterests) {
            setParentInterests(data.tags);
          }
        } else {
          // Fallback: add locally if backend doesn't return tags
          const updatedInterests = [...interests, trimmedInterest];
          setInterests(updatedInterests);
          if (setParentInterests) {
            setParentInterests(updatedInterests);
          }
        }
        setNewInterest('');
        if (onInterestsUpdate) {
          onInterestsUpdate();
        }
      } else {
        const errorData = await response.json().catch(() => ({ 
          error: 'Failed to add interest',
          message: `HTTP ${response.status}: ${response.statusText}` 
        }));
        
        setError(errorData.message || errorData.error || 'Failed to add interest');
        console.error('Error adding interest:', errorData);
      }
    } catch (error) {
      console.error('Network error adding interest:', error);
      setError(`Network error: ${error.message}. Please check your connection.`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove a single interest using DELETE endpoint
  const handleRemoveInterest = async (interestToRemove) => {
    setIsUpdating(true);
    setError('');
    
    try {
      console.log('Removing interest:', interestToRemove);
      
      // Properly encode the interest for URL
      const encodedInterest = encodeURIComponent(interestToRemove);
      const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}/interests/${encodedInterest}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Interest removed successfully:', data);
        
        // Update with backend response
        if (data.tags && Array.isArray(data.tags)) {
          setInterests(data.tags);
          if (setParentInterests) {
            setParentInterests(data.tags);
          }
        } else {
          // Fallback: remove locally if backend doesn't return tags
          const updatedInterests = interests.filter(interest => interest !== interestToRemove);
          setInterests(updatedInterests);
          if (setParentInterests) {
            setParentInterests(updatedInterests);
          }
        }
        if (onInterestsUpdate) {
          onInterestsUpdate();
        }
      } else {
        const errorData = await response.json().catch(() => ({ 
          error: 'Failed to remove interest',
          message: `HTTP ${response.status}: ${response.statusText}` 
        }));
        
        setError(errorData.message || errorData.error || 'Failed to remove interest');
        console.error('Error removing interest:', errorData);
      }
    } catch (error) {
      console.error('Network error removing interest:', error);
      setError(`Network error: ${error.message}. Please check your connection.`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add suggested interest using POST endpoint
  const handleAddSuggestedInterest = async (suggestion) => {
    if (interests.includes(suggestion)) {
      return;
    }

    setIsUpdating(true);
    setError('');
    
    try {
      console.log('Adding suggested interest:', suggestion);
      const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interest: suggestion }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Suggested interest added:', data);
        
        // Update with backend response
        if (data.tags && Array.isArray(data.tags)) {
          setInterests(data.tags);
          if (setParentInterests) {
            setParentInterests(data.tags);
          }
        } else {
          // Fallback: add locally if backend doesn't return tags
          const updatedInterests = [...interests, suggestion];
          setInterests(updatedInterests);
          if (setParentInterests) {
            setParentInterests(updatedInterests);
          }
        }
        if (onInterestsUpdate) {
          onInterestsUpdate();
        }
      } else {
        const errorData = await response.json().catch(() => ({ 
          error: 'Failed to add interest',
          message: `HTTP ${response.status}: ${response.statusText}` 
        }));
        
        setError(errorData.message || errorData.error || 'Failed to add suggested interest');
        console.error('Error adding suggested interest:', errorData);
      }
    } catch (error) {
      console.error('Error adding suggested interest:', error);
      setError(`Network error: ${error.message}. Please check your connection.`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update all interests at once using PUT endpoint
  const handleBulkUpdateInterests = async (newInterests) => {
    setIsUpdating(true);
    setError('');
    
    try {
      console.log('Bulk updating interests:', newInterests);
      
      const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}/interests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: newInterests }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Bulk update successful:', data);
        
        if (data.tags && Array.isArray(data.tags)) {
          setInterests(data.tags);
          if (setParentInterests) {
            setParentInterests(data.tags);
          }
        } else {
          // Fallback: update locally if backend doesn't return tags
          setInterests(newInterests);
          if (setParentInterests) {
            setParentInterests(newInterests);
          }
        }
        if (onInterestsUpdate) {
          onInterestsUpdate();
        }
      } else {
        const errorData = await response.json().catch(() => ({ 
          error: 'Failed to update interests',
          message: `HTTP ${response.status}: ${response.statusText}` 
        }));
        
        setError(errorData.message || errorData.error || 'Failed to update interests');
        console.error('Error in bulk update:', errorData);
      }
    } catch (error) {
      console.error('Error in bulk update:', error);
      setError(`Network error: ${error.message}. Please check your connection.`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle input key press for adding interest
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddInterest(e);
    }
  };

  // Clear all interests
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all interests?')) {
      await handleBulkUpdateInterests([]);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-lg text-slate-600">Loading interests...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!participantId) {
    return (
      <div className="bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">No Participant ID</h3>
            <p className="text-red-600">Please provide a valid participant ID to manage interests.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">My Interests</h2>
          <p className="text-lg text-slate-600">
            Add tags to showcase your interests and skills. This helps us recommend relevant events for you.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Add Interest Form */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add an interest (e.g. React, Machine Learning, DevOps)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
                disabled={isUpdating}
                maxLength={50}
              />
            </div>
            <button
              type="button"
              onClick={handleAddInterest}
              disabled={!newInterest.trim() || isUpdating || interests.includes(newInterest.trim())}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Interest
            </button>
          </div>
        </div>
        
        {/* Interest Tags */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Your Interests ({interests.length})</h3>
            <div className="flex items-center gap-2">
              {isUpdating && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </div>
              )}
              <button
                onClick={loadInterests}
                disabled={isUpdating}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh interests"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              {interests.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Clear all interests"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, index) => (
                <div 
                  key={`${interest}-${index}`}
                  className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full group hover:bg-indigo-200 transition-colors border border-indigo-200"
                >
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">{interest}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-900 ml-1"
                    title="Remove interest"
                    disabled={isUpdating}
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
              'Mobile Development', 'Blockchain', 'AI/ML', 'UI/UX Design',
              'Hackathons', 'Open Source', 'Web Development', 'Backend Development',
              'Frontend Development', 'Database', 'API Development', 'Testing',
              'Docker', 'Kubernetes', 'AWS', 'Azure', 'GraphQL', 'TypeScript'
            ].filter(suggestion => !interests.includes(suggestion)).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleAddSuggestedInterest(suggestion)}
                className="px-3 py-1.5 text-sm bg-white text-slate-700 rounded-full border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Statistics */}
        {interests.length > 0 && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Interest Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{interests.length}</div>
                <div className="text-sm text-slate-600">Total Interests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {interests.filter(interest => 
                    ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'AI/ML', 'TypeScript', 'Cloud Computing'].includes(interest)
                  ).length}
                </div>
                <div className="text-sm text-slate-600">High-Demand Skills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.min(Math.round((interests.length / 20) * 100), 100)}%
                </div>
                <div className="text-sm text-slate-600">Profile Completeness</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsSection;