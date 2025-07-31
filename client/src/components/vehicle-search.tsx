import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface VehicleSearchProps {
  onSearch: (filters: {
    make?: string;
    model?: string;
    year?: string;
    maxPrice?: number;
  }) => void;
}

export default function VehicleSearch({ onSearch }: VehicleSearchProps) {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    maxPrice: ""
  });

  const handleSearch = () => {
    const searchFilters: any = {};
    
    if (filters.make && filters.make !== "Any Make") {
      searchFilters.make = filters.make;
    }
    if (filters.model && filters.model !== "Any Model") {
      searchFilters.model = filters.model;
    }
    if (filters.year && filters.year !== "Any Year") {
      searchFilters.year = filters.year;
    }
    if (filters.maxPrice && filters.maxPrice !== "Any Price") {
      if (filters.maxPrice === "Under $10,000") {
        searchFilters.maxPrice = 10000;
      } else if (filters.maxPrice === "$10,000 - $20,000") {
        searchFilters.maxPrice = 20000;
      } else if (filters.maxPrice === "$20,000 - $30,000") {
        searchFilters.maxPrice = 30000;
      }
    }
    
    onSearch(searchFilters);
  };

  return (
    <section className="bg-white py-8 shadow-md">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Your Perfect Vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
              <Select value={filters.make} onValueChange={(value) => setFilters({...filters, make: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Make">Any Make</SelectItem>
                  <SelectItem value="Cadillac">Cadillac</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <Select value={filters.model} onValueChange={(value) => setFilters({...filters, model: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Model">Any Model</SelectItem>
                  <SelectItem value="CTS">CTS</SelectItem>
                  <SelectItem value="Camry">Camry</SelectItem>
                  <SelectItem value="Accord">Accord</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Year">Any Year</SelectItem>
                  <SelectItem value="2020+">2020+</SelectItem>
                  <SelectItem value="2015-2019">2015-2019</SelectItem>
                  <SelectItem value="2010-2014">2010-2014</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <Select value={filters.maxPrice} onValueChange={(value) => setFilters({...filters, maxPrice: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Price">Any Price</SelectItem>
                  <SelectItem value="Under $10,000">Under $10,000</SelectItem>
                  <SelectItem value="$10,000 - $20,000">$10,000 - $20,000</SelectItem>
                  <SelectItem value="$20,000 - $30,000">$20,000 - $30,000</SelectItem>
                  <SelectItem value="$30,000+">$30,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full bg-auto-blue-600 hover:bg-auto-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
