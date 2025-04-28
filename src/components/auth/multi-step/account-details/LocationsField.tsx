
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin } from 'lucide-react';

interface LocationsFieldProps {
  country: string;
  availableLocations: string[];
  selectedLocations: string[];
  onChange: (locations: string[]) => void;
}

const LocationsField: React.FC<LocationsFieldProps> = ({
  country,
  availableLocations,
  selectedLocations,
  onChange
}) => {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="supplyLocations" className="flex items-center form-label">
        <MapPin className="h-4 w-4 mr-2 text-primary" />
        Supply Locations in {country}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border rounded-md border-primary/20 bg-background max-h-[150px] overflow-y-auto">
        {availableLocations.map((location, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`location-${index}`}
              checked={selectedLocations.includes(location)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selectedLocations, location]);
                } else {
                  onChange(selectedLocations.filter((loc) => loc !== location));
                }
              }}
              className="border-primary/40 data-[state=checked]:bg-primary"
            />
            <label
              htmlFor={`location-${index}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {location}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsField;
