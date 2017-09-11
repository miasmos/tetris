export default class Observer {
	constructor() {
		this.subjects = {'global': {}}
	}

	on(event, namespace = 'global', fn, args) {
		if ((typeof event !== 'number' && typeof event !== 'string') || (typeof namespace !== 'number' && typeof namespace !== 'string') || typeof fn !== 'function') {
			return
		}
		if (!(namespace in this.subjects)) {
			this.subjects[namespace] = {}
		}
		if (!(event in this.subjects[namespace])) {
			this.subjects[namespace][event] = []
		}

		this.subjects[namespace][event].push({ namespace, event, fn, args })
	}

	off(event, namespace = 'global', fn) {
		if (!(namespace in this.subjects) || !(event in this.subjects[namespace])) {
			return;
		}
		let target = this.subjects[namespace]
		if (typeof fn === 'function') {
			for (var index in target) {
				var subject = target[index]
				if (subject.fn === fn) {
					this.subjects[event].splice(0, index)
				}
			}
		} else {
			delete target[event]
		}
	}

	emit(event, namespace = 'global', args) {
		if (!(namespace in this.subjects)) return
		if (event in this.subjects[namespace]) {
			let target = this.subjects[namespace]
			for (var index in target[event]) {
				var subject = target[event][index]
				subject.fn.call(this, subject.args, args)
			}
		}
	}
}