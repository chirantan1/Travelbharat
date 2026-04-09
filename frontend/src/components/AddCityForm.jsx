import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  ChevronDown,
  X,
  Globe,
  Search,
} from "lucide-react";

const AddCityForm = () => {
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://travelbharat-lxbw.onrender.com/api/states",
        );
        setStates(res.data);
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };
    fetchStates();
  }, []);

  // ✅ Fetch cities
  const fetchCities = async () => {
    try {
      const res = await axios.get(
        "https://travelbharat-lxbw.onrender.com/api/cities",
      );
      setCities(res.data);
    } catch (error) {
      console.error("Failed to fetch cities", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ✅ Add city
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await axios.post("https://travelbharat-lxbw.onrender.com/api/cities", {
        name,
        state: stateId,
      });

      setStatus({
        type: "success",
        message: `✨ Successfully added ${name} to the city list!`,
      });

      setName("");
      setStateId("");
      fetchCities();

      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message || "Error adding city. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete city
  const handleDelete = async (id, cityName) => {
    setDeletingId(id);
    try {
      await axios.delete(
        `https://travelbharat-lxbw.onrender.com/api/cities/${id}`,
      );
      fetchCities();

      setStatus({
        type: "success",
        message: `🗑️ ${cityName} has been removed successfully`,
      });

      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to delete city. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Filter cities based on search
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get state name by ID or from populated state object
  const getStateName = (city) => {
    // If state is populated with name
    if (city.state && typeof city.state === "object" && city.state.name) {
      return city.state.name;
    }
    // If state is just an ID, find it from states array
    if (city.state && typeof city.state === "string") {
      const state = states.find((s) => s._id === city.state);
      return state ? state.name : "Unknown State";
    }
    return "Unknown State";
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
    blur: { scale: 1, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block"
          >
            <Globe className="w-16 h-16 text-green-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            City Management
          </h1>
          <p className="text-gray-600 mt-2">
            Add and manage cities across different states
          </p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 p-4 rounded-xl backdrop-blur-sm border ${
                status.type === "success"
                  ? "bg-green-50/80 border-green-200 text-green-700"
                  : "bg-red-50/80 border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {status.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{status.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add City Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New City
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* City Name Input */}
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === "city" ? "focus" : "blur"}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("city")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      required
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>

                {/* State Selection */}
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === "state" ? "focus" : "blur"}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select State *
                  </label>
                  <div className="relative">
                    <select
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      onFocus={() => setFocusedField("state")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                      required
                    >
                      <option value="">Choose a state</option>
                      {states.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg"
                  }`}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding City...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add City
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Cities List Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 h-full"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    All Cities
                  </h2>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {cities.length} Cities
                  </span>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white/50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cities Grid */}
              {filteredCities.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No cities match your search"
                      : "No cities added yet"}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-2 text-sm text-green-600 hover:text-green-700"
                    >
                      Clear search
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {filteredCities.map((city, index) => (
                      <motion.div
                        key={city._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="group bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-green-500" />
                              <h3 className="font-semibold text-gray-800">
                                {city.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Building2 className="w-3 h-3" />
                              <span>{getStateName(city)}</span>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => handleDelete(city._id, city.name)}
                            disabled={deletingId === city._id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200 disabled:opacity-50"
                          >
                            {deletingId === city._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Stats Footer */}
              {filteredCities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 pt-4 border-t border-gray-100"
                >
                  <p className="text-xs text-gray-500 text-center">
                    Showing {filteredCities.length} of {cities.length} cities
                    {searchTerm && " (filtered)"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </motion.div>
  );
};

export default AddCityForm;
