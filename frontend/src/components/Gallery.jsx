import { useState, useEffect } from "react";
import Dropzone from "./Dropzone";

export default function Gallery({ files, setFiles }) {
  return (
    <div className="overflow-y-auto h-96 w-full">
      {files.length > 0 ? (
        <>
          <div className="p-3">{files.length} Files added</div>
        </>
      ) : (
        <Dropzone setFiles={setFiles} />
      )}
    </div>
  );
}

function Images({ files }) {
  return (
    <div className="flex items-start justify-start flex-wrap w-full h-full">
      {files.map(({ dataURL }, i) => (
        <Image url={dataURL} key={`image-${i}`} />
      ))}
    </div>
  );
}

function Image({ url }) {
  return (
    <div className="p-3 h-48 w-auto">
      <div className="border rounded-md w-full h-full">
        <img src={url} className="w-full h-full" />
      </div>
    </div>
  );
}
