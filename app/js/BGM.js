const Tone = require('tone')

export default class BGM {
    constructor(json) {
        this.instruments = {
            lead: new Tone.PolySynth(2, Tone.Sawtooth).chain(new Tone.Volume(-12), Tone.Master),
            bass: new Tone.MonoSynth(8).chain(new Tone.Volume(-6), Tone.Master)
        }
        this.transport = Tone.Transport
        this.transport.bpm.value = json.header.bpm
        this.parts = {
            lead: this.AddPart(this.instruments.lead, json.duration, json.tracks[0].notes),
            bass: this.AddPart(this.instruments.bass, json.duration, json.tracks[1].notes)
        }
        this.parts.lead.start()
        this.parts.bass.start()
        this.playing = false
    }

    AddPart(instrument, loopEnd, notes) {
        let part = new Tone.Part((time, note) => {this.onNote(instrument, time, note)}, notes)
        part.loop = true
        part.loopEnd = loopEnd
        return part
    }

    Play() {
        if (!this.playing) {
            this.transport.start()
            this.playing = true
        }
    }

    Pause() {
        if (this.playing) {
            this.transport.pause()
            this.playing = false
        }
    }

    Stop() {
        this.transport.stop()
        this.playing = false
    }

    onNote(instrument, time, note) {
        instrument.triggerAttackRelease(note.name, note.duration, time, note.velocity)
    }
}