import { useState } from 'react';
import { Calendar, MapPin, Users, Tag, Trophy, User, Clock, CreditCard, Upload, X, Plus } from 'lucide-react';

const CreateEventForm = ({ onSubmit, isSubmitting = false }) => {
  // CHANGED: formData state now matches the Event.java entity structure
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    eventDate: '',
    lastRegistertDate: '',
    location: '',
    registrationFees: '',
    maxParticipants: '',
    tags: [],
    speakers: [],
    judges: [],
    prizes: {
      first: '',
      second: '',
      third: ''
    },
    schedule: [],
    photo: null
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  
  // CHANGED: Removed 'role' from newJudge state
  const [newJudge, setNewJudge] = useState({ name: '', company: '' });
  
  // CHANGED: Removed 'role' from newSpeaker state
  const [newSpeaker, setNewSpeaker] = useState({ name: '', company: '' });
  
  const [newScheduleItem, setNewScheduleItem] = useState({ startTime: '', endTime: '', title: '', speaker: '' });

  // This list can be populated from your EventType enum. 
  // The values should match the backend enum names (e.g., 'CONFERENCE').
  // The backend can be configured to accept case-insensitive values.
  const eventTypes = [
    'CONFERENCE',
    'WORKSHOP',
    'SEMINAR'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // CHANGED: Validating keys that match the entity
    if (!formData.title.trim()) newErrors.title = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.type) newErrors.type = 'Event type is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.lastRegistertDate) newErrors.lastRegistertDate = 'Registration deadline is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.maxParticipants) newErrors.maxParticipants = 'Maximum participants is required';
    if (!formData.registrationFees && formData.registrationFees !== '0') newErrors.registrationFees = 'Registration fees is required';
    
    if (formData.eventDate && formData.lastRegistertDate) {
      if (new Date(formData.lastRegistertDate) >= new Date(formData.eventDate)) {
        newErrors.lastRegistertDate = 'Registration deadline must be before the event date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    // Special handling for nested 'prizes' object
    if (['first', 'second', 'third'].includes(name)) {
        setFormData(prev => ({
            ...prev,
            prizes: {
                ...prev.prizes,
                [name]: value
            }
        }));
    } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'file' ? files[0] : value
        }));
    }


    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Create a new object for submission, converting number fields
      const submissionData = {
          ...formData,
          registrationFees: parseFloat(formData.registrationFees),
          maxParticipants: parseInt(formData.maxParticipants, 10),
      };
      onSubmit(submissionData);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  // CHANGED: addJudge function simplified
  const addJudge = () => {
    if (newJudge.name.trim()) {
      setFormData(prev => ({ ...prev, judges: [...prev.judges, { ...newJudge }] }));
      setNewJudge({ name: '', company: '' });
    }
  };

  const removeJudge = (index) => {
    setFormData(prev => ({ ...prev, judges: prev.judges.filter((_, i) => i !== index) }));
  };

  // CHANGED: addSpeaker function simplified
  const addSpeaker = () => {
    if (newSpeaker.name.trim()) {
      setFormData(prev => ({ ...prev, speakers: [...prev.speakers, { ...newSpeaker }] }));
      setNewSpeaker({ name: '', company: '' });
    }
  };

  const removeSpeaker = (index) => {
    setFormData(prev => ({ ...prev, speakers: prev.speakers.filter((_, i) => i !== index) }));
  };

  // CHANGED: addScheduleItem combines times into a single string
  const addScheduleItem = () => {
    if (newScheduleItem.startTime && newScheduleItem.endTime && newScheduleItem.title.trim()) {
      const scheduleItemToAdd = {
        time: `${newScheduleItem.startTime} - ${newScheduleItem.endTime}`,
        title: newScheduleItem.title,
        speaker: newScheduleItem.speaker
      };
      setFormData(prev => ({ ...prev, schedule: [...prev.schedule, scheduleItemToAdd] }));
      setNewScheduleItem({ startTime: '', endTime: '', title: '', speaker: '' });
    }
  };

  const removeScheduleItem = (index) => {
    setFormData(prev => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== index) }));
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Event Name <span className="text-red-500">*</span></label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter event name"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Event Type <span className="text-red-500">*</span></label>
                {/* CHANGED: name attribute is now 'type' */}
                <select id="type" name="type" value={formData.type} onChange={handleChange}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type, index) => (
                    <option key={index} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>

              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">Event Photo</label>
                <div className="flex items-center space-x-4">
                  <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} className="hidden" />
                  <label htmlFor="photo" className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-300">
                    <Upload className="h-5 w-5 mr-2" />
                    Choose Photo
                  </label>
                  {formData.photo && (<span className="text-sm text-gray-600">{formData.photo.name}</span>)}
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">About Event <span className="text-red-500">*</span></label>
                 {/* CHANGED: name attribute is now 'description' */}
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describe your event..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
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
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">Event Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="datetime-local" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange}
                            className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.eventDate ? 'border-red-500' : 'border-gray-300'}`} />
                    </div>
                    {errors.eventDate && <p className="mt-1 text-sm text-red-500">{errors.eventDate}</p>}
                </div>

                <div>
                    <label htmlFor="lastRegistertDate" className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        {/* CHANGED: name attribute is now 'lastRegistertDate' */}
                        <input type="datetime-local" id="lastRegistertDate" name="lastRegistertDate" value={formData.lastRegistertDate} onChange={handleChange}
                            className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.lastRegistertDate ? 'border-red-500' : 'border-gray-300'}`} />
                    </div>
                    {errors.lastRegistertDate && <p className="mt-1 text-sm text-red-500">{errors.lastRegistertDate}</p>}
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange}
                            className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Event location" />
                    </div>
                    {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>

                <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">Maximum Participants <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="number" id="maxParticipants" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1"
                            className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.maxParticipants ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="100" />
                    </div>
                    {errors.maxParticipants && <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>}
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="registrationFees" className="block text-sm font-medium text-gray-700 mb-2">Registration Fees <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="number" id="registrationFees" name="registrationFees" value={formData.registrationFees} onChange={handleChange} min="0" step="0.01"
                            className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.registrationFees ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="If free, enter 0" />
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
                  <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a tag (e.g., React, AI, Blockchain)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                  <button type="button" onClick={addTag} className="flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                      <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
              </div>
              <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                      <span key={index} className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full text-sm">
                          <Tag className="h-3 w-3 mr-1" /> {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-indigo-500 hover:text-indigo-700">
                              <X className="h-3 w-3" />
                          </button>
                      </span>
                  ))}
              </div>
          </div>
        </div>
        
        {/* NEW: Prizes section completely reworked to match the entity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Prizes</h2>
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="first" className="block text-sm font-medium text-gray-700 mb-2">First Prize</label>
                        <div className="relative">
                            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="first" name="first" value={formData.prizes.first} onChange={handleChange}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., $1000 Cash" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="second" className="block text-sm font-medium text-gray-700 mb-2">Second Prize</label>
                        <div className="relative">
                            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="second" name="second" value={formData.prizes.second} onChange={handleChange}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., Swag Pack" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="third" className="block text-sm font-medium text-gray-700 mb-2">Third Prize</label>
                        <div className="relative">
                            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="third" name="third" value={formData.prizes.third} onChange={handleChange}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., Certificate" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Schedule</h2>
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6 items-end">
                    <input type="time" value={newScheduleItem.startTime} onChange={(e) => setNewScheduleItem(prev => ({ ...prev, startTime: e.target.value }))} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    <input type="time" value={newScheduleItem.endTime} onChange={(e) => setNewScheduleItem(prev => ({ ...prev, endTime: e.target.value }))} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    <input type="text" value={newScheduleItem.title} onChange={(e) => setNewScheduleItem(prev => ({ ...prev, title: e.target.value }))} placeholder="Session title" className="lg:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    <input type="text" value={newScheduleItem.speaker} onChange={(e) => setNewScheduleItem(prev => ({ ...prev, speaker: e.target.value }))} placeholder="Speaker (optional)" className="lg:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    <button type="button" onClick={addScheduleItem} className="flex items-center justify-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.schedule.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-emerald-600 mr-2" />
                                {/* CHANGED: Displaying item.time directly */}
                                <span className="text-gray-700">{item.time}: {item.title} {item.speaker && `by ${item.speaker}`}</span>
                            </div>
                            <button type="button" onClick={() => removeScheduleItem(index)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
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
                {/* CHANGED: Removed 'Role/Title' input */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 items-end">
                    <input type="text" value={newJudge.name} onChange={(e) => setNewJudge(prev => ({ ...prev, name: e.target.value }))} placeholder="Judge name" className="md:col-span-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    <div className="flex gap-2 md:col-span-2">
                        <input type="text" value={newJudge.company} onChange={(e) => setNewJudge(prev => ({ ...prev, company: e.target.value }))} placeholder="Company (optional)" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                        <button type="button" onClick={addJudge} className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"><Plus className="h-5 w-5" /></button>
                    </div>
                </div>
                <div className="space-y-2">
                    {formData.judges.map((judge, index) => (
                        <div key={index} className="flex items-center justify-between bg-cyan-50 border border-cyan-200 px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                                <User className="h-4 w-4 text-cyan-600 mr-2" />
                                {/* CHANGED: Removed role from display */}
                                <span className="text-gray-700">{judge.name} {judge.company && `from ${judge.company}`}</span>
                            </div>
                            <button type="button" onClick={() => removeJudge(index)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
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
                 {/* CHANGED: Removed 'Role/Title' input */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 items-end">
                    <input type="text" value={newSpeaker.name} onChange={(e) => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))} placeholder="Speaker name" className="md:col-span-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    <div className="flex gap-2 md:col-span-2">
                        <input type="text" value={newSpeaker.company} onChange={(e) => setNewSpeaker(prev => ({ ...prev, company: e.target.value }))} placeholder="Company (optional)" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                        <button type="button" onClick={addSpeaker} className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"><Plus className="h-5 w-5" /></button>
                    </div>
                </div>
                <div className="space-y-2">
                    {formData.speakers.map((speaker, index) => (
                        <div key={index} className="flex items-center justify-between bg-teal-50 border border-teal-200 px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                                <User className="h-4 w-4 text-teal-600 mr-2" />
                                {/* CHANGED: Removed role from display */}
                                <span className="text-gray-700">{speaker.name} {speaker.company && `from ${speaker.company}`}</span>
                            </div>
                            <button type="button" onClick={() => removeSpeaker(index)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting}
            className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;