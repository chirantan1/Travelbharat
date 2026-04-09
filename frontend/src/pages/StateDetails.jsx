import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const StateDetails = () => {
  // 1. Grab the stateId from the URL (e.g., /states/12345)
  const { id } = useParams();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the tourist places for this specific state
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // Remember that awesome query parameter filter we built in Phase 1? Here it is in action!
        const response = await axios.get(
          `https://travelbharat-lxbw.onrender.com/api/places?stateId=${id}`,
        );
        setPlaces(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching places:", err);
        setError("Failed to load destinations.");
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl text-blue-600">
        Loading destinations...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-20 text-xl text-red-600">{error}</div>
    );

  return (
    <div className="container mx-auto p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          {places.length > 0
            ? `Destinations in ${places.stateId.name}`
            : "Explore Destinations"}
        </h1>
        <Link
          to="/states"
          className="text-blue-600 hover:underline font-medium"
        >
          &larr; Back to States
        </Link>
      </div>

      {/* Destinations Grid */}
      {places.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">
          <p className="text-xl mb-4">
            No destinations found for this state yet.
          </p>
          <Link
            to="/admin"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add a Destination in Admin
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <div
              key={place._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Image (Using the first image in our images array) */}
              <img
                src={
                  place.images && place.images.length > 0
                    ? place.images
                    : "https://via.placeholder.com/400x250?text=No+Image"
                }
                alt={place.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {place.name}
                  </h2>
                  {/* Category Badge */}
                  {place.categoryId && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                      {place.categoryId.name}
                    </span>
                  )}
                </div>

                {/* City Location */}
                <p className="text-sm font-medium text-blue-600 mb-3 flex items-center">
                  📍 {place.cityId ? place.cityId.name : "Unknown City"}
                </p>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {place.description}
                </p>

                <div className="flex flex-col space-y-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded">
                  <p>
                    <strong>🕒 Best Time:</strong>{" "}
                    {place.bestTimeToVisit || "Anytime"}
                  </p>
                  <p>
                    <strong>🎟️ Entry Fee:</strong> {place.entryFee || "Free"}
                  </p>
                </div>

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

export default StateDetails;
