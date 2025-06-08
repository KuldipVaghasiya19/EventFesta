import { useState } from 'react';
import { Calendar, MapPin, Users, Tag, Trophy, User, Clock, CreditCard, Upload, X, Plus } from 'lucide-react';

const CreateEventForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    about: '',
    tags: [],
    prizes: [],
    judges: [],
    speakers: [],
    schedule: [],
    eventDate: '',
    registrationDeadline: '',
    location: '',
    razorpayEnabled: false,
    maxParticipants: ''
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newPrize, setNewPrize] = useState('');
  const [newJudge, setNewJudge] = useState({ name: '', role: '', company: '' });
  const [newSpeaker, setNewSpeaker] = useState({ name: '', role: '', company: '' });
  const [newScheduleItem, setNewScheduleItem] = useState({ time: '', title: '', speaker: '' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.about.trim()) newErrors.about = 'Event description is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.maxParticipants) newErrors.maxParticipants = 'Maximum participants is required';
    
    // Validate that registration deadline is before event date
    if (formData.eventDate && formData.registrationDeadline) {
      if (new Date(formData.registrationDeadline) >= new Date(formData.eventDate)) {
        newErrors.registrationDeadline = 'Registration deadline must be before event date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Array management functions
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPrize = () => {
    if (newPrize.trim()) {
      setFormData(prev => ({
        ...prev,
        prizes: [...prev.prizes, newPrize.trim()]
      }));
      setNewPrize('');
    }
  };

  const removePrize = (index) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const addJudge = () => {
    if (newJudge.name.trim() && newJudge.role.trim()) {
      setFormData(prev => ({
        ...prev,
        judges: [...prev.judges, { ...newJudge }]
      }));
      setNewJudge({ name: '', role: '', company: '' });
    }
  };

  const removeJudge = (index) => {
    setFormData(prev => ({
      ...prev,
      judges: prev.judges.filter((_, i) => i !== index)
    }));
  };

  const addSpeaker = () => {
    if (newSpeaker.name.trim() && newSpeaker.role.trim()) {
      setFormData(prev => ({
        ...prev,
        speakers: [...prev.speakers, { ...newSpeaker }]
      }));
      setNewSpeaker({ name: '', role: '', company: '' });
    }
  };

  const removeSpeaker = (index) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const addScheduleItem = () => {
    if (newScheduleItem.time && newScheduleItem.title.trim()) {
      setFormData(prev => ({
        ...prev,
        schedule: [...prev.schedule, { ...newScheduleItem }]
      }));
      setNewScheduleItem({ time: '', title: '', speaker: '' });
    }
  };

  const removeScheduleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter event name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                Event Photo
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Photo
                </label>
                {formData.photo && (
                  <span className="text-sm text-gray-600">{formData.photo.name}</span>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                About Event <span className="text-red-500">*</span>
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                  errors.about ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your event..."
              />
              {errors.about && <p className="mt-1 text-sm text-red-500">{errors.about}</p>}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="datetime-local"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.eventDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.eventDate && <p className="mt-1 text-sm text-red-500">{errors.eventDate}</p>}
            </div>

            <div>
              <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Deadline <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="datetime-local"
                  id="registrationDeadline"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.registrationDeadline && <p className="mt-1 text-sm text-red-500">{errors.registrationDeadline}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Event location"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Participants <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="100"
                />
              </div>
              {errors.maxParticipants && <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="razorpayEnabled"
                  name="razorpayEnabled"
                  checked={formData.razorpayEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="razorpayEnabled" className="ml-2 flex items-center text-sm text-gray-700">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Enable Razorpay Payment Integration
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Tags</h2>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag (e.g., React, AI, Blockchain)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-primary-500 hover:text-primary-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Prizes */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Prizes</h2>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newPrize}
              onChange={(e) => setNewPrize(e.target.value)}
              placeholder="Add a prize (e.g., 1st Place: $1000)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrize())}
            />
            <button
              type="button"
              onClick={addPrize}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.prizes.map((prize, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg"
              >
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-gray-700">{prize}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removePrize(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Judges */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Judges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              value={newJudge.name}
              onChange={(e) => setNewJudge(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Judge name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <input
              type="text"
              value={newJudge.role}
              onChange={(e) => setNewJudge(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Role/Title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newJudge.company}
                onChange={(e) => setNewJudge(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Company"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={addJudge}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {formData.judges.map((judge, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg"
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-700">
                    {judge.name} - {judge.role} {judge.company && `at ${judge.company}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeJudge(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Speakers */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Speakers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              value={newSpeaker.name}
              onChange={(e) => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Speaker name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <input
              type="text"
              value={newSpeaker.role}
              onChange={(e) => setNewSpeaker(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Role/Title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpeaker.company}
                onChange={(e) => setNewSpeaker(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Company"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={addSpeaker}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {formData.speakers.map((speaker, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-2 rounded-lg"
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-gray-700">
                    {speaker.name} - {speaker.role} {speaker.company && `at ${speaker.company}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSpeaker(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="time"
              value={newScheduleItem.time}
              onChange={(e) => setNewScheduleItem(prev => ({ ...prev, time: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <input
              type="text"
              value={newScheduleItem.title}
              onChange={(e) => setNewScheduleItem(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Session title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newScheduleItem.speaker}
                onChange={(e) => setNewScheduleItem(prev => ({ ...prev, speaker: e.target.value }))}
                placeholder="Speaker (optional)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={addScheduleItem}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {formData.schedule.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg"
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-gray-700">
                    {item.time} - {item.title} {item.speaker && `by ${item.speaker}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </div>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;