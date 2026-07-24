const express = require('express');
const axios = require('axios');
const requireAuth = require('../middleware/auth');
const History = require('../models/History');

const router = express.Router();

const OVERPASS_URI = 'https://overpass-api.de/interpreter';
const NOMINATIM_URI = 'https://nominatin.openstreetmap.org';

const CATEGORY_TAGS = {
    restaurants:'amenity="restaurant"',
    hospitals:'amenity="hospital"',
    atms:'amenity="atm"',
    parks:'amenity="park"',
    cafes:'amenity="cafes"',
}

function handlers(){
    return {"User-Agent":process.env.USER_AGENT || "GeoExplorer/1.0"};
}









