import React, { useState } from "react";
import { AugmentedFile, uploadLambda, resizeLambda } from "./shared";
import { Oval } from "react-loader-spinner";
import NumberInput from "./NumberInput";

type Props = {
  file: AugmentedFile;
};

const THUMBNAIL_SIZE = 600;
const VALID_MIMETYPES = ["image/jpeg", "image/png"];

const Resizer: React.FunctionComponent<Props> = ({ file }) => {
  const [resizeHeight, setResizeHeight] = useState<number>(file.preview.height);
  const [resizeWidth, setResizeWidth] = useState<number>(file.preview.width);

  const [isLoadingResize, setIsLoadingResize] = useState<boolean>(false);
  const [resizedURL, setResizedUrl] = useState<string | null>(null);

  const onClick = async () => {
    if (!VALID_MIMETYPES.includes(file.type)) {
      return;
    }

    setIsLoadingResize(true);
    const uploadParams = new URLSearchParams({ type: file.type });
    try {
      const uploadResponse = await fetch(`${uploadLambda}?${uploadParams}`);
      if (!uploadResponse.ok) {
        setIsLoadingResize(false);
        return;
      }
      const uploadJson = await uploadResponse.json();

      const uploadResult = await fetch(uploadJson.uploadURL, {
        method: "PUT",
        body: file,
      });
      if (!uploadResponse.ok) {
        setIsLoadingResize(false);
        return;
      }

      const resizeParams = new URLSearchParams({
        url: uploadResult.url.split("?")[0],
        height: resizeHeight.toString(),
        width: resizeWidth.toString(),
      });

      const resizeResponse = await fetch(`${resizeLambda}?${resizeParams}`);
      if (!resizeResponse.ok) {
        setIsLoadingResize(false);
        return;
      }

      const resizeJson = await resizeResponse.json();
      setResizedUrl(resizeJson.resizedUrl);
      setIsLoadingResize(false);
    } catch (e) {
      setIsLoadingResize(false);
    }
  };

  // Get height to width ratios so that the preview fits within the thumbnail box
  const heightRatio = Math.min(file.preview.height / file.preview.width, 1);
  const widthRatio = Math.min(file.preview.width / file.preview.height, 1);

  const thumbNail = (
    <div className="resizerThumbnail">
      <img
        src={file.preview.src}
        height={heightRatio * THUMBNAIL_SIZE}
        width={widthRatio * THUMBNAIL_SIZE}
        alt={"A thumbnail showing the uploaded img to resize."}
      />
    </div>
  );

  const resizeSettings = (
    <div className="resizerSettings">
      <h1>Resize Settings</h1>
      <div>
        <h3> Width </h3>
        <NumberInput initial={resizeWidth} callback={setResizeWidth} />
      </div>
      <div>
        <h3> Height </h3>
        <NumberInput initial={resizeHeight} callback={setResizeHeight} />
      </div>
      <button onClick={onClick} className="btn">
        Resize Image
      </button>
    </div>
  );

  return (
    <>
      {resizedURL && (
        <button
          className="btn btn-download"
          onClick={() => window.open(resizedURL)}
        >
          Download your resized image!
        </button>
      )}
      {isLoadingResize && !resizedURL && (
        <div className="spinner">
          <Oval
            color="black"
            secondaryColor="black"
            strokeWidth={5}
            width={50}
            height={50}
          />
        </div>
      )}
      {!resizedURL && !isLoadingResize && resizeSettings}
      {!resizedURL && !isLoadingResize && thumbNail}
    </>
  );
};

export default Resizer;
