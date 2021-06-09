
module.exports = class Note {
	
	constructor(id, title, schedule) {
		this.title = title
		this.schedule = schedule
		let cdate = new Date()
		this.created = cdate.toISOString()
		this.modified = null
		this.id = id
	}

	get _title() {
		return this.title
	}

	get _schedule() {
		return this.schedule
	}

	set _title(title) {
		this.title = title
	}

	set _schedule(schedule) {
		this.schedule = schedule
	}

	set _modified (modifiedDate) {
		this.modified = modifiedDate
	}
};