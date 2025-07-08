import { useState } from 'react';
import { Calendar, MapPin, Users, Tag, Trophy, User, Clock, CreditCard, Upload, X, Plus } from 'lucide-react';

const CreateEventForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    about: '',
    eventType: '',
    tags: [],
    prizes: [],
    judges: [],
    speakers: [],
    schedule: [],
    eventDate: '',
    registrationDeadline: '',
    location: '',
    registrationFees: '',
    razorpayEnabled: false,
    maxParticipants: ''
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newPrize, setNewPrize] = useState('');
  const [newJudge, setNewJudge] = useState({ name: '', role: '', company: '' });
  const [newSpeaker, setNewSpeaker] = useState({ name: '', role: '', company: '' });
  const [newScheduleItem, setNewScheduleItem] = useState({ startTime: '', endTime: '', title: '', speaker: '' });

  const eventTypes = [
    'Conference',
    'Workshop',
    'Hackathon',
    'Seminar',
    'Meetup',
    'Webinar',
    'Exhibition',
    'Panel Discussion',
    'Networking Event',
    'Training Session'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.about.trim()) newErrors.about = 'Event description is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.maxParticipants) newErrors.maxParticipants = 'Maximum participants is required';
    if (!formData.registrationFees && formData.registrationFees !== '0') newErrors.registrationFees = 'Registration fees is required';
    
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
    if (newScheduleItem.startTime && newScheduleItem.endTime && newScheduleItem.title.trim()) {
      setFormData(prev => ({
        ...prev,
        schedule: [...prev.schedule, { ...newScheduleItem }]
      }));
      setNewScheduleItem({ startTime: '', endTime: '', title: '', speaker: '' });
    }
  };

  const removeScheduleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Basic Information</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter event name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white ${
                    errors.eventType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                {errors.eventType && <p className="mt-1 text-sm text-red-500">{errors.eventType}</p>}
              </div>

              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-300"
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
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                  About Event <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.about ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your event..."
                />
                {errors.about && <p className="mt-1 text-sm text-red-500">{errors.about}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Event Details</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.eventDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.eventDate && <p className="mt-1 text-sm text-red-500">{errors.eventDate}</p>}
              </div>

              <div>
                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="registrationDeadline"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.registrationDeadline && <p className="mt-1 text-sm text-red-500">{errors.registrationDeadline}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Event location"
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="100"
                  />
                </div>
                {errors.maxParticipants && <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>}
              </div>

              <div>
                <label htmlFor="registrationFees" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Fees <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="registrationFees"
                    name="registrationFees"
                    value={formData.registrationFees}
                    onChange={handleChange}
                    min="0"
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.registrationFees ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="If free, enter 0"
                  />
                </div>
                {errors.registrationFees && <p className="mt-1 text-sm text-red-500">{errors.registrationFees}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Tags</h2>
          </div>
          <div className="p-8">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., React, AI, Blockchain)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-indigo-500 hover:text-indigo-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Prizes</h2>
          </div>
          <div className="p-8">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newPrize}
                onChange={(e) => setNewPrize(e.target.value)}
                placeholder="Add a prize (e.g., 1st Place: $1000)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrize())}
              />
              <button
                type="button"
                onClick={addPrize}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.prizes.map((prize, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-amber-600 mr-2" />
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
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Schedule</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <input
                type="time"
                value={newScheduleItem.startTime}
                onChange={(e) => setNewScheduleItem(prev => ({ ...prev, startTime: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Start time"
              />
              <input
                type="time"
                value={newScheduleItem.endTime}
                onChange={(e) => setNewScheduleItem(prev => ({ ...prev, endTime: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="End time"
              />
              <input
                type="text"
                value={newScheduleItem.title}
                onChange={(e) => setNewScheduleItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Session title"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newScheduleItem.speaker}
                  onChange={(e) => setNewScheduleItem(prev => ({ ...prev, speaker: e.target.value }))}
                  placeholder="Speaker (optional)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {formData.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="text-gray-700">
                      {item.startTime} - {item.endTime}: {item.title} {item.speaker && `by ${item.speaker}`}
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
        </div>

        {/* Judges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Judges</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <input
                type="text"
                value={newJudge.name}
                onChange={(e) => setNewJudge(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Judge name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <input
                type="text"
                value={newJudge.role}
                onChange={(e) => setNewJudge(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Role/Title"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newJudge.company}
                  onChange={(e) => setNewJudge(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addJudge}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {formData.judges.map((judge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-cyan-50 border border-cyan-200 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-cyan-600 mr-2" />
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
        </div>

        {/* Speakers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Speakers</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <input
                type="text"
                value={newSpeaker.name}
                onChange={(e) => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Speaker name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <input
                type="text"
                value={newSpeaker.role}
                onChange={(e) => setNewSpeaker(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Role/Title"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpeaker.company}
                  onChange={(e) => setNewSpeaker(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addSpeaker}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {formData.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-teal-50 border border-teal-200 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-teal-600 mr-2" />
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
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;