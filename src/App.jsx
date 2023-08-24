import { useState } from "react";
import landGeoJson from "./assets/geojson/land.json";
import CoordinateInput from "./components/CoordinateInput";
import IsPointInPolygon from "./Utils/IsPointInPolygon";
import { Spinner } from "flowbite-react";
import isCoordinateWithin from "./Utils/isCoordinateWithin";

function App() {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [isOnLand, setIsOnLand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feature, setFeature] = useState(null);

  const mycoords = {
    latitude: -15.72, //-15.727785607150065 | -15.729
    longitude: 35.032, //  35.03261363956607 | 35.035
  };

  // Flatten the coordinates from GeoJSON

  const handleInputChange = (e) => {
    const new_coordinates = {
      ...coordinates,
      [e.target.name]: parseFloat(e.target.value),
    };
    setCoordinates(new_coordinates);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await isCoordinateWithin(coordinates);
      console.log("res:", res);
      setIsLoading(false);
    } catch (error) {
      console.log('error', error)
    }
  };
  return (
    <div className="w-full h-screen flex flex-col items-center pt-10  ">
      <h1 className="text-4xl font-semibold text-dark-blue ">
        Land Detection App
      </h1>
      <form className="w-1/2" onSubmit={handleSubmit}>
        <CoordinateInput
          label="latitude"
          placeholder="Enter the x-coordinate"
          value={coordinates.latitude}
          name={"latitude"}
          onChange={handleInputChange}
        />
        <CoordinateInput
          label="longitude"
          placeholder="Enter the y-coordinate"
          value={coordinates.longitude}
          name={"longitude"}
          onChange={handleInputChange}
        />

        <button
          className="text-white  right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          // disabled={(!coordinates.x || !coordinates.y) || isLoading}
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? (
            <span className="flex space-x-3">
              <Spinner size="xs" aria-label="Default status example" />{" "}
              <p>Calculating...</p>{" "}
            </span>
          ) : (
            <p>Submit for Detection</p>
          )}
        </button>
      </form>
    </div>
  );
}

export default App;
