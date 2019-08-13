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

window._playback_beat = [];

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

    // var p5 = require("p5");
    this.sketch = p => {
      let mic, fft, canvas_freq, analyzer;
      let bass_fft, snare_fft, open_fft, closed_fft;
      let bass_noise, snare_noise, open_noise, closed_noise;
      let bass_sound, snare_sound, open_hh_sound, closed_hh_sound;

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
        bass_fft = new p5.FFT();
        bass_fft.setInput(bass_noise);

        snare_fft = new p5.FFT();
        snare_fft.setInput(snare_noise);

        open_fft = new p5.FFT();
        open_fft.setInput(open_noise);

        closed_fft = new p5.FFT();
        closed_fft.setInput(closed_noise);

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

        self.setState({loading: false});
      };

      p.draw = function() {
        if (self.state.recording) {
          // actually draw graphic
          p.background(80, 44, 52);
        } else {
          // actually draw graphic
          p.background(40, 44, 52);
        }

        // console.log("I wanna draw");
        // Analyze and display spectrum of frequency
        let spectrum = fft.analyze();
        // console.log(spectrum);
        p.beginShape();
        for (let i = 0; i < spectrum.length; i++) {
          p.vertex(i, p.map(spectrum[i], 0, 255, p.height, 0));
        }
        p.endShape();

        if (!self.state.recording) {
          return;
        }

        let spectrum_bass = bass_fft.analyze();
        let spectrum_snare = snare_fft.analyze();
        let spectrum_open = open_fft.analyze();
        let spectrum_closed = closed_fft.analyze();


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

        let bass_sum = 0;
        for (let i = 0; i < spectrum.length; i++) {
          bass_sum = bass_sum + (spectrum[i] - spectrum_bass[i]) ^ 2;
        }
        // console.log(bass_sum);
        // if (bass_sum) {
        //
        // }

        if (fft.getCentroid() > 800 && fft.getCentroid() < 1000 && rms > 0.058) {
          bass = true;
        }


        let snare_sum = 0;
        for (let i = 0; i < spectrum.length; i++) {
          snare_sum = snare_sum + (spectrum[i] - spectrum_snare[i]) ^ 2;
        }
        if (fft.getCentroid() > 8900 && fft.getCentroid() < 10100 && rms > 0.107) {
          snare = true;
        }


        let open_sum = 0;
        for (let i = 0; i < spectrum.length; i++) {
          open_sum = open_sum + (spectrum[i] - spectrum_open[i]) ^ 2;
        }
        if (fft.getCentroid() > 10100 && fft.getCentroid() < 10300 && rms > 0.384) {
          hi_hat_o = true;
        }
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

        bass_fft = new p5.FFT();
        let closed_sum = 0;
        for (let i = 0; i < spectrum.length; i++) {
          closed_sum = closed_sum + (spectrum[i] - spectrum_closed[i]) ^ 2;
        }
        if (fft.getCentroid() > 10300 && fft.getCentroid() < 10500 && rms > 0.4431) {
          hi_hat_c = true;
        }

        if (bass) {
          // Play sound if user input is recognized to be a beat
          bass_sound.play();

          // Add sound to score
          window._playback_beat.push(bass_sound);
          bass = false;

        }

        if (snare) {
          // Play sound if user input is recognized to be a beat
          snare_sound.play();

          // Add sound to score
          window._playback_beat.push(snare_sound);
          snare = false;

        }

        if (hi_hat_o) {
          // Play sound if user input is recognized to be a beat
          open_hh_sound.play();

          // Add sound to score
          window._playback_beat.push(open_hh_sound);
          hi_hat_o = false;
        }


        if (hi_hat_c) {
          // Play sound if user input is recognized to be a beat
          closed_hh_sound.play();

          // Add sound to score
          window._playback_beat.push(closed_hh_sound);
          hi_hat_c = false;
        }
      };
    };

    this._myp5 = new p5(this.sketch);
  }

  onMousePress= () => {
    let main_score;
    console.log(window._playback_beat);

    function playback(item) {
      item.rate(1);
      item.play(0);
    }

    if (window._playback_beat.length > 0) {
      const parts = new p5.Part();
      // window._playback_beat.forEach(item => parts.addPhrase(() => item.play()));
      window._playback_beat.forEach(item => parts.addPhrase(() => new p5.Phrase('beat', playback(item), [1])));
      main_score = new p5.Score(parts);
      console.log(main_score);
      debugger;
      main_score.start();
    }
  };


  render = () => {
    const rec_button = this.state.recording
        ? <button className="buttons" type="button" onClick={() => this.setState({recording: false})}>Stop</button>
        : <button className="buttons" type="button" onClick={() => this.setState({recording: true})}>Start</button>;

    return (
        // console.log(this.sketch(p5)),
        <div className="App">
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
