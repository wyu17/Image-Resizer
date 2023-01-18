import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";

import { AugmentedFile } from "./shared";
import Resizer from "./Resizer";

const ImageDropzone: React.FunctionComponent = () => {
  const [file, setFile] = useState<AugmentedFile | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const droppedFile = acceptedFiles[0];
      const img = new Image();
      img.src = window.URL.createObjectURL(droppedFile);
      img.onload = () => {
        if (file) {
          URL.revokeObjectURL(file.preview.src);
        }

        setFile(
          Object.assign(droppedFile, {
            id: uuidv4(),
            preview: img,
          })
        );
      };
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    // Revoke data url on unmount
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview.src);
      }
    };
  }, [file]);

  return (
    <>
      <div className="dropzone" {...getRootProps()}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          <p className="dropzone-content">Drag an image here to resize!</p>
        </div>
      </div>
      {/* Reset resizer state whenever a new file is uploaded.*/}
      <aside>{file && <Resizer key={file.id} file={file} />}</aside>
    </>
  );
};

export default ImageDropzone;
