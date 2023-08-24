import React from 'react'

const IsPointInPolygon = (polygonCoordinates, coordinate) => {
    const x = coordinate[0];
    const y = coordinate[1];
    let inside = false;

    for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
        const xi = polygonCoordinates[i][0];
        const yi = polygonCoordinates[i][1];
        const xj = polygonCoordinates[j][0];
        const yj = polygonCoordinates[j][1];

        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
};


export default IsPointInPolygon