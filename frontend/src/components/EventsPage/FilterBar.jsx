import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ searchTerm, setSearchTerm, selectedType, setSelectedType, featuredOnly, setFeaturedOnly, types, clearFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const hasActiveFilters = searchTerm || selectedType || featuredOnly;

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for events, locations, or keywords..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>

        <div className="hidden md:flex gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="form-checkbox h-5 w-5 text-primary-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Featured</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-navy-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-500 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-navy-600 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 w-full border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="form-checkbox h-5 w-5 text-primary-600"
              />
              <span className="text-gray-700 dark:text-gray-300">Only Featured Events</span>
            </label>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 w-full justify-center bg-gray-100 dark:bg-navy-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-500 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;