import React, { useEffect, useState } from "react";
import { Checkbox } from "@material-tailwind/react";
import axios from "axios";

export default function AllFeatures({ api_url, extract, setExtract }) {
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAvailable = () => {
    setLoading(true);
    axios
      .get(`${api_url}/extractable`)
      .then(({ data }) => {
        setAvailable(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading available features:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAvailable();
    return () => setAvailable([]);
  }, []);

  const handleSelectAll = () => {
    const allFeatures = available.map((av) => av);
    setExtract(allFeatures);
  };

  const handleDeselectAll = () => {
    setExtract([]);
  };

  const handleCheckboxChange = (event, av) => {
    if (event.target.checked) {
      setExtract((curr) => [...new Set([...curr, av])]);
    } else {
      setExtract((curr) => curr.filter((e) => e !== av));
    }
  };

  return (
    <div className="h-full w-full">
      <div className="p-3">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleSelectAll}
        >
          Select All
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleDeselectAll}
        >
          Deselect All
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="capitalize">
          {available.map((av, i) => {
            return (
              <div key={`sel-opt-${av}-${i}`}>
                <Checkbox
                  label={av.replace("_", " ")}
                  id={`option-${av}`}
                  checked={extract.includes(av)}
                  onChange={(event) => handleCheckboxChange(event, av)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
