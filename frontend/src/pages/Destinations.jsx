import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Destinations = () => {
  const [places, setPlaces] = useState([]);
  const [statesList, setStatesList] = useState([]);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch all states for the dropdown when the page loads
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://travelbharat-lxbw.onrender.com/api/states",
        );
        setStatesList(res.data);
      } catch (err) {
        console.error("Failed to fetch states for filter");
      }
    };
    fetchStates();
  }, []);

  // 2. Fetch places based on search and filter criteria
  const fetchPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build the dynamic URL based on what the user typed/selected
      let url = "https://travelbharat-lxbw.onrender.com/api/places?";

      if (searchTerm) {
        url += `search=${searchTerm}&`;
      }
      if (selectedState) {
        url += `stateId=${selectedState}`;
      }

      const response = await axios.get(url);
      setPlaces(response.data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError("Failed to load destinations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch all places initially when the page loads
  useEffect(() => {
    fetchPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlaces(); // Trigger the fetch with the new search term and state
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">
        Discover India
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Search for specific monuments, cities, or filter by state.
      </p>

      {/* --- SEARCH AND FILTER UI --- */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-6 rounded-lg shadow-md mb-10 flex flex-col md:flex-row gap-4 items-end"
      >
        {/* Search Input */}
        <div className="flex-1 w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Search Destinations
          </label>
          <input
            type="text"
            placeholder="e.g., Taj Mahal, Fort..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* State Filter Dropdown */}
        <div className="w-full md:w-1/3">
          <label className="block text-gray-700 font-medium mb-2">
            Filter by State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">All States</option>
            {statesList.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* --- RESULTS GRID --- */}
      {loading ? (
        <div className="text-center text-xl font-semibold text-blue-600 mt-10">
          Searching...
        </div>
      ) : error ? (
        <div className="text-center text-xl text-red-600 mt-10">{error}</div>
      ) : places.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-500 mb-4">
            No destinations match your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedState("");
              fetchPlaces();
            }}
            className="text-blue-600 underline"
          >
            Clear filters and see all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <div
              key={place._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              <img
                src={
                  place.images && place.images.length > 0
                    ? place.images
                    : "https://via.placeholder.com/400x250"
                }
                alt={place.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {place.name}
                </h2>
                <p className="text-sm font-medium text-blue-600 mb-3 flex items-center">
                  📍 {place.cityId?.name || "Unknown City"},{" "}
                  {place.stateId?.name || "India"}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {place.description}
                </p>
                <button className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-2 rounded hover:bg-blue-600 hover:text-white transition-colors">
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Destinations;
