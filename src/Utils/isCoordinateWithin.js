// Import required modules and JSON data
import btGeojson from "../assets/geojson/BTSample.json";
import { isPointInPolygon } from "geolib";

// Define a function that returns a Promise
const isCoordinateWithin = (newCoordinate) => {
    return new Promise((resolve, reject) => {
        
        // Define a helper function to transform polygon coordinates
        const useCustomFlatMap = (polygonCoordinates) => {
            return polygonCoordinates.map(
                (coordinate) => ({
                    latitude: coordinate[1],
                    longitude: coordinate[0],
                })
            );
        }

        // Define a function to handle polygon detection
        const handleDetection = (flattenedCoordinates, feature) => {
            // Check if the newCoordinate is inside the polygon
            const isCoordinateWithin = isPointInPolygon(
                newCoordinate,
                flattenedCoordinates
            );

            // If inside the polygon, resolve with feature information
            if (isCoordinateWithin) {
                const currentFeature = feature.properties;
                resolve({ isCoordinateWithin, currentFeature });
                return;
            }
        }

        // Loop through each feature in the GeoJSON data
        for (const feature of btGeojson.features) {
            if (feature.geometry.type === "Polygon") {
                // For a single polygon, transform and handle
                const polygonCoordinates = feature.geometry.coordinates[0];
                const flattenedCoordinates = useCustomFlatMap(polygonCoordinates);
                handleDetection(flattenedCoordinates, feature);

            } else if (feature.geometry.type === "MultiPolygon") {
                // For multi-polygons, loop through sub-polygons
                const multiPolygons = feature.geometry.coordinates;
                for (const subMultiPolygon of multiPolygons) {
                    for (const polygonCoordinates of subMultiPolygon) {
                        // Transform and handle each sub-polygon
                        const flattenedCoordinates = useCustomFlatMap(polygonCoordinates);
                        handleDetection(flattenedCoordinates, feature);
                    }
                }
            }
        }

        // If not found in any features, resolve with false
        resolve(false);
    });
};

// Export the function
export default isCoordinateWithin;
