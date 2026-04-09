const TouristPlace = require('../models/TouristPlace');

// 1. Create a new Tourist Place
exports.createPlace = async (req, res) => {
  try {
    const newPlace = new TouristPlace(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. UPDATED: Get all Places (with Search and Filtering!)
exports.getAllPlaces = async (req, res) => {
  try {
    // Create an empty filter object. 
    // If no query params are sent, this stays empty and finds ALL places.
    let filter = {};

    // Destructure the possible query parameters from the request URL
    const { stateId, cityId, categoryId, search } = req.query;

    // Build the filter dynamically based on what the user asked for
    if (stateId) {
      filter.stateId = stateId;
    }
    
    if (cityId) {
      filter.cityId = cityId;
    }
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Implement Text Search
    if (search) {
      // Use MongoDB's $regex operator for partial matching. 
      // $options: 'i' makes it case-insensitive.
      filter.name = { $regex: search, $options: 'i' };
    }

    // Execute the query using our dynamic filter object
    const places = await TouristPlace.find(filter)
      .populate('stateId', 'name code') 
      .populate('cityId', 'name')       
      .populate('categoryId', 'name'); 
      
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get a single place by its Slug
exports.getPlaceBySlug = async (req, res) => {
  try {
    const place = await TouristPlace.findOne({ slug: req.params.slug })
      .populate('stateId', 'name')
      .populate('cityId', 'name');
      
    if (!place) return res.status(404).json({ message: 'Place not found' });
    
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};