//reece bass with LFO connections tuned to F - analysernode setup but not implimented. Distortion setup.

let AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext({
  latencyHint: "interactive",
  sampleRate: 44100,
});

const analyser = new AnalyserNode(audioCtx);

let bufferLength = analyser.frequencyBinCount;
let dataArray = new Float32Array(analyser.frequencyBinCount);

const osc = [
  new OscillatorNode(audioCtx),
  new OscillatorNode(audioCtx),
  new OscillatorNode(audioCtx),
];

 //F - https://www.seventhstring.com/resources/notefrequencies.html - easily change to "sine" "square" or "triangle" but loose the origional Reese sound
osc[0].frequency.value = 87.31;
osc[0].detune.value = 15;
osc[0].type = "sawtooth";

osc[1].frequency.value = 87.31; // F
osc[1].detune.value = -13;
osc[1].type = "sawtooth";

//sub bass should be a non distorted sine wave (see connections)
osc[2].frequency.value = 43.65;
osc[2].type = "sine";


//Distortion Array
const dist = new WaveShaperNode(audioCtx);
dist.curve = new Float32Array([23, -23, 1, -1]); //15-25ish
//dist.oversample = "4x";  --smoother distortion over LFO


//LFO 2, 4, 8 frequency values - can go higher unadvisable.
const lfo = new OscillatorNode(audioCtx);
lfo.frequency.value = 4;
lfo.type = "sine"; 

const gain = new GainNode(audioCtx);
gain.gain = 0;

const lp = new BiquadFilterNode(audioCtx);
lp.type = "lowpass";
lp.frequency = 55;
lp.Q = 24;
lp.gain = 1;


//__________________________________________________________________________________CONNECTIONS____________________________________________________________________________
lfo.connect(lp.frequency);
lfo.connect(gain.gain);
osc[0].connect(gain);
osc[1].connect(gain);
osc[2].connect(audioCtx.destination);
osc[0].connect(lp);
osc[1].connect(lp);
osc[0].connect(dist);
osc[1].connect(dist);
gain.connect(analyser);
dist.connect(audioCtx.destination);
analyser.connect(audioCtx.destination);

lfo.start();
osc[0].start();
osc[1].start();
osc[2].start();
