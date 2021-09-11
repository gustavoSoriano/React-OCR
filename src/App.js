import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone-uploader";
import { createWorker } from "tesseract.js";

function App() {
  const [text, setText] = useState(null);

  const [imageUrl] = useState(null);

  useEffect(() => {
    if (imageUrl != null) {
      ExtractTextFromImage();
    }
  });

  const worker = createWorker({
    logger: (m) => {
      if( m.status === "recognizing text")
      {
        setText(`Reconizing... ${(m.progress * 100).toFixed(2)}%`);
      }
    },
  });

  const ExtractTextFromImage = async (imageUrl) => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageUrl);
    setText(text);
    await worker.terminate();
  };

  const getUploadParams = () => {
    return {
      url: "https://httpbin.org/post",
    };
  };

  const handleChangeStatus = ({ meta }, status) => {
    if (status === "headers_received") {
      alert("Uploaded");
      setText("Reconizing...");
      ExtractTextFromImage(meta.previewUrl);
    } else if (status === "aborted") {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light justify-content-center mt-3">
        <a className="navbar-brand" href="/">
          {" "}
          React OCR{" "}
        </a>
        <br />
      </nav>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        accept="image/jpeg, image/png, image/jpg"
        inputContent={(files, extra) =>
          extra.reject
            ? "Permitido apenas PNG OU jJPG"
            : "Arraste uma imagem aqui"
        }
        styles={{
          dropzoneActive: {
            borderColor: "green",
          },
          dropzoneReject: { borderColor: "red", backgroundColor: "#DAA" },
          inputLabel: (files, extra) => (extra.reject ? { color: "red" } : {}),
        }}
      />{" "}
      <div className="container text-center pt-5"> {text} </div>
    </>
  );
}

export default App;
