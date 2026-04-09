// BookNow.jsx - Fixed with proper email integration
import React, { useState } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Search,
  Plane,
  Train,
  Bus,
  Car,
  Hotel,
  ArrowRight,
  ChevronDown,
  Shield,
  Headphones,
  Award,
  TrendingUp,
  Eye,
  Clock,
  Zap,
  X,
  Check,
  Loader,
} from "lucide-react";
import { api, handleApiError } from "../services/api";

const BookNow = () => {
  const [activeTab, setActiveTab] = useState("hotel");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    date: new Date().toISOString().split("T")[0],
    guests: "1",
    class: "Economy",
  });

  const tabs = [
    {
      id: "hotel",
      label: "Hotels",
      icon: Hotel,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "flight",
      label: "Flights",
      icon: Plane,
      color: "from-sky-500 to-blue-600",
    },
    {
      id: "train",
      label: "Trains",
      icon: Train,
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "bus",
      label: "Buses",
      icon: Bus,
      color: "from-violet-500 to-purple-600",
    },
    { id: "cab", label: "Cabs", icon: Car, color: "from-rose-500 to-pink-600" },
  ];

  // ==================== 100+ INDIAN DESTINATIONS DATA ====================

  const indianCities = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Ahmedabad",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Amritsar",
    "Allahabad",
    "Ranchi",
    "Gwalior",
    "Jabalpur",
    "Coimbatore",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Guwahati",
    "Chandigarh",
    "Mysore",
    "Tirupati",
    "Gurugram",
    "Bhubaneswar",
    "Warangal",
    "Kochi",
    "Dehradun",
    "Udaipur",
    "Shimla",
    "Manali",
    "Darjeeling",
    "Leh",
    "Gangtok",
    "Port Blair",
    "Dwarka",
    "Rameswaram",
    "Hampi",
    "Khajuraho",
    "Mahabalipuram",
    "Alleppey",
    "Munnar",
    "Ooty",
    "Kodaikanal",
    "Mount Abu",
    "Lonavala",
    "Coorg",
    "Shillong",
    "Kaziranga",
    "Goa",
    "Diu",
    "Puducherry",
    "Rishikesh",
    "Haridwar",
    "Mathura",
    "Vrindavan",
    "Bodh Gaya",
    "Nainital",
    "Mussoorie",
    "Kullu",
    "Dharamshala",
    "Pushkar",
  ];

  const randomRating = () => (3.5 + Math.random() * 1.5).toFixed(1);
  const randomReviews = () => Math.floor(Math.random() * 3000) + 50;
  const randomPrice = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const hotelNames = [
    "Taj",
    "ITC Grand",
    "Radisson Blu",
    "Hyatt Regency",
    "Lemon Tree",
    "The Fern",
    "Fortune Park",
    "Country Inn",
    "Ramada",
    "Holiday Inn",
    "The Lalit",
    "Neemrana Palace",
    "Clarks Inn",
    "Vivanta",
    "Novotel",
    "Crown Plaza",
    "The Park",
    "FabHotel",
    "Treebo Trend",
    "OYO Townhouse",
  ];

  const hotels = Array.from({ length: 48 }, (_, i) => {
    const city = indianCities[i % indianCities.length];
    const name = hotelNames[i % hotelNames.length] + " " + city;
    const price = randomPrice(1800, 15000);
    const discount = randomPrice(5, 35);
    return {
      id: i + 1,
      name,
      location:
        city +
        ", " +
        ["City Center", "MG Road", "Airport Road", "Lake Side", "Hill View"][
          i % 5
        ],
      price,
      originalPrice: Math.round(price * (1 + discount / 100)),
      rating: parseFloat(randomRating()),
      reviews: randomReviews(),
      image: `https://picsum.photos/id/${(i % 100) + 200}/400/300`,
      amenities: ["WiFi", "AC", "Breakfast", "Parking", "Restaurant"].slice(
        0,
        randomPrice(2, 4),
      ),
      discount,
      popular: i % 7 === 0,
    };
  });

  const airlines = [
    "IndiGo",
    "Air India",
    "SpiceJet",
    "Vistara",
    "Akasa Air",
    "Alliance Air",
    "Go First",
    "AirAsia India",
  ];
  const flights = Array.from({ length: 42 }, (_, i) => {
    let fromCity = indianCities[i % indianCities.length];
    let toCity = indianCities[(i + 7) % indianCities.length];
    if (fromCity === toCity)
      toCity = indianCities[(i + 13) % indianCities.length];
    const price = randomPrice(2200, 18500);
    const stops =
      randomPrice(0, 2) === 0
        ? "Non-stop"
        : randomPrice(0, 1) === 0
          ? "1 stop"
          : "2 stops";
    return {
      id: i + 1,
      airline: airlines[i % airlines.length],
      from: fromCity.slice(0, 3).toUpperCase(),
      to: toCity.slice(0, 3).toUpperCase(),
      fromFull: fromCity,
      toFull: toCity,
      departure: `${randomPrice(5, 11)}:${randomPrice(0, 59)} ${randomPrice(0, 1) === 0 ? "AM" : "PM"}`,
      arrival: `${randomPrice(12, 23)}:${randomPrice(0, 59)} ${randomPrice(0, 1) === 0 ? "PM" : "AM"}`,
      duration: `${randomPrice(1, 3)}h ${randomPrice(10, 55)}m`,
      price,
      stops,
    };
  });

  const trainNames = [
    "Shatabdi Exp",
    "Rajdhani Exp",
    "Duronto Exp",
    "Garib Rath",
    "Jan Shatabdi",
    "Tejas Express",
    "Humsafar Exp",
    "Vande Bharat",
    "Deccan Queen",
    "Chennai Mail",
    "Mumbai Express",
    "Howrah Mail",
    "Sampark Kranti",
  ];
  const trains = Array.from({ length: 38 }, (_, i) => {
    let fromCity = indianCities[i % indianCities.length];
    let toCity = indianCities[(i + 11) % indianCities.length];
    if (fromCity === toCity)
      toCity = indianCities[(i + 19) % indianCities.length];
    const price = randomPrice(350, 5500);
    return {
      id: i + 1,
      name: trainNames[i % trainNames.length] + " " + ((i % 20) + 1),
      from: fromCity,
      to: toCity,
      departure: `${String(randomPrice(0, 23)).padStart(2, "0")}:${String(randomPrice(0, 59)).padStart(2, "0")}`,
      arrival: `${String(randomPrice(0, 23)).padStart(2, "0")}:${String(randomPrice(0, 59)).padStart(2, "0")}`,
      duration: `${randomPrice(4, 28)}h ${randomPrice(10, 55)}m`,
      price,
      classes: [
        "Sleeper",
        "AC 3 Tier",
        "AC 2 Tier",
        "1st AC",
        "Chair Car",
      ].slice(0, randomPrice(2, 4)),
    };
  });

  const busNames = [
    "Volvo AC Sleeper",
    "Scania AC",
    "Mercedes Benz",
    "Bharat Benz",
    "Tata AC Seater",
    "Ashok Leyland",
    "Garuda Plus",
    "Rajdhani Travels",
    "Orange Tours",
    "VRL Travels",
    "KPN Travels",
    "SRS Travels",
  ];
  const buses = Array.from({ length: 32 }, (_, i) => {
    let fromCity = indianCities[i % indianCities.length];
    let toCity = indianCities[(i + 9) % indianCities.length];
    if (fromCity === toCity)
      toCity = indianCities[(i + 17) % indianCities.length];
    const price = randomPrice(300, 3500);
    return {
      id: i + 1,
      name: busNames[i % busNames.length] + " " + ((i % 15) + 1),
      from: fromCity,
      to: toCity,
      departure: `${String(randomPrice(0, 23)).padStart(2, "0")}:${String(randomPrice(0, 59)).padStart(2, "0")}`,
      arrival: `${String(randomPrice(0, 23)).padStart(2, "0")}:${String(randomPrice(0, 59)).padStart(2, "0")}`,
      duration: `${randomPrice(2, 12)}h ${randomPrice(10, 55)}m`,
      price,
      seats: randomPrice(12, 50),
      rating: parseFloat(randomRating()),
    };
  });

  const cabTypes = [
    "Hatchback (Swift/i10)",
    "Sedan (Etios/Dzire)",
    "SUV (Innova/Creta)",
    "Luxury (Mercedes/E-Class)",
    "Mini Bus (12 Seater)",
    "Tempo Traveller",
    "Electric (Nexon EV)",
    "Premium Sedan (City/Verna)",
  ];
  const cabs = Array.from({ length: 26 }, (_, i) => {
    const baseType = cabTypes[i % cabTypes.length];
    const price = randomPrice(500, 9000);
    const capacity = baseType.includes("Hatchback")
      ? 4
      : baseType.includes("Sedan")
        ? 4
        : baseType.includes("SUV")
          ? 6
          : baseType.includes("Mini")
            ? 12
            : 7;
    return {
      id: i + 1,
      type: baseType,
      capacity,
      luggage: Math.floor(capacity / 2),
      price,
      image: `https://picsum.photos/id/${(i % 80) + 300}/400/250`,
      features: ["AC", "GPS", "Water", "Clean", "WiFi", "Snacks"].slice(
        0,
        randomPrice(2, 4),
      ),
    };
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed! Showing best Indian deals ✨");
    }, 1000);
  };

  const showToast = (message, isError = false) => {
    const toast = document.createElement("div");
    toast.className = `fixed top-20 right-4 ${isError ? "bg-red-500" : "bg-green-500"} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2`;
    toast.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isError ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"}"></path></svg>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleBooking = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowBookingModal(true);
  };

  const handleCustomerDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCustomerDetails((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // FIXED confirmBooking function - all validation issues resolved
  const confirmBooking = async () => {
    if (
      !customerDetails.name ||
      !customerDetails.email ||
      !customerDetails.phone
    ) {
      showToast("Please fill in all customer details", true);
      return;
    }

    setLoading(true);

    try {
      // Get travel date based on booking type
      let travelDate = new Date();
      if (activeTab === "hotel") {
        travelDate = searchParams.checkIn
          ? new Date(searchParams.checkIn)
          : new Date();
      } else if (
        activeTab === "flight" ||
        activeTab === "train" ||
        activeTab === "bus"
      ) {
        travelDate = searchParams.date
          ? new Date(searchParams.date)
          : new Date();
      } else {
        travelDate = new Date();
        travelDate.setDate(travelDate.getDate() + 1);
      }

      const bookingData = {
        userId: "guest",
        bookingType: activeTab,
        bookingDetails: {
          itemId: selectedItem.id,
          itemName:
            selectedItem.name || selectedItem.airline || selectedItem.type,
          from: selectedItem.from || selectedItem.location,
          to: selectedItem.to,
          departure: selectedItem.departure,
          arrival: selectedItem.arrival,
          duration: selectedItem.duration,
          amenities: selectedItem.amenities || [],
          features: selectedItem.features || [],
          capacity: selectedItem.capacity,
          seats: selectedItem.seats,
          stops: selectedItem.stops,
          class: searchParams.class || "Economy",
        },
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: {
            street: customerDetails.address?.street || "",
            city: customerDetails.address?.city || "",
            state: customerDetails.address?.state || "",
            pincode: customerDetails.address?.pincode || "",
            country: "India",
          },
        },
        travelDetails: {
          date: travelDate.toISOString(), // ✅ REQUIRED - FIXED
          returnDate:
            activeTab === "hotel" && searchParams.checkOut
              ? new Date(searchParams.checkOut).toISOString()
              : null,
          travelers: parseInt(searchParams.guests) || 1,
          from: selectedItem.from || selectedItem.location || searchParams.from,
          to: selectedItem.to || searchParams.to,
          preferences: {
            meals: "none", // ✅ Valid enum value
            accommodation: "standard", // ✅ Valid enum value - FIXED (was null)
          },
        },
        paymentDetails: {
          amount: selectedItem.price,
          currency: "INR",
          paymentMethod: "card",
          status: "completed",
        },
        status: "confirmed",
        specialRequests: "",
      };

      console.log(
        "Sending booking data:",
        JSON.stringify(bookingData, null, 2),
      );

      const response = await api.createBooking(bookingData);

      if (response.success) {
        setBookingSuccess(true);
        setShowBookingModal(false);
        showToast(
          `✅ Booking confirmed! Email sent to ${customerDetails.email}`,
        );

        // Reset form
        setCustomerDetails({
          name: "",
          email: "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
          },
        });

        setTimeout(() => setBookingSuccess(false), 5000);
      } else {
        throw new Error(response.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Booking failed. Please try again.";
      showToast(errorMsg, true);
      setBookingError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchForm = () => {
    const inputClasses =
      "w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/90 backdrop-blur-sm";
    const iconClasses =
      "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5";

    if (activeTab === "hotel") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group">
            <MapPin className={iconClasses} />
            <input
              type="text"
              placeholder="City or Hotel Name"
              className={inputClasses}
              value={searchParams.to}
              onChange={(e) =>
                setSearchParams({ ...searchParams, to: e.target.value })
              }
            />
          </div>
          <div className="relative group">
            <Calendar className={iconClasses} />
            <input
              type="date"
              className={inputClasses}
              value={searchParams.checkIn}
              onChange={(e) =>
                setSearchParams({ ...searchParams, checkIn: e.target.value })
              }
            />
          </div>
          <div className="relative group">
            <Calendar className={iconClasses} />
            <input
              type="date"
              className={inputClasses}
              value={searchParams.checkOut}
              onChange={(e) =>
                setSearchParams({ ...searchParams, checkOut: e.target.value })
              }
            />
          </div>
          <div className="relative group">
            <Users className={iconClasses} />
            <select
              className={inputClasses}
              value={searchParams.guests}
              onChange={(e) =>
                setSearchParams({ ...searchParams, guests: e.target.value })
              }
            >
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
            </select>
          </div>
        </div>
      );
    }
    if (activeTab === "flight") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative group">
            <Plane className={iconClasses} />
            <input
              type="text"
              placeholder="From"
              className={inputClasses}
              value={searchParams.from}
              onChange={(e) =>
                setSearchParams({ ...searchParams, from: e.target.value })
              }
            />
          </div>
          <div className="relative group">
            <Plane className={`${iconClasses} transform rotate-90`} />
            <input
              type="text"
              placeholder="To"
              className={inputClasses}
              value={searchParams.to}
              onChange={(e) =>
                setSearchParams({ ...searchParams, to: e.target.value })
              }
            />
          </div>
          <div className="relative group">
            <Calendar className={iconClasses} />
            <input
              type="date"
              className={inputClasses}
              value={searchParams.date}
              onChange={(e) =>
                setSearchParams({ ...searchParams, date: e.target.value })
              }
            />
          </div>
          <div className="relative group">
            <Users className={iconClasses} />
            <select
              className={inputClasses}
              value={searchParams.guests}
              onChange={(e) =>
                setSearchParams({ ...searchParams, guests: e.target.value })
              }
            >
              <option>1 Passenger</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
          <div className="relative group">
            <select
              className={inputClasses}
              value={searchParams.class}
              onChange={(e) =>
                setSearchParams({ ...searchParams, class: e.target.value })
              }
            >
              <option>Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative group">
          <MapPin className={iconClasses} />
          <input type="text" placeholder="From" className={inputClasses} />
        </div>
        <div className="relative group">
          <MapPin className={iconClasses} />
          <input type="text" placeholder="To" className={inputClasses} />
        </div>
        <div className="relative group">
          <Calendar className={iconClasses} />
          <input type="date" className={inputClasses} />
        </div>
        <div className="relative group">
          <Users className={iconClasses} />
          <select className={inputClasses}>
            <option>1 Traveler</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (activeTab === "hotel") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {hotel.discount}% OFF
                </div>
                {hotel.popular && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Popular
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-500">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-sm">{hotel.rating}</span>
                    <span className="text-gray-400 text-xs">
                      ({hotel.reviews})
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {hotel.location}
                </p>
                <div className="flex gap-3 mb-4">
                  {hotel.amenities.map((a, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-lg"
                    >
                      <Check className="w-3 h-3" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{hotel.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-gray-400 text-xs">per night</p>
                  </div>
                  <button
                    onClick={() => handleBooking(hotel, "hotel")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === "flight") {
      return (
        <div className="space-y-4">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{flight.airline}</p>
                    <p className="text-sm text-gray-500">{flight.stops}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-1 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{flight.departure}</p>
                    <p className="text-gray-500 text-sm">{flight.fromFull}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">{flight.duration}</p>
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{flight.arrival}</p>
                    <p className="text-gray-500 text-sm">{flight.toFull}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{flight.price.toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => handleBooking(flight, "flight")}
                      className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-semibold"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === "train") {
      return (
        <div className="space-y-4">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <Train className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{train.name}</p>
                    <div className="flex gap-2 mt-1">
                      {train.classes.slice(0, 2).map((cls, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-1 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{train.departure}</p>
                    <p className="text-gray-500 text-sm">{train.from}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">{train.duration}</p>
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{train.arrival}</p>
                    <p className="text-gray-500 text-sm">{train.to}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{train.price.toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => handleBooking(train, "train")}
                      className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-semibold"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === "bus") {
      return (
        <div className="space-y-4">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <Bus className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{bus.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-sm">{bus.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-1 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{bus.departure}</p>
                    <p className="text-gray-500 text-sm">{bus.from}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">{bus.duration}</p>
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{bus.arrival}</p>
                    <p className="text-gray-500 text-sm">{bus.to}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{bus.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {bus.seats} seats left
                    </p>
                    <button
                      onClick={() => handleBooking(bus, "bus")}
                      className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-semibold"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === "cab") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cabs.map((cab) => (
            <div
              key={cab.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={cab.image}
                  alt={cab.type}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-3">{cab.type}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Up to {cab.capacity} passengers</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cab.features.map((f, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{cab.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-gray-400 text-xs">per trip</p>
                  </div>
                  <button
                    onClick={() => handleBooking(cab, "cab")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const gradientClass = currentTab
    ? currentTab.color
    : "from-orange-500 to-red-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-gray-700 font-semibold">
              Processing your booking...
            </p>
          </div>
        </div>
      )}

      {showBookingModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Complete Your Booking
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600">
                <strong>📦 Item:</strong>{" "}
                {selectedItem.name || selectedItem.airline || selectedItem.type}
              </p>
              <p className="text-gray-600">
                <strong>💰 Price:</strong> ₹
                {selectedItem.price?.toLocaleString("en-IN")}
              </p>
              <p className="text-gray-600">
                <strong>🏷️ Type:</strong> {selectedItem.type}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-lg">Customer Details</h4>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={customerDetails.name}
                onChange={handleCustomerDetailsChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={customerDetails.email}
                onChange={handleCustomerDetailsChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={customerDetails.phone}
                onChange={handleCustomerDetailsChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                required
              />
              <input
                type="text"
                name="address.street"
                placeholder="Street Address"
                value={customerDetails.address.street}
                onChange={handleCustomerDetailsChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={customerDetails.address.city}
                  onChange={handleCustomerDetailsChange}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  name="address.state"
                  placeholder="State"
                  value={customerDetails.address.state}
                  onChange={handleCustomerDetailsChange}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
              <input
                type="text"
                name="address.pincode"
                placeholder="Pincode"
                value={customerDetails.address.pincode}
                onChange={handleCustomerDetailsChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={confirmBooking}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Confirm & Pay ₹{selectedItem.price?.toLocaleString("en-IN")}
            </button>
          </div>
        </div>
      )}

      {bookingSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2">
          <Check className="w-5 h-5" />
          Booking confirmed! Email sent successfully! 🇮🇳
        </div>
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div
        className={`relative bg-gradient-to-r ${gradientClass} text-white pt-28 pb-20 overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up">
            Book Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
              Indian Adventure
            </span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            100+ Destinations | Best Prices in ₹ | 24/7 Support | Incredible
            India
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div className="flex flex-wrap border-b border-gray-200/50 bg-white/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 relative group ${activeTab === tab.id ? "text-orange-500" : "text-gray-500 hover:text-orange-400"}`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? "text-orange-500" : ""}`}
                  />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-slide-in" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSearch}>
              {renderSearchForm()}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 group-hover:animate-pulse" />
                  )}
                  Search Now{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Best{" "}
              {activeTab === "hotel"
                ? "Stays"
                : activeTab === "flight"
                  ? "Flights"
                  : activeTab === "train"
                    ? "Trains"
                    : activeTab === "bus"
                      ? "Buses"
                      : "Rides"}{" "}
              Across India
            </h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                <TrendingUp className="w-4 h-4" /> Recommended{" "}
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                <Eye className="w-4 h-4" /> Quick View
              </button>
            </div>
          </div>
          {renderResults()}
        </div>

        <div className="mt-20 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <p className="text-gray-500 mt-2">
              Experience the best travel services with our premium features
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Best Price Guarantee",
                desc: "We guarantee the best prices on all bookings",
                color: "from-emerald-400 to-teal-500",
              },
              {
                icon: Headphones,
                title: "24/7 Customer Support",
                desc: "Round-the-clock assistance for all your needs",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: Clock,
                title: "Easy Cancellation",
                desc: "Free cancellation up to 24 hours before",
                color: "from-amber-400 to-orange-500",
              },
              {
                icon: Award,
                title: "Rewards Program",
                desc: "Earn points on every booking & get exclusive perks",
                color: "from-purple-400 to-pink-500",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da')] opacity-10 bg-cover bg-center" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-2">
              Get Exclusive Deals 🇮🇳
            </h3>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter and get 10% off your first booking
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl border-0 focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        .animate-blob { animation: blob 7s infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

const Star = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
};

export default BookNow;
