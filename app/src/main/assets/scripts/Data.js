class Data{
	static get trackerProfiles() {
		return {
			'alc': new TrackerProfile('Alcohol', 'las la-wine-bottle'),
			'nic': new TrackerProfile('Nicotine', 'las la-smoking'),
			'thc': new TrackerProfile('Weed', 'las la-cannabis'),
			'porn': new TrackerProfile('Porn', 'las la-tired'),
			'sugar': new TrackerProfile('Sugar', 'las la-cookie-bite'),
			'fb': new TrackerProfile('Facebook', 'lab la-facebook-square'),
			'reddit': new TrackerProfile('Reddit', 'lab la-reddit'),
			'socialmedia': new TrackerProfile('Social Media', 'las la-hashtag'),
			'other': new TrackerProfile('Other', 'las la-exclamation')
		};
	}

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
}

class Tracker {
	constructor(name = 'Addiction', trackerProfile = 'other', date = Date.now(), spentMoney = 0, spentTime = 0) {
		this.name = name;
		this.trackerProfile = name;
		this.date = date;
		this.spentMoney = spentMoney;
		this.spentTime = spentTime;
	}

	//TODO: Potential bug; HTML moths are 1-12 while JS months are 0-11
	setDateHTML(date, time) {
		date = Date.parse(date + " " + time);

		if(date instanceof Date && !isNaN(date) && date <= Date.now()) {
			this.date = date;
		}
		else {
			this.date = Date.now();
		}
	}

	getDateHTML() {
		return [
			this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + this.date.getDate(),
			this.date.getHours() + ":" + this.date.getMinutes()
		];
	}
}

class TrackerProfile {
	constructor(name, icon){
		this._name = name;
		this._icon = icon;
	}

	get name(){
		return this._name;
	}

	get icon(){
		return this.icon;
	}
}