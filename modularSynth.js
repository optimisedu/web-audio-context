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

//made my own heavier distortion shape

function distortion (amount) {
    var k = typeof amount === "number" ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    if ( i < n_samples, i-- ) {
        x = i / 2 * n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
}
const dist = new WaveShaperNode(audioCtx);
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
peak.Q = 24;
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
gain.connect(audioCtx.destination)

start => (t) => {
lfo.start(t);
osc[0].start(t);
osc[1].start(t);
osc[2].start(t);
}
//-----------------------------------------------------------------------------------------modulaton functions-----------------------------------------------------------------------
//Typescript style for readability - remove the numbers and add event listeners to create a basic modular synth usable in the console from pure web audio api!-----------------------


speedWob => (n: number) => {
    lfo.frequency.value = n;
}


stopWob => () {
    lfo.stop();
}

lpCut => (n: number) {
    for(let i =0, i < n, i++){
    osc[n].disconnect(lp);
    osc[n].connect(peak);
    }
}

peakCut => (n: number){
    peak.gain.value = n;
}
