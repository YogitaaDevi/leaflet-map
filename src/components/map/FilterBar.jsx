'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { eventsData } from '@/data/eventsData';
import Card from '../ui/Card';

const FilterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get unique cities
  const cities = [...new Set(eventsData.map(event => event.cityname))].sort();
  
  // Filter cities based on search
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkbox change
  const handleCityChange = (city) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const selectedCities = current.get('city')?.split(',').filter(Boolean) || [];
    
    if (selectedCities.includes(city)) {
      // Remove city
      const newCities = selectedCities.filter(c => c !== city);
      if (newCities.length > 0) {
        current.set('city', newCities.join(','));
      } else {
        current.delete('city');
      }
    } else {
      // Add city
      selectedCities.push(city);
      current.set('city', selectedCities.join(','));
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/map${query}`);
  };

  const isSelected = (city) => {
    const selectedCities = searchParams.get('city')?.split(',') || [];
    return selectedCities.includes(city);
  };

  return (
    <Card className="h-full p-6 flex flex-col gap-6 w-80 shrink-0 z-10 rounded-none border-r border-gray-200 shadow-none">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gatherings</h2>
        <p className="text-sm text-gray-500 mt-1">Filter events by location</p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search locations..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-3 top-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-1">
          {filteredCities.map(city => (
            <label key={city} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected(city)}
                  onChange={() => handleCityChange(city)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="12"
                  height="12"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900">{city}</span>
            </label>
          ))}
          
          {filteredCities.length === 0 && (
             <div className="text-center py-8">
               <p className="text-gray-500 text-sm">No locations found matching &quot;{searchTerm}&quot;</p>
             </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FilterBar;
