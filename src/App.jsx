import { useState } from "react";

function App() {
  const [textData, setTextData] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const serverURL = "http://127.0.0.1:5000/api/text-to-speech";

  const handleSumbmit = async (e) => {
    e.preventDefault();
    setLoading(val => !val)
    const data = JSON.stringify({ textData });
    console.log(data);
    await fetch(serverURL, {
      method: "POST",
      body: data,
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      }),
    })
      .then(async (data) => {
        let res = await data.json();
        console.log("result ==>", res.fileName);
        setLoading((val) => !val);
        setUrl(`${serverURL}/${res.fileName}`);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    handleReset();
    setTextData(e.target.value);
  };

  const handleReset = () => {
    setLoading(false);
    setTextData(() => "");
    setUrl(() => "");
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow mt-5 p-4" style={{ borderRadius: "1em" }}>
            <form className="form-signin" onSubmit={(e) => handleSumbmit(e)}>
              <h2 className="form-signin-heading mb-5">
                <i className="fa fa-microphone-alt me-2"></i>Text to Speech
              </h2>

              <div className="form-group mx-3 my-3">
                <div className="col-sm-12">
                  <input
                    className="form-control"
                    placeholder="type text to generate here..."
                    type="text"
                    name="textData"
                    required
                    value={textData}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <span className="text-danger"></span>
              </div>

              <div className="col-12 pb-5">
                <button
                  className="btn  btn-warning mt-2 float-end"
                  type="button"
                  onClick={() => handleReset()}
                >
                  <i className="fa fa-redo-alt me-2"></i>Reset
                </button>
                <button
                  className="btn  btn-primary mt-2 float-end me-3"
                  type="submit"
                >
                  <i className="fa fa-play me-2"></i>Generate
                </button>
              </div>
              <div className="col-12 mt-5 ms-3">
                {url !== "" ? (
                  <div>
                    <h6 className="pb-3">
                      <i className="fa fa-file-audio me-2"></i>Generated Audio
                    </h6>
                    <audio controls>
                      <source src={url} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : loading ? (
                  <div className="d-flex align-items-center text-primary fw-semibold">
                    <div
                      className="spinner-grow spinner-grow-sm me-3"
                      role="status"
                    >
                      <span className="visually-hidden"></span>
                    </div>
                    Please wait...
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
