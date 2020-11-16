class TrackerProfile {
	constructor(name, icon){
		this._name = name;
		this._icon = icon;
	}

	get name(){
		return this._name;
	}

	get icon(){
		return this._icon;
	}
}

class Tracker {
	constructor(name = 'New Addiction', profile = 'other', date = new Date(), spentMoney = 0, spentTime = 0) {
		this.name = name;
		this.profile = profile;
		this.date = date;
		this.spentMoney = spentMoney;
		this.spentTime = spentTime;
	}

	static html2Date(date, time) {
		date = new Date(date + " " + time);
		var now = new Date();

		if(date instanceof Date && !isNaN(date) && date <= now && date.getFullYear() >= 1900) {
			date = date;
		}
		else {
			date = now;
		}

		return date;
	}

	static date2HTML(date) {
		// Add padding zero to time values if needed.
		var monthNum = date.getMonth() + 1;
		monthNum = (monthNum < 10 ? '0' : '') + monthNum;
		var dayNum = date.getDate();
		dayNum = (dayNum < 10 ? '0' : '') + dayNum;
		var hrNum = date.getHours();
		hrNum = (hrNum< 10 ? '0' : '') + hrNum;
		var minNum = date.getMinutes();
		minNum = (minNum < 10 ? '0' : '') + minNum;

		return [
			date.getFullYear() + "-" + monthNum + "-" + dayNum,
			hrNum + ":" + minNum
		];
	}

	static getSoberTime(tracker) {
		//TODO: THIS IS A PLACEHOLDER
		return '13 hours';
	}

	static getNextGoal(tracker) {
		//TODO: THIS IS A PLACEHOLDER
		return '1 day';
	}

	static getGoalProgress(tracker) {
		//TODO: THIS IS A PLACEHOLDER
		return 0.6;
	}

	static getSpentMoney(tracker) {
		//TODO: THIS IS A PLACEHOLDER
		return '$1,000';
	}

	static getSpentTime(tracker) {
		//TODO: THIS IS A PLACEHOLDER
		return '1 hour';
	}
}

class Data{
	static trackerProfiles = {
		'alc': new TrackerProfile('Alcohol', 'las la-wine-bottle'),
		'nic': new TrackerProfile('Nicotine', 'las la-smoking'),
		'thc': new TrackerProfile('Weed', 'las la-cannabis'),
		'drugs': new TrackerProfile('Drugs', 'las la-capsules'),
		'porn': new TrackerProfile('Porn', 'las la-tired'),
		'sugar': new TrackerProfile('Sugar', 'las la-cookie-bite'),
		'fb': new TrackerProfile('Facebook', 'lab la-facebook-square'),
		'reddit': new TrackerProfile('Reddit', 'lab la-reddit'),
		'socialmedia': new TrackerProfile('Social Media', 'las la-hashtag'),
		'other': new TrackerProfile('Other', 'las la-exclamation')
	};

	static trackers = [];

	static load() {
		if(typeof(Storage) == 'undefined') return false;

		Data.trackers = JSON.parse(localStorage.getItem('trackers'));
		if(Data.trackers === null) Data.trackers = [];

		// When we load the trackers, their dates are strings, and must be converted to Dates.
		for(var i = 0; i < Data.trackers.length; i++) {
			Data.trackers[i].date = new Date(Data.trackers[i].date);
		}

		return true;
	}

	static write() {
		localStorage.setItem('trackers', JSON.stringify(Data.trackers));
	}

	static createNewTracker() {
		Data.trackers.push(new Tracker());

		return Data.trackers.length - 1;
	}

	static deleteTracker(id) {
		Data.trackers.splice(parseInt(id), 1);
	}

	static moveTracker(id, direction) {
		if(id + direction >= 0 && id + direction < Data.trackers.length) {
			var old = Data.trackers[id + direction];
			Data.trackers[id + direction] = Data.trackers[id];
			Data.trackers[id] = old;

			Data.write();

			return true;
		}
		else {
			return false;
		}
	}
}