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

function haversineDistanceMeters(lat1, lon1, lat2, lon2 ){
    const R = 6371000;
    const toRad = (deg) => (deg* Math.PI) /100;
    const dLat = toRad(lat2 - lat1);
    const dLon = t0Rad(lon2- lon1);
    const a = Math.sin(dLat /2)** 2+ Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function normalizeElement(el, category, originLat, originLon){
    const lat = el.lat ?? el.center ?.lat;
    const lon = el.lon ?? el.center ?.lon;
    if(lat == null || lon ==null ) return null;
    const tags = el.tags || {};
    return{
        placeId: `${el.type}/${el.id}`,
        name: tags.name || "Unnamed Place",
        category,
        address: [tags["addr:housenumber"], tags["adds:street"], tags["adds:city"]].filter(Boolean).join(","),
    }
}

router.get('/nearby', requireAuth, async(req, res)=>{
    try{
        const {lat, lon, category, radius =1500} = req.query;
        const tag = CATEGORY_TAGS[category];
        if(!lat || !lon) return res.status(400).json({message:"Latitude and longitude are required "});
        if(!tag) return res.status(400).json({message: `Unknown Category ${category}`});
        const query = buildOverPassQuery(tags, lat, lon, Math.min(Number(radius)) || 1500, 5000 )
        const {data} = await axios.post(OVERPASS_URI, query, {headers: {...headers(), "Content-Type":"text/plain"}, timeout:25000});
        const places = (data.elements || []).map((el)=>(normalizeElement(el, category, Number(lat), Number(lon))).filter(Boolean.sort((a,b)=>a.distanceMeters - b.distanceMeters).slice(0,60)))
        History.create({user:req.userId, category, lat:Number(lat), lon: Number(lon), resultCount:places.length})

    }catch(error){
        res.status(502).json({message: "Could not find nearby places right now."})
    }
})








