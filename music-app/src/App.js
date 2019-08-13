import React from 'react';
// import ReactDOM from 'react-dom';
// import { ReactMic } from 'react-mic';
// import MIDISounds from 'midi-sounds-react';
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

    this.state = {
      loading: true,
      recording: false,
    };

    // Note for later: Create an array of noises to be played. If a "beat" is recognized
    // then save that note to an array, if no "beat" is recognized then save that unrecognized
    // noise to the array.
    // Use p5 score to playback the series of sounds

    const self = this;
    self._playback_beat = [];
    self._last_sound_at = 0;

    // var p5 = require("p5");
    this.sketch = p => {
      let mic, fft, canvas_freq, analyzer;
      let bass_fft, snare_fft, open_fft, closed_fft;
      let bass_noise, snare_noise, open_noise, closed_noise;
      let bass_sound, snare_sound, open_hh_sound, closed_hh_sound;

      let average_sound = 0;

      let source_sounds;

      // Functions to be used for noise analysis
      p.preload = function() { // For audio analysis
        p.soundFormats('mp3', 'ogg');
        // noise = p.loadSound('beat_box_beats/bass.mp3');
        bass_sound = p.loadSound(bass);
        snare_sound = p.loadSound(snare);
        open_hh_sound = p.loadSound(open_hh);
        closed_hh_sound = p.loadSound(closed_hh);

        // Load in noise, loop noise and analyze the beats one by one to determine threshold
        bass_noise = p.loadSound(u_bass);
        snare_noise = p.loadSound(u_snare);
        open_noise = p.loadSound(u_open_hh);
        closed_noise = p.loadSound(u_closed_hh);
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

      p.setup = function() {

        canvas_freq = p.createCanvas(710, 200);
        p.noFill();

        canvas_freq.parent('freq_holder');
        mic = new p5.AudioIn();
        mic.start();
        // console.log("I am recording you");
        fft = new p5.FFT();
        fft.setInput(mic);

        analyzer = new p5.Amplitude();
        analyzer.toggleNormalize([1]);
        analyzer.setInput(mic);

        source_sounds = [ bass_noise, snare_noise, open_noise, closed_noise ];

        self.setState({loading: false});
      };

      p.draw = function() {
        p.clear();

        // console.log("I wanna draw");
        // Analyze and display spectrum of frequency
        let spectrum = fft.analyze();
        // console.log(spectrum);
        p.beginShape();
        for (let i = 0; i < spectrum.length; i++) {
          p.vertex(
            p.map(i, 0, 1024, 0, p.width),
            p.map(spectrum[i], 0, 255, p.height, 0)
          );
        }
        p.endShape();
        
        // const values = spectrums.map(spec => {
        //   let sum = 0;
        //   for (let i = 0; i < spectrum.length; i++) {
        //     sum = sum + (spectrum[i] - spec[i]) ^ 2;
        //   }
        //   return sum
        // });

        // console.log(values);

        // values.forEach((v, idx) => {
        //   p.rect(
        //     p.map(idx, 0, values.length, 0, p.width),
        //     0,
        //     p.width / values.length,
        //     p.map(v, 0, 46000, 0, p.height),
        //   );
        // });

        // console.log("Centroid of Freq: " + fft.getCentroid());
        //
        // console.log("Bass Energy of Freq: " + fft.getEnergy("bass"));
        // console.log("lowMid Energy of Freq: " + fft.getEnergy("lowMid"));
        // console.log("mid Energy of Freq: " + fft.getEnergy("mid"));
        // console.log("midHigh Energy of Freq: " + fft.getEnergy("highMid"));
        // console.log("treble Energy of Freq: " + fft.getEnergy("treble"));
        //
        // console.log("Lin Averages of Freq: " + fft.linAverages(4));
        // console.log("Log Averages of Freq: " + fft.logAverages(4));

        // Analyze and interpret amplitude
        let rms = analyzer.getLevel();
        // console.log("Amplitude: " + rms);

        let bass = false;
        let snare = false;
        let hi_hat_o = false;
        let hi_hat_c = false;

        // Thresholds & Beats based off of input
        // FREQ If certain element of frequency spectrum is greater than some threshold
        // AMP If amplitude level is greater than some threshold
        // MIDI If note returned for frequency value is equal to some value?

        let threshold = 0.1;

        if (!self.state.recording) {
          return;
        }

        const centroids = [
          816, 8980, 10221, 10306
        ];
        const amps = [
          0.058, 0.107, 0.384, 0.4431
        ];

        const centroid = fft.getCentroid();

        const score = (idx) => {
          const c = centroids[idx];
          const a = amps[idx];

          return Math.pow(c - centroid, 2);
        };


        const use = rms > average_sound * 1.5;
        console.log(average_sound, rms);
        average_sound = average_sound * 0.7 + rms * 0.3;

        if (!use) {
          return;
        }

        let best_idx = 0;
        let best_score = score(0);

        for (let i = 1; i < source_sounds.length; ++i) {
          const s = score(i);
          if (s < best_score) {
            best_score = s;
            best_idx = i;
          }
        }

        self.addSound(source_sounds[best_idx]);

// 
//         // Conditional Sound Play
//         if (fft.getCentroid() > 800 && fft.getCentroid() < 1000 && rms > 0.058) {
//           bass = true;
//         }
// 
//         if (fft.getCentroid() > 8900 && fft.getCentroid() < 10100 && rms > 0.107) {
//           snare = true;
//         }
// 
//         if (fft.getCentroid() > 10100 && fft.getCentroid() < 10300 && rms > 0.384) {
//           hi_hat_o = true;
//         }
// 
//         bass_fft = new p5.FFT();
//         if (fft.getCentroid() > 10300 && fft.getCentroid() < 10500 && rms > 0.4431) {
//           hi_hat_c = true;
//         }
// 
//         // Actually play sounds / save phrases to score for later playback
//         if (bass) {
//           // Play sound if user input is recognized to be a beat
//           bass = false;
// 
//           self.addSound(bass_sound);
//         }
// 
//         if (snare) {
//           // Play sound if user input is recognized to be a beat
//           snare = false;
// 
// 
//           self.addSound(snare_sound);
// 
//         }
// 
//         if (hi_hat_o) {
//           // Play sound if user input is recognized to be a beat
//           hi_hat_o = false;
// 
//           self.addSound(open_hh_sound);
//         }
// 
// 
//         if (hi_hat_c) {
//           // Play sound if user input is recognized to be a beat
//           hi_hat_c = false;
// 
//           self.addSound(closed_hh_sound);
//         }
      };
    };

    this._myp5 = new p5(this.sketch);
  }

  addSound = (sound) => {
    const now = Date.now();
    if (now - this._last_sound_at < 500) {
      return;
    }

    console.log('sound added');

    this._last_sound_at = now;
    this._playback_beat.push(sound);
    sound.play();
  };

  onMousePress= () => {
    if (this.state.playing) {
      return;
    }

    this.setState({ playing: true });

    let play_idx = 0;

    const playNext = () => {
      if (play_idx >= this._playback_beat.length) {
        this.setState({ playing: false });
        return;
      }

      const sound = this._playback_beat[play_idx++];
      sound.play();
      setTimeout(playNext, sound.duration() * 1000);
    };

    playNext();

    // let main_score;
    // console.log(this._playback_beat);

    // if (this._playback_beat.length > 0) {
    //   const parts = new p5.Part();
    //   // this._playback_beat.forEach(item => parts.addPhrase(() => item.play()));
    //   // this._playback_beat.forEach(item => parts.addPhrase(() => new p5.Phrase('beat', () => playback(item), [1])));
    //   for (let i = 0; i < this._playback_beat.length; i++) {
    //     let item = this._playback_beat[i];
    //     parts.addPhrase(item);
    //     parts.setBPM(60);
    //   }
    //   console.log(parts);
    //   debugger;
    //   main_score = new p5.Score(parts);
    //   console.log(main_score);
    //   debugger;
    //   main_score.start();
    // }
  };


  render = () => {
    const rec_button = this.state.recording
        ? <button className="buttons" type="button" onClick={() => this.setState({recording: false})}>Stop</button>
        : <button className="buttons" type="button" onClick={() => this.setState({recording: true})}>Start</button>;

    return (
        // console.log(this.sketch(p5)),
        <div className={'App' + (this.state.recording ? ' rec' : '')}>
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Build-A-Beat
            </p>
            <div id="freq_holder"></div>

            {/*// onClick={}*/}
            <div id="button_holder">
              {rec_button}
              <button className="buttons" type="button" onClick={this.onMousePress}>Build My Beat</button>
              {/*<button className="buttons" type="button">One to One Beat Maker Mode</button>*/}
            </div>

          </div>
        </div>
    );

  }
}
export default App;
