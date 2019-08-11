import React from 'react';
// import ReactDOM from 'react-dom';
import { ReactMic } from 'react-mic';
import MIDISounds from 'midi-sounds-react';
import logo from './Build-A-Beat.svg';
import './App.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import 'p5/lib/addons/p5.sound';


// Import user_input for analysis / bin creation
import u_bass from './user_input/u_bass.mp3';
import u_snare from './user_input/u_snare.mp3';
import u_open_hh from './user_input/u_open_hh.mp3';
import u_closed_hh from './user_input/u_closed_hh.mp3';

// Import real_drum sounds
import bass from './real_drum/bass.mp3';
import snare from './real_drum/snare.mp3';
import open_hh from './real_drum/open_hh.mp3';
import closed_hh from './real_drum/closed_hh.mp3';

class App extends React.Component {
  render() {
    return (
        <Sketch />

    );
  }
}

// P5 Analyze Stream of Audio
class Sketch extends React.Component {
  // new p5(this.sketch, this.root);
  constructor(props) {
    // run regular ass javascript inside the constructor
    super(props); // Sets up the class for me


    // Note for later: Create an array of noises to be played. If a "beat" is recognized
    // then save that note to an array, if no "beat" is recognized then save that unrecognized
    // noise to the array.
    // Use p5 score to playback the series of sounds

    // var p5 = require("p5");
    this.sketch = p => {
      let mic, fft, canvas_freq, analyzer, noise;
      let bass_sound, snare_sound, open_hh_sound, closed_hh_sound;

      let playback_beat = [];

      // Functions to be used for noise analysis
      p.preload = function () { // For audio analysis
        p.soundFormats('mp3', 'ogg');
        // noise = p.loadSound('beat_box_beats/bass.mp3');
        bass_sound = p.loadSound(bass);
        snare_sound = p.loadSound(snare);
        open_hh_sound = p.loadSound(open_hh);
        closed_hh_sound = p.loadSound(closed_hh);

        // Load in noise, loop noise and analyze the beats one by one to determine threshold
        noise = p.loadSound(u_snare);
      };

      // p.setup = function () {
      //   // noise.loop();
      //   noise.play();
      //   fft = new p5.FFT();
      //   fft.setInput(noise);
      //
      //   analyzer = new p5.Amplitude();
      //   analyzer.setInput(noise);
      //
      // };

      p.setup = function () {
        canvas_freq = p.createCanvas(710, 200);
        p.noFill();

        canvas_freq.parent('freq_holder');
        mic = new p5.AudioIn();
        mic.start();
        // console.log("I am recording you");
        fft = new p5.FFT();
        fft.setInput(mic);

        analyzer = new p5.Amplitude();
        analyzer.setInput(mic);

      };

      p.draw = function () {
        p.background(40,44,52);
        // console.log("I wanna draw");

        // Analyze and display spectrum of frequency
        let spectrum = fft.analyze();
        console.log(spectrum);
        p.beginShape();
        for (let i = 0; i < spectrum.length; i++) {
          p.vertex(i, p.map(spectrum[i], 0, 255, p.height, 0));
        }
        p.endShape();

        console.log("Centroid of Freq: " + fft.getCentroid());

        console.log("Bass Energy of Freq: " + fft.getEnergy("bass"));
        console.log("lowMid Energy of Freq: " + fft.getEnergy("lowMid"));
        console.log("mid Energy of Freq: " + fft.getEnergy("mid"));
        console.log("midHigh Energy of Freq: " + fft.getEnergy("highMid"));
        console.log("treble Energy of Freq: " + fft.getEnergy("treble"));

        console.log("Lin Averages of Freq: " + fft.linAverages(4));
        // console.log("Log Averages of Freq: " + fft.logAverages(4));

        // Analyze and interpret amplitude
        let rms = analyzer.getLevel();
        console.log("Amplitude: " + rms);

        let bass = false;
        let snare = false;
        let hi_hat_o = false;
        let hi_hat_c = false;


        // Thresholds & Beats based off of input
        // FREQ If certain element of frequency spectrum is greater than some threshold
        // AMP If amplitude level is greater than some threshold
        // MIDI If note returned for frequency value is equal to some value?

        let threshold = 0.1;
        if (rms > threshold) {
          // midi
        }


        if (bass) {
          // Play sound if user input is recognized to be a beat
          bass_sound.play();

          // Add sound to score
          playback_beat.push(bass_sound);
          bass = false;

        }

        if (snare) {
          // Play sound if user input is recognized to be a beat
          snare_sound.play();

          // Add sound to score
          playback_beat.push(snare_sound);
          snare = false;

        }

        if (hi_hat_o) {
          // Play sound if user input is recognized to be a beat
          open_hh_sound.play();

          // Add sound to score
          playback_beat.push(open_hh_sound);
          hi_hat_o = false;
        }


        if (hi_hat_c) {
          // Play sound if user input is recognized to be a beat
          closed_hh_sound.play();

          // Add sound to score
          playback_beat.push(closed_hh_sound);
          hi_hat_c = false;
        }



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
              Build-A-Beat
            </p>
            <div id="freq_holder"> </div>
            {/*// onClick={}*/}
            <div id="button_holder">
              <button className="buttons" type="button">Start</button>
              <button className="buttons" type="button">Build My Beat</button>
              {/*<button className="buttons" type="button">One to One Beat Maker Mode</button>*/}
            </div>

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
