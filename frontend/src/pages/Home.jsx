import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  MapPin,
  Search,
  Camera,
  Video,
  TrendingUp,
  Star,
  Users,
  Calendar,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Award,
  Clock,
  Compass,
  Mountain,
  Coffee,
  Sun,
  Sparkles,
  Globe,
  X,
  Phone,
  Mail,
  User,
  Calendar as CalendarIcon,
  CreditCard,
  CheckCircle,
  Headset,
  MessageCircle,
} from "lucide-react";
import { api, handleApiError } from "../services/api";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
      } text-white`}
    >
      {type === "success" && <CheckCircle className="w-5 h-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Hero Section Component with Static Image
const HeroSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // Replace 'your-image.jpg' with your actual local image filename
  const heroImage = "./public/image.jpg"; // Adjust path based on your image location

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Static Image Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Incredible India</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
            Welcome to TravelBharat
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover the beauty, heritage, and diversity of India — state by
            state, city by city.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations (e.g., Goa, Kerala, Taj Mahal)..."
                className="w-full sm:w-80 pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg"
            >
              Explore Now
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20"
          >
            {[
              { icon: MapPin, value: 28, label: "States & UTs" },
              { icon: Camera, value: 1200, label: "Destinations" },
              { icon: Users, value: 50000, label: "Happy Travelers" },
              { icon: Award, value: 15, label: "Awards Won" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div
        className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Booking Modal Component
const BookingModal = ({ destination, onClose, onConfirm, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    travelers: 1,
    specialRequests: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(destination, formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Book {destination.title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 items-center gap-2">
              <Phone className="w-4 h-4" /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Travel Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 items-center gap-2">
              <Users className="w-4 h-4" /> Number of Travelers
            </label>
            <input
              type="number"
              name="travelers"
              min="1"
              max="20"
              required
              value={formData.travelers}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              rows="3"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Any specific requirements or preferences..."
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Price per person:</span>
              <span className="font-semibold">₹{destination.price}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total amount:</span>
              <span className="text-xl font-bold text-orange-500">
                ₹{destination.price * formData.travelers}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CreditCard className="w-5 h-5" />
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Destination Card Component
const DestinationCard = ({
  image,
  title,
  location,
  rating,
  price,
  onLike,
  onBook,
  onShare,
  isLiked,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    onLike?.(title);
  };

  const handleBook = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: title,
      text: `Check out ${title} in ${location}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShare?.(title);
      } catch (err) {
        navigator.clipboard.writeText(`${title} - ${location}`);
        alert("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(`${title} - ${location}`);
      alert("Destination info copied to clipboard!");
      onShare?.(title);
    }
  };

  const handleConfirmBooking = async (destination, formData) => {
    setIsSubmitting(true);
    await onBook(destination, formData);
    setIsSubmitting(false);
    setShowModal(false);
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600";

  return (
    <>
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -10 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageError ? fallbackImage : image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-sm">{rating}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">{title}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-orange-500">
                ₹{price}
              </span>
              <span className="text-gray-500"> / person</span>
            </div>
            <motion.button
              whileHover={{ x: 5 }}
              onClick={handleBook}
              className="text-orange-500 font-semibold flex items-center gap-1 group"
            >
              Book Now{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <BookingModal
          destination={{ title, location, price }}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmBooking}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

// Newsletter Section
const Newsletter = ({ onSubscribe, isSubscribing }) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    const success = await onSubscribe(email);
    if (success) {
      setEmail("");
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Subscribe to Our Newsletter
      </h2>
      <p className="mb-6 text-orange-100">
        Get the best travel deals and tips straight to your inbox!
      </p>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-6 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          required
          disabled={isSubscribing}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubscribing}
          className="bg-white text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
        >
          {isSubscribing ? "Subscribing..." : "Subscribe"}
        </motion.button>
      </form>
      {isSubscribed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-green-200"
        >
          ✓ Thanks for subscribing! Check your inbox soon.
        </motion.div>
      )}
    </motion.div>
  );
};

