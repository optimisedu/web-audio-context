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
osc[0].frequency.value = 110;
osc[0].detune.value = 7;
osc[0].type = "square";

osc[1].frequency.value = 220;
osc[1].detune.value = -7;
osc[1].type = "sine";

osc[2].frequency.value = 55;
osc[2].type = "sine";

const dist = new WaveShaperNode(audioCtx);
dist.curve = new Float32Array([20, -20, 1, -1]);
dist.oversample = 4;

const lfo = new OscillatorNode(audioCtx);
lfo.frequency.value = 4;
lfo.type = "sine";

const gain = new GainNode(audioCtx);
gain.gain = 1;

const lp = new BiquadFilterNode(audioCtx);
lp.type = "lowpass";
lp.frequency = 55;
lp.Q = 24;
lp.gain = 1;

const peak = new BiquadFilterNode(audioCtx);
peak.type = "bandpass";
peak.Q = 24;
peak.frequency = 110;
peak.gain = 100;

lfo.connect(lp.frequency);
lfo.connect(gain.gain);
osc[0].connect(gain);
osc[1].connect(gain);
osc[2].connect(audioCtx.destination);
osc[0].connect(lp);
osc[1].connect(lp);
// osc[2].connect(lp);
osc[0].connect(dist);
osc[1].connect(dist);
osc[2].connect(dist);
// osc[0].connect(peak);
// osc[1].connect(peak);
// osc[2].connect(peak);
lp.connect(audioCtx.destination);
// peak.connect(audioCtx.destination);
gain.connect(analyser);
dist.connect(audioCtx.destination);
analyser.connect(audioCtx.destination);

lfo.start();
osc[0].start();
osc[1].start();
osc[2].start();
