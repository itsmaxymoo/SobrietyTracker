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
		Data.trackers.splice(id, 1);
	}

	static html2Date(date, time) {
		date = new Date(date + " " + time);
		var now = new Date();

		if(date instanceof Date && !isNaN(date) && date <= now) {
			date = date;
		}
		else {
			date = now;
		}

		return date;
	}

	static date2HTML(date) {
		date = new Date(date);

		return [
			date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
		];
	}
}