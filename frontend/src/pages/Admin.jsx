import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Building2,
  Landmark,
  Home,
  Globe,
  Settings,
  ChevronRight,
  Calendar,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import AddDestinationForm from "../components/AddDestinationForm";
import AddCityForm from "../components/AddCityForm";

const Admin = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    capital: "",
    imageUrl: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [states, setStates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("states");
  const [focusedField, setFocusedField] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await axios.get(
        "https://travelbharat-lxbw.onrender.com/api/states",
      );
      setStates(res.data);
    } catch (error) {
      console.error("Error fetching states", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      if (editingId) {
        await axios.put(
          `https://travelbharat-lxbw.onrender.com/api/states/${editingId}`,
          formData,
        );
        setStatus({
          type: "success",
          message: "✨ State updated successfully!",
        });
      } else {
        const response = await axios.post(
          "https://travelbharat-lxbw.onrender.com/api/states",
          formData,
        );
        setStatus({
          type: "success",
          message: `🎉 Successfully added ${response.data.name}!`,
        });
      }

      setFormData({
        name: "",
        code: "",
        description: "",
        capital: "",
        imageUrl: "",
      });
      setEditingId(null);
      fetchStates();

      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, stateName) => {
    if (!window.confirm(`Are you sure you want to delete ${stateName}?`))
      return;

    setDeletingId(id);
    try {
      await axios.delete(
        `https://travelbharat-lxbw.onrender.com/api/states/${id}`,
      );
      fetchStates();
      setStatus({
        type: "success",
        message: `🗑️ ${stateName} has been removed`,
      });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (error) {
      console.error("Delete failed", error);
      setStatus({ type: "error", message: "Failed to delete state" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (state) => {
    setFormData({
      name: state.name,
      code: state.code,
      description: state.description,
      capital: state.capital,
      imageUrl: state.imageUrl,
    });
    setEditingId(state._id);
    setActiveTab("states");
  };

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.capital.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
    blur: { scale: 1, transition: { type: "spring", stiffness: 300 } },
  };

  const tabs = [
    {
      id: "states",
      label: "States Management",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: "cities",
      label: "Cities Management",
      icon: MapPin,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      id: "destinations",
      label: "Destinations Management",
      icon: Landmark,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const getCurrentTabColor = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab?.color || "from-blue-500 to-blue-600";
  };

  const getCurrentTabIconColor = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab?.textColor || "text-blue-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block"
          >
            <div
              className={`p-4 rounded-2xl bg-gradient-to-r ${getCurrentTabColor()} shadow-lg`}
            >
              <Settings className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mt-6 bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Effortlessly manage states, cities, and tourist destinations
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
              className={`mb-8 p-4 rounded-2xl backdrop-blur-sm border-2 ${
                status.type === "success"
                  ? "bg-green-50/90 border-green-200"
                  : "bg-red-50/90 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1 rounded-full ${status.type === "success" ? "bg-green-100" : "bg-red-100"}`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <span
                  className={`font-medium ${status.type === "success" ? "text-green-800" : "text-red-800"}`}
                >
                  {status.message}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-10 justify-center"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.id === "states" ? "blue" : tab.id === "cities" ? "emerald" : "purple"}-200`
                    : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 hover:shadow-md border border-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* States Management Tab */}
        {activeTab === "states" && (
          <div className="space-y-8">
            {/* Add/Edit State Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${getCurrentTabColor()} bg-opacity-10`}
                  >
                    {editingId ? (
                      <Edit2
                        className={`w-5 h-5 ${getCurrentTabIconColor()}`}
                      />
                    ) : (
                      <Plus className={`w-5 h-5 ${getCurrentTabIconColor()}`} />
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {editingId ? "Edit State" : "Add New State"}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    variants={inputVariants}
                    animate={focusedField === "name" ? "focus" : "blur"}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter state name"
                        className="w-full p-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                        required
                      />
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div variants={inputVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State Code *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          placeholder="e.g., MH, UP, KA"
                          className="w-full p-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                          required
                        />
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>

                    <motion.div variants={inputVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Capital *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="capital"
                          value={formData.capital}
                          onChange={handleChange}
                          placeholder="Capital city"
                          className="w-full p-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                          required
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={inputVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image URL *
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/state-image.jpg"
                        className="w-full p-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                        required
                      />
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>

                  <motion.div variants={inputVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the state, its culture, geography, etc."
                      rows="4"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 resize-none"
                      required
                    />
                  </motion.div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : `bg-gradient-to-r ${getCurrentTabColor()} hover:shadow-lg`
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            {editingId ? "Update State" : "Add State"}
                          </>
                        )}
                      </span>
                    </motion.button>

                    {editingId && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            name: "",
                            code: "",
                            description: "",
                            capital: "",
                            imageUrl: "",
                          });
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>

            {/* States List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${getCurrentTabColor()} bg-opacity-10`}
                    >
                      <Building2
                        className={`w-5 h-5 ${getCurrentTabIconColor()}`}
                      />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      All States
                    </h2>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getCurrentTabColor()} text-white`}
                    >
                      {states.length} States
                    </span>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search states or capitals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white/80 w-64"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* States Grid */}
                {filteredStates.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      {searchTerm
                        ? "No states match your search"
                        : "No states added yet"}
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence>
                      {filteredStates.map((state, index) => (
                        <motion.div
                          key={state._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          className="group bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <h3 className="font-bold text-gray-800 text-lg">
                                  {state.name}
                                </h3>
                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                  {state.code}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="w-3 h-3" />
                                <span>Capital: {state.capital}</span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {state.description}
                              </p>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <motion.button
                                onClick={() => handleEdit(state)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all duration-200"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() =>
                                  handleDelete(state._id, state.name)
                                }
                                disabled={deletingId === state._id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200 disabled:opacity-50"
                              >
                                {deletingId === state._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Stats Footer */}
                {filteredStates.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 pt-4 border-t border-gray-200"
                  >
                    <p className="text-sm text-gray-500 text-center">
                      Showing {filteredStates.length} of {states.length} states
                      {searchTerm && " (filtered)"}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Cities Management Tab */}
        {activeTab === "cities" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AddCityForm />
          </motion.div>
        )}

        {/* Destinations Management Tab */}
        {activeTab === "destinations" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AddDestinationForm />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Admin;
