//Instruments to Play with
let bass = new Tone.Synth({
  oscillator: { type: 'sawtooth'},
  volume: -7
});
let bassFilter = new Tone.Filter({type: 'lowpass', frequency: 2000})
bass.connect(bassFilter);
bassFilter.toDestination();



let drumPlayers = new Tone.Players({
  kick: "https://teropa.info/ext-assets/drumkit/kick.mp3",
  hatClosed: "https://teropa.info/ext-assets/drumkit/hatClosed.mp3",
  hatOpen: "https://teropa.info/ext-assets/drumkit/hatOpen2.mp3",
  snare: "https://teropa.info/ext-assets/drumkit/snare3.mp3",
  tomLow: "https://teropa.info/ext-assets/drumkit/tomLow.mp3",
  tomMid: "https://teropa.info/ext-assets/drumkit/tomMid.mp3",
  tomHigh: "https://teropa.info/ext-assets/drumkit/tomHigh.mp3",
  ride: "https://teropa.info/ext-assets/drumkit/ride.mp3",
  crash: "https://teropa.info/ext-assets/drumkit/hatOpen.mp3",
}).toDestination()

let leadSampler = new Tone.Sampler({
  urls:{
    
  
  'C2': 'https://cdn.glitch.com/ebf44f9f-a243-48ec-8f40-245e737c8458%2Fceltic.wav?v=1596989537626'
  },
  volume: -4
  }).toDestination()

//Patterns

let drumPattern = [
  ["0:0:0", "kick"],
  ["0:1:0", "hatClosed"],
  ["0:1:2", "kick"],
  ["0:2:0", "kick"],
  ["0:3:0", "hatClosed"],
  ["1:0:0", "kick"],
  ["1:1:0", "hatClosed"],
  ["1:2:0", "kick"],
  ["1:2:3", "kick"],
  ["1:3:0", "hatClosed"],
  ["1:3:2", "kick"],
  ["1:3:2", "hatOpen"],
];



let drumPart = new Tone.Part((time,drum) => {
  drumPlayers.player(drum).start(time);
}, drumPattern).start();
drumPart.loop = true;
drumPart.loopStart = 0;
drumPart.loopEnd = '2m';

let bassPattern = [
  ['0:0:0', 'C#2'],
  ['0:0:3', 'C#2'],
  ['0:1:2', 'E1'],
  
]

let bassPart = new Tone.Part((time,note) => {
  bass.triggerAttackRelease(note, 0.1, time);
  
}, bassPattern).start();
bassPart.loop = true;
bassPart.loopStart = 0;
bassPart.loopEnd = '6n';

let leadPattern = [
  
]
let leadPart = new Tone.Part((time,note) => {
  leadSampler.triggerAttackRelease(note, '2n', time);
}, leadPattern).start()
leadPart.loop = true;
leadPart.loopStart = 0;
leadPart.loopEnd = '2m';


//Interactions Buttons and Sliders

document.getElementById("start").onclick = async () => {
  await Tone.start();
  Tone.Transport.start();
}

document.getElementById("stop").onclick = async () => {
  Tone.Transport.stop();
}

document.getElementById("bpm").oninput = (evt) => {
  let newBpm = +evt.target.value;
  Tone.Transport.bpm.value = newBpm
  
}

let sequencer = new Nexus.Sequencer('#sequencer', {
  columns: 32,
  rows: 12,
  size: [550,200]
})

new Tone.Loop((time) => {
  Tone.Draw.schedule(() =>sequencer.next(),time);
}, '16n').start();

let sequencerRows = ['B3','G#3','E3', 'C#3', 'B2','G#2','E2', 'C#2']
sequencer.on('change', ({column, row, state}) => {
  let time ={'16n': column};
  let note = sequencerRows[row];
  console.log(time,note);
  if (state) {
    leadPart.add(time,note);
    
  }else {
    leadPart.remove(time, note);
    
  }
  
})