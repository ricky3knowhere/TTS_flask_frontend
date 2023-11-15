// import { useState } from "react";
import TextToSpeech from "./components/SpeechToText";
import SpeechToText from "./components/TextToSpeech";

function App() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <TextToSpeech />
        <SpeechToText />
      </div>
    </div>
  );
}

export default App;
