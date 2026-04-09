import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const States = () => {
  // 1. Create state variables to hold our data and loading status
  const [statesList, setStatesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect runs automatically when the component first loads
  useEffect(() => {
    const fetchStates = async () => {
      try {
        // Fetch data from your backend API
        const response = await axios.get(
          "https://travelbharat-lxbw.onrender.com/api/states",
        );

        // Update the state variable with the data we got back
        setStatesList(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching states:", err);
        setError("Failed to load states. Please try again later.");
        setLoading(false);
      }
    };

    fetchStates();
  }, []); // The empty array [] means this only runs once when the page loads

  // 3. Handle loading and error states
  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-blue-600">
        Loading states...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-xl text-red-600">{error}</div>
    );
  }

  // 4. Render the actual data
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 border-b pb-4">
        Explore Incredible India
      </h1>

      {/* CSS Grid for responsive cards (1 column on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* We use .map() to loop through the array of states and create a card for each one */}
        {statesList.map((stateObj) => (
          <div
            key={stateObj._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* State Image */}
            <img
              src={stateObj.imageUrl}
              alt={stateObj.name}
              className="w-full h-56 object-cover"
            />

            {/* Card Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {stateObj.name}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                  {stateObj.code}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {stateObj.description}
              </p>

              <div className="text-sm text-gray-500 mb-4">
                <strong>Capital:</strong> {stateObj.capital}
              </div>

              {/* Button to view places in this state (We will build this route later!) */}
              <Link
                to={`/states/${stateObj._id}`}
                className="inline-block w-full text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Fallback if database is empty */}
      {statesList.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No states found. Please add some via the Admin dashboard.
        </div>
      )}
    </div>
  );
};

export default States;
