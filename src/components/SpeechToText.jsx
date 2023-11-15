import React, { useState } from "react";

const TextToSpeech = () => {
  const [audioMetaData, setAudioMetaData] = useState({
    mediaRecorder: null,
    audioBlob: null,
    audioUrl: "",
  });
  const [isDisableButton, setIsDisableButton] = useState({
    recordtButton: false,
    stopButton: true,
    generateButton: true,
  });
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioText, setAudioText] = useState("");
  const serverURL = "http://127.0.0.1:5000/api";

  const startRecording = () => {
    handleReset();
    setRecording((val) => !val);
    let audioChunks = [];
    let audioBlob;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioMetaData.mediaRecorder = new MediaRecorder(stream);
        setAudioMetaData(audioMetaData);
        console.log(audioMetaData);
        let mediaRecorder = audioMetaData.mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          audioBlob = new Blob(audioChunks, {
            type: "audio/wav",
          });

          // Set audio URL as source for audio player
          audioMetaData.audioBlob = audioBlob;
          audioMetaData.audioUrl = URL.createObjectURL(audioBlob);
          setAudioMetaData(audioMetaData);
          setIsDisableButton({
            recordtButton: false,
            stopButton: true,
            generateButton: false,
          });
        };

        mediaRecorder.start();
        setIsDisableButton({
          recordtButton: true,
          stopButton: false,
          generateButton: true,
        });
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    setRecording((val) => !val);
    audioMetaData.mediaRecorder.stop();
  };

  const handleAudioSumbmit = async (e) => {
    e.preventDefault();
    setIsDisableButton((val) => {
      val.generateButton = true;
      return val;
    });
    setLoading((val) => !val);

    let formData = new FormData();
    formData.append("audio", audioMetaData.audioBlob, "audio.wav");
    let temp = [];
    for (const v of formData.entries()) {
      temp.push(v);
    }
    console.log(temp);
    await fetch(serverURL + "/speech-to-text", {
      method: "POST",
      body: formData,
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
      }),
    })
      .then(async (data) => {
        let temp = await data.json();
        console.log(temp);
        setLoading(false);
        setAudioText(temp);
      })
      .catch((err) => console.log(err));
  };

  const handleReset = () => {
    setLoading(false);
    setRecording(false);
    setAudioText("");
    setAudioMetaData({ mediaRecorder: null, audioBlob: null, audioUrl: "" });
    setIsDisableButton({
      recordtButton: false,
      stopButton: true,
      generateButton: true,
    });
  };

  return (
    <div className="col-md-5">
      <div className="card shadow mt-5 p-4" style={{ borderRadius: "1em" }}>
        <h2 className="form-signin-heading mb-5">
          <i className="fa fa-file-alt me-2" />
          Speech to Text
        </h2>
        <div className="mb-3">
          <span className="text-muted d-block mb-3">
            <i className="fa fa-info-circle me-2" />
            Click record button to record audio
          </span>
          <button
            className="btn btn-success me-3"
            onClick={() => startRecording()}
            disabled={isDisableButton.recordtButton}
          >
            <i className="fa fa-play-circle me-2" />
            Record
          </button>
          <button
            className="btn btn-danger"
            onClick={() => stopRecording()}
            disabled={isDisableButton.stopButton}
          >
            <i className="fa fa-stop-circle me-2" />
            Stop
          </button>
        </div>
        {recording ? (
          <div className="d-flex align-items-center text-primary fw-semibold mt-3">
            <div className="spinner-grow spinner-grow-sm me-3" role="status">
              <span className="visually-hidden"></span>
            </div>
            Recording...
          </div>
        ) : audioMetaData.audioUrl ? (
          <div>
            <h6 className="py-3">
              <i className="fa fa-volume-up me-2" />
              Recorded Audio
            </h6>
            <audio
              id="audioPlayer"
              controls
              src={audioMetaData.audioUrl}
            ></audio>
          </div>
        ) : null}

        <div className="col-12 mt-5 ms-3">
          {audioText !== "" ? (
            <div
              className={`card text-bg-light mb-3 border-${
                audioText.text ? "primary" : "danger"
              }`}
              style={{ maxWidth: "93%" }}
            >
              <div className="card-header fw-semibold">
                <i className="fa fa-file-alt me-2" />
                Text Generated
              </div>
              <div className="card-body">
                <h5
                  className={`card-title text-${
                    audioText.text ? "primary" : "danger"
                  }`}
                >
                  {audioText.text ? (
                    <span>
                      <i className="fa fa-check-circle me-2 mb-2" />
                      Success!
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-exclamation-triangle me-2 mb-2" />
                      Error!
                    </span>
                  )}
                </h5>
                <p
                  className={`card-text ${
                    audioText.text ? null : "text-danger"
                  }`}
                >
                  {audioText.text ? audioText.text : audioText.error}
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="d-flex align-items-center text-primary fw-semibold">
              <div className="spinner-grow spinner-grow-sm me-3" role="status">
                <span className="visually-hidden"></span>
              </div>
              Please wait...
            </div>
          ) : null}
        </div>

        <div className="col-12 pb-5 pt-3">
          <button
            className="btn  btn-warning mt-2 float-end"
            type="button"
            onClick={() => handleReset()}
          >
            <i className="fa fa-redo-alt me-2" />
            Reset
          </button>
          <button
            className="btn  btn-primary mt-2 float-end me-3"
            onClick={(e) => handleAudioSumbmit(e)}
            disabled={isDisableButton.generateButton}
          >
            <i className="fa fa-play me-2" />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
