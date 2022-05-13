let AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext({
  latencyHint: "interactive",
  sampleRate: 44100,
});

const osc = [
  new OscillatorNode(audioCtx),
  new OscillatorNode(audioCtx),
  new OscillatorNode(audioCtx),
];

osc[0].frequency.value = 110;
osc[0].detune.value = 7;
osc[0].type = "square";

osc[1].frequency.value = 440;
osc[1].detune.value = -7;
osc[1].type = "sine";

osc[2].frequency.value = 220;
osc[2].type = "sine";

const lfo = audioCtx.createOscillator();
lfo.frequency.value = 4;
lfo.type = "sine";

const gain = new GainNode(audioCtx);
gain.gain = 0.5;

const lp = new BiquadFilterNode(audioCtx);
lp.type = "bandpass";
lp.frequency = 110;
//lp.Q = 24;
//lp.gain = 100;

lfo.connect(gain.gain);
osc[2].connect(lp.frequency);
osc[0].connect(gain);
osc[1].connect(gain);
osc[0].connect(lp);
osc[1].connect(lp);
osc[0].connect(audioCtx.destination);
osc[1].connect(audioCtx.destination);
osc[2].connect(audioCtx.destination);


lfo.start();
osc[0].start();
osc[1].start();
osc[2].start();
