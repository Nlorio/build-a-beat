import React from 'react';
import { ReactMic } from 'react-mic';
// import ReactAudioPlayer from 'react-audio-player';
import logo from './logo.svg';
import './App.scss';


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//
//   );
// }

export class microphone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      playable: false,
      play: false
    }

  }

  startRecording = () => {
    this.setState({
      record: true
    });
  };

  stopRecording = () => {
    this.setState({
      record: false,
      playable: true
    });
  };

  playbackRecording = () => {
    console.log(this.playable);

    this._audio.play();
    return;

    // if (this.playable) {
    if (true) {
      this.setState({ play: !this.state.play }, () => {
        this.state.play ? window.audio.play() : window.audio.pause();
      });
    }
  };

  onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  onStop = (recordedBlob) => {
    this._audio.src = recordedBlob.blobURL;
    this._audio.load();
    this._audio.play();
  };

  render() {
    return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
            Build Your Beat.
            </p>
            <audio ref={el => this._audio = el} />
          <ReactMic
              record={this.state.record}
              className="sound-wave"
              onStop={this.onStop}
              onData={this.onData}
              strokeColor="#61dafb"
              backgroundColor="#282c34" />

          <button onClick={this.startRecording} type="button">Start</button>
          <button onClick={this.stopRecording} type="button">Stop</button>
          <button onClick={this.playbackRecording} type="button">{this.state.play ? 'Pause' : 'Play'}</button>

          {/*<audio controls>*/}
          {/*  <source src={window.audio} />*/}
          {/*  /!*<source src="myAudio.ogg" type="audio/ogg">*!/*/}
          {/*  /!*    <p>Your browser doesn't support HTML5 audio. Here is*!/*/}
          {/*  /!*      a <a href="myAudio.mp4">link to the audio</a> instead.</p>*!/*/}
          {/*</audio>*/}

          </div>
        </div>
    );
  }
}

// export default App;
export default  microphone;
