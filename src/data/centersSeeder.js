/**
 * Documenting the Database Schema & API Setup for Location Centers
 * As requested, this file mocks the structure of the Help Centers database.
 * 
 * Collection Name: help_centers
 * 
 * Fields:
 * - id: string (Document ID)
 * - name: string (Center name)
 * - type: string ("CSC", "Panchayat", "Govt Office")
 * - location: geopoint (Firebase GeoPoint / PostGIS Point for Lat/Lng)
 *   - latitude: number
 *   - longitude: number
 * - address: string
 * - phone: string
 * - state: string
 * - district: string
 * - openNow: boolean
 * - workingHours: string
 * - visitedBy: number
 */

import { collection, addDoc, getDocs, query, where, GeoPoint } from 'firebase/firestore';
import { db } from '../firebase'; // Placeholder connection

export const seedCenters = async () => {
    const centersRef = collection(db, 'help_centers');

    const mockData = [
        {
            name: "Gram Suvidha Kendra Main",
            type: "CSC",
            location: new GeoPoint(20.5937, 78.9629),
            address: "Main Road, Ward 5",
            phone: "+91 9876543210",
            state: "Maharashtra",
            district: "Pune",
            openNow: true,
            workingHours: "09:00 AM - 05:00 PM",
            visitedBy: 154
        },
        // ... generate more robust ones dynamically or via JSON upload
    ];

    try {
        for (let center of mockData) {
            await addDoc(centersRef, center);
            console.log(`Added ${center.name}`);
        }
        console.log("Seeding complete!");
    } catch (e) {
        console.error("Error seeding centers: ", e);
    }
};

/**
 * Example Backend Query:
 * To perform Geospatial queries in Firebase, you typically need to use Geohashes.
 * For advanced setups, algorithms like Haversine calculate the distance client-side 
 * OR server-side via a backend function (Node.js/Python).
 */
