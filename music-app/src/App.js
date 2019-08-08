import React from 'react';
// import ReactDOM from 'react-dom';
import { ReactMic } from 'react-mic';
// import MIDISounds from 'midi-sounds-react';
import logo from './logo.svg';
import './App.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import 'p5/lib/addons/p5.sound';
// var p5 = require("p5");
import ffmpeg from 'ffmpeg';


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























function chunk_analyzer(p, chunk) {
  var amplitude, cnv;
  console.log("func called");
  p.setup = function () {
    console.log("setup");
    // cnv = p5.createCanvas(600, 400);
    amplitude = new p.Amplitude();
    console.log(chunk);
    // amplitude.setInput();
    amplitude.setInput(chunk);
    // return amplitude.getLevel();
  };
  p.draw = function () {
    var amp_level = amplitude.getLevel();
    return amp_level;
    // console.log(amp_level);
  };

  p.setup();
  p.draw();

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

    if (this.state.playable) {
      this.setState({ play: !this.state.play }, () => {
        this.state.play ? this._audio.play() : this._audio.pause();
      });
    }
  };



  onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);

    // Convert chunk blob to mp3 before sending to chunk analyzer
    // const process = new ffmpeg(recordedBlob.blobURL);
    // console.log(recordedBlob.blobURL);
    // console.log(process);

    // var test = chunk_analyzer(p5, recordedBlob);
    // console.log(test);



    // Generate and save chunk of recorded audio to a global variable
    // var chunk_audio = recordedBlob.src;
    // var test = chunk_analyzer();
    // console.log(test);
  };

  onStop = (recordedBlob) => {
    this._audio.src = recordedBlob.blobURL;
    this._audio.load();
    console.log(this._audio);


    console.log(this._audio.src);
    var ffmpeg = require('ffmpeg');
    const process = new ffmpeg(this._audio.src);


    // Save whole audio file to a global variable
    window.wholeAudio = this._audio;

    // var test = chunk_analyzer(p5, this._audio.src);
    // console.log(test);
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
