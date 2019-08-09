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


// function App() {
//   return (
//   );
// }

class App extends React.Component {
  render() {
    return (
    //     p5_microphone()
        // eslint-disable-next-line react/jsx-pascal-case
        // <Microphone />
        <Sketch />
        // {/*<p5 Analyze={Analyze}><p5/>*/}

    );
  }
}

// P5 Analyze Stream of Audio
class Sketch extends React.Component {
  // new p5(this.sketch, this.root);
  constructor(props) {
    // run regular ass javascript inside the constructor
    super(props); // Sets up the class for me

    // var p5 = require("p5");
    this.sketch = p => {
      let mic, fft, canvas;

      p.setup = function () {
        canvas = p.createCanvas(710, 400);
        p.noFill();

        mic = new p5.AudioIn();
        mic.start();
        console.log("I am recording you");
        fft = new p5.FFT();
        fft.setInput(mic);
      };

      p.draw = function () {
        p.background(200);
        console.log("I wanna draw");
        let spectrum = fft.analyze();
        p.beginShape();
        for (let i = 0; i < spectrum.length; i++) {
          p.vertex(i, p.map(spectrum[i], 0, 255, p.height, 0));
        }
        p.endShape();
      };

    };
    let myp5 = new p5(this.sketch);

  };

  render () {

    return (
        // console.log(this.sketch(p5)),
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Build A Beat.
            </p>
            {/*<button onClick={this.myp5} type="button">Start</button>*/}
          </div>
        </div>
    );

  }
}

// class p5_microphone  extends React.Component {
//   render() {
//     let mic, recorder, soundFile, canv;
//
//     let state = 0; // mousePress will increment from Record, to Stop, to Play
//
//     p5.setup = function () {
//       canv = p5.createCanvas(400, 400);
//       p5.background(200);
//       p5.fill(0);
//       p5.text('Enable mic and click the mouse to begin recording', 20, 20);
//
//
//       // create an audio in
//       mic = new p5.AudioIn();
//
//       // users must manually enable their browser microphone for recording to work properly!
//       mic.start();
//
//       // create a sound recorder
//       recorder = new p5.SoundRecorder();
//
//       // connect the mic to the recorder
//       recorder.setInput(mic);
//
//       // create an empty sound file that we will use to playback the recording
//       soundFile = new p5.SoundFile();
//
//     };
//
//     p5.mousePressed = function () {
//       // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
//       if (state === 0 && mic.enabled) {
//         // Tell recorder to record to a p5.SoundFile which we will use for playback
//         recorder.record(soundFile);
//
//         p5.background(255, 0, 0);
//         p5.text('Recording now! Click to stop.', 20, 20);
//         state++;
//       } else if (state === 1) {
//         recorder.stop(); // stop recorder, and send the result to soundFile
//
//         p5.background(0, 255, 0);
//         p5.text('Recording stopped. Click to play & save', 20, 20);
//         state++;
//       } else if (state === 2) {
//         soundFile.play(); // play the result!
//         p5.saveSound(soundFile, 'mySound.wav'); // save file
//         state++;
//       }
//     };
//
//
//     return (
//         <div className="App">
//           <div className="App-header">
//             <img src={logo} className="App-logo" alt="logo" />
//             <p>
//             Build A Beat.
//             </p>
//
//
//             {/*<audio ref={el => this._audio = el} />*/}
//
//           </div>
//         </div>
//     );
//
//   }
// }


function chunk_analyzer(p, chunk) {
  // Pass in chunk as src of waveform audio
  // Convert to mp3
  // var ffmpeg = require('ffmpeg');
  // const process = new ffmpeg(chunk);
  // process.then(function (audio) {
  //   audio.fnExtractSoundToMP3()
  // });

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

    // p5.saveSound(this._audio, 'recorded_audio.wav'); // save file




    // console.log(this._audio.src);
    // var ffmpeg = require('ffmpeg');
    // const process = new ffmpeg('recorded_audio.wav');
    // ffmpeg(this._audio);
    // const process = ffmpeg(this._audio.src);
    // process.then(function (audio) {
    //   audio.fnExtractSoundToMP3(window.test)

    // });





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
