import React from 'react';
// import ReactDOM from 'react-dom';
import { ReactMic } from 'react-mic';
// import MIDISounds from 'midi-sounds-react';
import logo from './logo.svg';
import './App.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
// var p5 = require("p5");


// function App() {
//   return (

//   );
// }

class App extends React.Component {
  render() {
    return (
        <Microphone />

    );
  }
}


function chunk_analyzer(chunk) {
  var sound, amplitude, cnv;

  p5.setup = function () {
    cnv = p5.createCanvas(600, 400);
    amplitude = new p5.Amplitude();
    amplitude.setInput(window.wholeAudio);
  };


  // var amplitude = new p5.Amplitude();

  // Use whole audio for testing purposes right now
  // amplitude.setInput(window.wholeAudio);
  // amplitude.setInput(chunk);

  var amp_level = amplitude.getLevel();
  console.log(amp_level);


  // return (
  // )
}



class Microphone extends React.Component {
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
    console.log(this.state.playable);
    // this._audio.play();
    // return;

    // if (this.playable) {
    if (this.state.playable) {
      this.setState({ play: !this.state.play }, () => {
        this.state.play ? this._audio.play() : this._audio.pause();
      });
    }
  };



  onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);


    // Generate and save chunk of recorded audio to a global variable
    // var chunk_audio = recordedBlob.src;
    chunk_analyzer();
  };

  onStop = (recordedBlob) => {
    this._audio.src = recordedBlob.blobURL;
    this._audio.load();

    // Save whole audio file to a global variable
    window.wholeAudio = this._audio;

    // this._audio.play();
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

          </div>
        </div>
    );
  }
}



export default App;
