"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
// utils/geoUtils.ts
const EARTH_RADIUS_M = 6371 * 1000;
const TO_RAD = Math.PI / 180;
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (![-90, 90, -180, 180].every((limit) => Math.abs(lat1) <= limit && Math.abs(lon1) <= limit))
        throw new Error("Invalid coordinates");
    const φ1 = lat1 * TO_RAD;
    const φ2 = lat2 * TO_RAD;
    const Δφ = (lat2 - lat1) * TO_RAD;
    const Δλ = (lon2 - lon1) * TO_RAD;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
