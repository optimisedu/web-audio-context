//reece bass with LFO connections tuned to F - analysernode setup but not implimented. Distortion setup.

let AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext({
  latencyHint: "interactive",
  sampleRate: 22050,
});

const osc = [
  new OscillatorNode(audioCtx),
  new OscillatorNode(audioCtx),
  new OscillatorNode(audioCtx),
];

osc[0].frequency.value = 87.31; //F - https://www.seventhstring.com/resources/notefrequencies.html, sine, sawtooth, square or triangle types
osc[0].detune.value = 15;
osc[0].type = "sawtooth";

osc[1].frequency.value = 87.31;
osc[1].detune.value = -13;
osc[1].type = "sawtooth";

osc[2].frequency.value = 43.65;
osc[2].type = "sine";


function makeDistortionCurve(amount = 20) {
  let n_samples = 1028,
    curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    let x = (i * 2) / n_samples - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

const dist = new WaveShaperNode(audioCtx);
dist.curve = makeDistortionCurve(400);
dist.oversample = "4x";

const lfo = new OscillatorNode(audioCtx);
lfo.frequency.value = 4;
lfo.type = "sine";

const gain = new GainNode(audioCtx);
gain.gain.value = 0;

const lp = new BiquadFilterNode(audioCtx);
lp.type = "lowpass";
lp.frequency = 55;
lp.Q = 24;
lp.gain.value = 1;

const peak = new BiquadFilterNode(audioCtx);
peak.type = "bandpass";
peak.Q = 12;
peak.frequency = 87.3;
peak.gain = 100;

// const panNode = new StereoPanner(audioCtx); //panning option - can hook up to LFO
// panNode.pan.value = 0;

//-----------------------------------------------------------------------------------------connections-----------------------------------------------------------------------

lfo.connect(lp.frequency);
lfo.connect(gain.gain);
osc[0].connect(gain);
osc[1].connect(gain);
osc[0].connect(dist);
osc[1].connect(dist);
osc[0].connect(lp);
osc[1].connect(lp);
osc[0].connect(peak);
osc[1].connect(peak);
osc[2].connect(gain);
dist.connect(lp);
lp.connect(gain);
peak.connect(gain);
gain.connect(audioCtx.destination);

lfo.start();
osc[0].start();
osc[1].start();
osc[2].start();
