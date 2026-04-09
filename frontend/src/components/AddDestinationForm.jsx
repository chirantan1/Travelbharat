import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  DollarSign,
  Image,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Building2,
  Landmark,
} from "lucide-react";

const AddDestinationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    bestTimeToVisit: "",
    entryFee: "",
    stateId: "",
    cityId: "",
    images: "",
  });

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

  // Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/states");
        setStatesList(res.data);
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };
    fetchStates();
  }, []);

  // Fetch Cities based on selected state
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.stateId) {
        setCitiesList([]);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/api/cities/state/${formData.stateId}`,
        );
        setCitiesList(res.data);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };

    fetchCities();
  }, [formData.stateId]);

  // Image preview handler
  useEffect(() => {
    if (formData.images) {
      const urls = formData.images
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url);
      setImagePreview(urls.slice(0, 3));
    } else {
      setImagePreview([]);
    }
  }, [formData.images]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "stateId") {
      setFormData({
        ...formData,
        stateId: value,
        cityId: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const dataToSend = {
        ...formData,
        images: formData.images
          ? formData.images.split(",").map((url) => url.trim())
          : [],
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, "-"),
      };

      const response = await axios.post(
        "http://localhost:8080/api/places",
        dataToSend,
      );

      setStatus({
        type: "success",
        message: `✨ Successfully added ${response.data.name}!`,
      });

      setFormData({
        name: "",
        slug: "",
        description: "",
        bestTimeToVisit: "",
        entryFee: "",
        stateId: "",
        cityId: "",
        images: "",
      });

      setCitiesList([]);

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to add destination. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
            <Landmark className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Destination
          </h1>
          <p className="text-gray-600 mt-2">
            Share amazing places with the world
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

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Location Selection Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Location Details
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* State Select */}
              <motion.div
                variants={inputVariants}
                animate={focusedField === "state" ? "focus" : "blur"}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select State *
                </label>
                <div className="relative">
                  <select
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("state")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">-- Choose a State --</option>
                    {statesList.map((state) => (
                      <option key={state._id} value={state._id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </motion.div>

              {/* City Select */}
              <motion.div
                variants={inputVariants}
                animate={focusedField === "city" ? "focus" : "blur"}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select City *
                </label>
                <div className="relative">
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("city")}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={!formData.stateId}
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Choose a City --</option>
                    {citiesList.length === 0 ? (
                      <option disabled>No cities available</option>
                    ) : (
                      citiesList.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))
                    )}
                  </select>
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Destination Details Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Destination Details
              </h3>
            </div>
            <div className="space-y-4">
              <motion.div
                variants={inputVariants}
                animate={focusedField === "name" ? "focus" : "blur"}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Destination Name"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows="4"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                  required
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={inputVariants} className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleChange}
                    placeholder="Best Time to Visit"
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </motion.div>

                <motion.div variants={inputVariants} className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleChange}
                    placeholder="Entry Fee (e.g., $10 or Free)"
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </motion.div>
              </div>

              <motion.div variants={inputVariants} className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder="Image URLs (comma-separated)"
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </motion.div>

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {imagePreview.map((url, index) => (
                      <motion.img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=Invalid+URL";
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
            }`}
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding Destination...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Add Destination
                </>
              )}
            </span>
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AddDestinationForm;
