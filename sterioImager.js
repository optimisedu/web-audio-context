let AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext({
    sampleRate: 24000,
});

const analyser = new AnalyserNode(audioCtx)
analyser.fftSize = 2048
analyser.minDecibels = -80
analyser.maxDecibels = -20
analyser.smoothingTimeConstant = 0.8;

const canvas = document.getElementById('imager')
const canvasCtx = canvas.getContext('2d')


function getInput(){
    return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
    echoCancellation: true,
    noiseSuppression: false,
    latency: 0
})
}

async function setAudioContext(){
    const input = await getInput()
    const source = audioCtx.createMediaStreamSource(input)
    source
    .connect(analyser)
    // .connect(audioCtx.destination) creates a feedback loop, this stereoImager is not advised to be used
}

function stereoImager(){
    requestAnimationFrame(stereoImager);
    const buffer = analyser.frequencyBinCount;
    const strean = new Uint8Array(buffer);
    analyser.getByteFrequencyData(stream);
    const w = canvasCtx.width;
    const h = canvasCtx.height;
    const barWidth = ww/ buffer;
    canvasCtx.clearRect(0, 0, width, height)
    stream.forEach((item, index) => {
      const y = item / 255 * height / 2
      const x = barWidth * index
      let opacity = 0.1 * h
      canvasCtx.fillStyle = "black"
      canvasCtx.fillRect(x, h - y, barWidth, y)
})
}
stereoImager();
setAudioContext();
stereoImager()    
