import { useState } from "react";
import landGeoJson from "./assets/geojson/land.json";
import btGeojson from "./assets/geojson/BTSample.json";
import CoordinateInput from "./components/CoordinateInput";
import IsPointInPolygon from "./Utils/IsPointInPolygon";
import sleep from "./Utils/sleep";
import { Spinner } from "flowbite-react";

function App() {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isOnLand, setIsOnLand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feature, setFeature] = useState(null);

  const handleInputChange = (e) => {
    const new_coordinates = {
      ...coordinates,
      [e.target.name]: parseFloat(e.target.value),
    };
    setCoordinates(new_coordinates);
  };

  const isCoordinateOnLand = (coordinate) => {
    for (const feature of btGeojson.features) {
      if (feature.geometry.type === "Polygon"){
        const polygonCoordinates = feature.geometry.coordinates[0];
        console.log('polygon... searching', )
        if (IsPointInPolygon(polygonCoordinates, coordinate)) {
          setFeature(feature);
          return true;
        }
      } else if (feature.geometry.type === "MultiPolygon"){
        const multiPolygonCoordinates = feature.geometry.coordinates;
        for(const polygon of multiPolygonCoordinates){
          for(const subPolygon of polygon){
            for(const polygonCoordinates of subPolygon){
              console.log('multipolygon... searching')
              setIsLoading(true)
              if (IsPointInPolygon(polygonCoordinates, coordinate)) {
                setFeature(feature);
                return true;
              }
            }
          }
        }
      } 
    }
    return false;
    // setFeature(null)
  };
  const handleSubmit = async (e) => {
    // setIsLoading(true);
    e.preventDefault();
    const coordinates_array = [coordinates.y, coordinates.x];
    const isFoundOnLand = isCoordinateOnLand(coordinates_array);
    setTimeout(() => setIsLoading(false), 900);
    setIsOnLand(isFoundOnLand);
    console.log("coordinates isOnLand?", isOnLand);
    console.log("Here is The feature", feature?.properties);
  };
  return (
    <div className="w-full h-screen flex flex-col items-center pt-10  ">
      <h1 className="text-4xl font-semibold text-dark-blue ">
        Land Detection App
      </h1>
      <form className="w-1/2" onSubmit={handleSubmit}>
        <CoordinateInput
          label="X-Coordinate"
          placeholder="Enter the x-coordinate"
          value={coordinates.x}
          name={"x"}
          onChange={handleInputChange}
        />
        <CoordinateInput
          label="Y-Coordinate"
          placeholder="Enter the y-coordinate"
          value={coordinates.y}
          name={"y"}
          onChange={handleInputChange}
        />

        {}
        <button
          className="text-white  right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          // disabled={(!coordinates.x || !coordinates.y) || isLoading}
          disabled={isLoading}
          type="submit"
        >
          { isLoading ?  
            <span className='flex space-x-3' >
              <Spinner  size='xs' aria-label="Default status example" />{" "}
              <p >Calculating...</p>{" "}
            </span>
           : (<p>Submit for Detection</p>
          ) }
        </button>
      </form>  
    </div>
  );
}

export default App;
