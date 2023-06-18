import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Gallery from "./Gallery";
import axios from "axios";
import AllFeatures from "./AllFeatures";
import Papa, { parse } from "papaparse";
import { ImSpinner8 } from "react-icons/im";
import { BsDownload } from "react-icons/bs";
import download from "../function/download";

function divideIntoChunks(a, n) {
  const chunks = [];

  for (let i = 0; i < a.length; i += n) {
    const chunk = a.slice(i, i + n);
    chunks.push(chunk);
  }

  return chunks;
}

export default function Main() {
  const [files, setFiles] = useState([]);
  const [extract, setExtract] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csv, setCsv] = useState("");
  const api_url = import.meta.env.VITE_API_URL;

  const sendFiles = async () => {
    setLoading(true);
    console.log("Sending Files...");
    const fileChunks = divideIntoChunks(files, 1000);
    var responseChunks = fileChunks.map((chunk) => {
      const filesdata = JSON.stringify({ files: chunk, extract });
      return axios.post(api_url, [filesdata], {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
    const af = await Promise.all(responseChunks);
    var csvArray = af.map(({ data }) => {
      return data.map((data) => {
        return {
          filename: data.filename,
          ...data.features,
        };
      });
    });
    var parseCsv = [];
    for (var i = 0; i < csvArray.length; i++) {
      for (var j = 0; j < csvArray[i].length; j++) {
        parseCsv.push(csvArray[i][j]);
      }
    }
    console.log(parseCsv);
    var csv = Papa.unparse(parseCsv);
    setCsv(csv);
    setLoading(false);
  };

  const downloadCSV = async () => {
    var date = new Date();
    date = date.toLocaleString();
    download(`feature-ext-${date}.csv`, csv);
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="h-1/12">
        <div className="py-5 font-bold text-xl text-gray-700">
          <h2>Image Feature Extractor</h2>
        </div>
      </div>
      <div className="flex items-center justify-center grow w-full">
        <div className="grow h-full">
          <div className="p-3">
            <div className="w-full h-full bg-white rounded-md border shadow flex items-center justify-center">
              <Gallery files={files} setFiles={setFiles} />
            </div>
          </div>
        </div>
        <div className="w-4/12 h-full">
          <div className="p-3 h-full">
            <div className="w-full h-96 overflow-y-scroll bg-white rounded-md border shadow">
              <AllFeatures
                api_url={api_url}
                extract={extract}
                setExtract={setExtract}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-1/12">
        <div className="flex items-center justify-center h-full w-full p-6">
          <div className="px-2">
            <Button
              variant="gradient"
              color="red"
              size="lg"
              onClick={() => {
                setFiles([]);
                setExtract([]);
                setCsv("");
                setLoading(false);
              }}
            >
              Clear
            </Button>
          </div>
          <div className="px-2">
            {csv ? (
              <Button
                size="lg"
                className="flex text-white items-center justify-center"
                variant="gradient"
                color="green"
                onClick={() => downloadCSV()}
              >
                <span className="mr-2">
                  <BsDownload />
                </span>
                <span>Download</span>
              </Button>
            ) : (
              <Button
                variant="gradient"
                color="blue"
                size="lg"
                disabled={files.length == 0 || loading || extract.length == 0}
                onClick={() => sendFiles()}
              >
                {loading ? (
                  <div>
                    <span className="flex items-center text-xl h-5 w-5 animate-spin">
                      <ImSpinner8 />
                    </span>
                  </div>
                ) : (
                  <div>Go !</div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
