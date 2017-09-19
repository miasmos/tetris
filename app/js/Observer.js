export default class Observer {
	constructor() {
		this.subjects = {}
	}

	on(event, fn) {
		if ((typeof event !== 'number' && typeof event !== 'string') || typeof fn !== 'function') {
			return
		}
		if (!(event in this.subjects)) {
			this.subjects[event] = []
		}

		this.subjects[event].push(fn)
	}

	off(event, fn) {
		if (!(event in this.subjects)) {
			return;
		}
		if (typeof fn === 'function') {
			for (var index in this.subjects[event]) {
				var subject = this.subjects[event][index]
				if (subject.fn === fn) {
					this.subjects[event].splice(0, index)
				}
			}
		} else {
			delete target[event]
		}
	}

	emit(event, args) {
		if (event in this.subjects) {
			for (var index in this.subjects[event]) {
				var subject = this.subjects[event][index]
				subject.apply(this, args)
			}
		}
	}
}