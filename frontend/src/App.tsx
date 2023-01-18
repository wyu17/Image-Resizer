import React from "react";
import ImageDropzone from "./components/ImageDropzone";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div>
        <h1>Image Resizer</h1>
        <ImageDropzone />
      </div>
    </div>
  );
};

export default App;