// Main Home Component
const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [likedDestinations, setLikedDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(5000);
  const [toast, setToast] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Load liked destinations from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedDestinations");
    if (savedLikes) {
      setLikedDestinations(JSON.parse(savedLikes));
    }
  }, []);

  // Save liked destinations to localStorage
  useEffect(() => {
    localStorage.setItem(
      "likedDestinations",
      JSON.stringify(likedDestinations),
    );
  }, [likedDestinations]);

  const destinations = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
      title: "Taj Mahal, Agra",
      location: "Uttar Pradesh",
      rating: 4.9,
      price: 2999,
      category: "heritage",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600",
      title: "Jaipur City Palace",
      location: "Rajasthan",
      rating: 4.8,
      price: 2499,
      category: "heritage",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
      title: "Kerala Backwaters",
      location: "Kerala",
      rating: 4.9,
      price: 3999,
      category: "nature",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
      title: "Goa Beaches",
      location: "Goa",
      rating: 4.7,
      price: 1999,
      category: "beach",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600",
      title: "Varanasi Ghats",
      location: "Uttar Pradesh",
      rating: 4.8,
      price: 1799,
      category: "spiritual",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1592656094267-764a45160876?w=600",
      title: "Mumbai City",
      location: "Maharashtra",
      rating: 4.6,
      price: 3499,
      category: "urban",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=600",
      title: "Amritsar Golden Temple",
      location: "Punjab",
      rating: 4.9,
      price: 1899,
      category: "spiritual",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1590001155093-904ce8f6c9f1?w=600",
      title: "Darjeeling Hills",
      location: "West Bengal",
      rating: 4.7,
      price: 2799,
      category: "nature",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1582639605711-0a2b6b6e8b2f?w=600",
      title: "Andaman Islands",
      location: "Andaman & Nicobar",
      rating: 4.9,
      price: 4999,
      category: "beach",
    },
  ];

  const handleSearch = (query) => {
    const results = destinations.filter(
      (dest) =>
        dest.title.toLowerCase().includes(query.toLowerCase()) ||
        dest.location.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(results);
    showToast(
      `Found ${results.length} destinations matching "${query}"`,
      results.length > 0 ? "success" : "error",
    );
  };

  const handleLike = (title) => {
    setLikedDestinations((prev) => {
      if (prev.includes(title)) {
        showToast(`Removed ${title} from favorites`, "info");
        return prev.filter((t) => t !== title);
      } else {
        showToast(`Added ${title} to favorites`, "success");
        return [...prev, title];
      }
    });
  };

  const handleBook = async (destination, formData) => {
    try {
      const totalAmount = destination.price * formData.travelers;

      const bookingData = {
        userId: "guest",
        bookingType: "hotel",
        bookingDetails: {
          itemId: destination.id,
          itemName: destination.title,
          from: destination.location,
          to: destination.location,
          destination: destination.title,
          pricePerPerson: destination.price,
          totalAmount: totalAmount,
          specialRequests: formData.specialRequests || "",
          amenities: ["WiFi", "AC", "Breakfast", "Parking"],
          rating: destination.rating,
        },
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
          },
        },
        paymentDetails: {
          amount: totalAmount,
          currency: "INR",
          paymentMethod: "card",
          status: "completed",
        },
        travelDetails: {
          date: formData.date,
          travelers: parseInt(formData.travelers),
          from: destination.location,
          to: destination.location,
          destination: destination.title,
          preferences: {
            meals: "none",
            accommodation: "standard",
          },
        },
        status: "confirmed",
        specialRequests: formData.specialRequests || "",
      };

      console.log(
        "📤 Sending booking data from Home page:",
        JSON.stringify(bookingData, null, 2),
      );

      const response = await api.createBooking(bookingData);

      if (response.success) {
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        bookings.push({
          id: Date.now(),
          ...bookingData,
          bookingReference:
            response.data?.bookingReference || `BOOK${Date.now()}`,
        });
        localStorage.setItem("bookings", JSON.stringify(bookings));

        showToast(
          `✅ Booking confirmed for ${destination.title}! Total: ₹${totalAmount}. Email sent to ${formData.email}`,
          "success",
        );
      } else {
        showToast("Booking failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("❌ Booking error details:", error);
      console.log("Error response:", error.response?.data);
      showToast(
        error.response?.data?.message ||
          error.message ||
          "Booking failed. Please try again.",
        "error",
      );
    }
  };

  const handleShare = (title) => {
    showToast(`Shared ${title} successfully!`, "success");
  };

  const handleNewsletterSubscribe = async (email) => {
    setIsSubscribing(true);
    try {
      const response = await api.subscribe(email);

      if (response.success) {
        const subscribers = JSON.parse(
          localStorage.getItem("newsletter_subscribers") || "[]",
        );
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem(
            "newsletter_subscribers",
            JSON.stringify(subscribers),
          );
        }
        showToast(
          response.message || "Successfully subscribed! Check your inbox.",
          "success",
        );
        return true;
      } else {
        showToast(response.message || "Subscription failed", "error");
        return false;
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast(
        errorMessage.message || "Failed to subscribe. Please try again.",
        "error",
      );
      return false;
    } finally {
      setIsSubscribing(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getFilteredDestinations = () => {
    let filtered = searchResults || destinations;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((dest) => dest.category === selectedCategory);
    }

    filtered = filtered.filter((dest) => dest.price <= priceRange);

    return filtered;
  };

  const handleViewAllDestinations = () => {
    setSearchResults(null);
    setSelectedCategory("all");
    setPriceRange(5000);
    window.scrollTo({ top: 600, behavior: "smooth" });
    showToast("Showing all destinations", "info");
  };

  const features = [
    {
      icon: Compass,
      title: "Expert Guides",
      description: "Local experts who know every hidden gem",
      color: "bg-blue-500",
    },
    {
      icon: Camera,
      title: "Photo Tours",
      description: "Capture stunning memories with our photography tours",
      color: "bg-purple-500",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
      color: "bg-green-500",
    },
    {
      icon: Mountain,
      title: "Adventure Trips",
      description: "Thrilling experiences for adrenaline junkies",
      color: "bg-red-500",
    },
    {
      icon: Coffee,
      title: "Local Cuisine",
      description: "Taste authentic regional delicacies",
      color: "bg-yellow-500",
    },
    {
      icon: Sun,
      title: "Best Deals",
      description: "Guaranteed lowest prices on all packages",
      color: "bg-orange-500",
    },
  ];

  const filteredDestinations = getFilteredDestinations();

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <HeroSection onSearch={handleSearch} />

      {/* Category Filter Bar */}
      <div className="sticky top-0 z-30 bg-white shadow-md py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center items-center">
          {["all", "heritage", "nature", "beach", "spiritual", "urban"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full capitalize transition ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ),
          )}
          <div className="flex items-center gap-2 ml-4 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm font-medium">
              Max Price: ₹{priceRange}
            </span>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
          {(searchResults ||
            selectedCategory !== "all" ||
            priceRange < 5000) && (
            <button
              onClick={() => {
                setSearchResults(null);
                setSelectedCategory("all");
                setPriceRange(5000);
              }}
              className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600 text-sm font-semibold">
              Why Choose Us
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Experience India Like Never Before
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            We offer curated travel experiences that showcase the best of
            India's rich culture, heritage, and natural beauty.
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 text-sm font-semibold">
                {searchResults
                  ? `Search Results (${filteredDestinations.length})`
                  : "Popular Destinations"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {searchResults
                ? "Destinations Found"
                : "Most Loved Places in India"}
            </h2>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No destinations match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange(5000);
                  setSearchResults(null);
                }}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  {...dest}
                  isLiked={likedDestinations.includes(dest.title)}
                  onLike={handleLike}
                  onBook={handleBook}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewAllDestinations}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg"
            >
              View All Destinations <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <Newsletter
          onSubscribe={handleNewsletterSubscribe}
          isSubscribing={isSubscribing}
        />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              TravelBharat
            </h3>
            <p className="text-gray-400">
              Discover the incredible diversity of India with our curated travel
              experiences.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  North India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  South India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  East India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  West India
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +91 12345 67890</li>
              <li>✉️ info@travelbharat.com</li>
              <li>📍 New Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2026 TravelBharat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
