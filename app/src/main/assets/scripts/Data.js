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

	static hoursToTimeString(hours) {
		var breakpoints = [
			{hr: 24, name: 'Day'},
			{hr: 168, name: 'Week'},
			{hr: 730.5, name: 'Month'}
		];

		var breakpoint;

		for(var b in breakpoints.reverse()) {
			if(hours >= breakpoints[b].hr) {
				hours /= breakpoints[b].hr;
				breakpoint = breakpoints[b];

				break;
			}
		}

		// If the breakpoint is null, the elapsed time is less than 1 day and shouldn't be divided.
		if(breakpoint === undefined) breakpoint = {name: 'Hour'};

		// Add "s" to plural numbers.
		hours = (Math.round(hours * 10) / 10);
		if(hours != 1) breakpoint.name += 's';

		return hours + ' ' + breakpoint.name;
	}

	static getHoursFromStart(tracker) {
		return Math.abs(Date.now() - tracker.date) / (60*60*1000);
	}

	static getSoberTime(tracker) {
		return Tracker.hoursToTimeString(Tracker.getHoursFromStart(tracker));
	}

	static getNextGoal(tracker) {
		var goals = [
			6,
			12,
			24,
			72,
			168,
			336,
			730.5,
			1461,
			2191.5,
			4383,
			8766,
			17532,
			87660,
			Number.MAX_SAFE_INTEGER
		];

		var soberHours = Tracker.getHoursFromStart(tracker);
		var goal = goals[0];

		for(var g = 0; g < goals.length; g++) {
			if(soberHours < goals[g]) break;

			goal = goals[g + 1];
		}

		return goal;
	}

	static getNextGoalString(tracker) {
		return Tracker.hoursToTimeString(Tracker.getNextGoal(tracker));
	}

	static getGoalProgress(tracker) {
		return 1.0 * Tracker.getHoursFromStart(tracker) / Tracker.getNextGoal(tracker);
	}

	static getSpentTotal(tracker, number) {
		return 1.0 * Tracker.getHoursFromStart(tracker) / 168 * number;
	}

	static getSpentMoney(tracker) {
		return new Intl.NumberFormat(
			'en-US',
			{
				style: 'currency',
				currency: 'USD'
			}
		)
		.format(
			Tracker.getSpentTotal(tracker, tracker.spentMoney)
		);
	}

	static getSpentTime(tracker) {
		return Tracker.hoursToTimeString(Tracker.getSpentTotal(tracker, tracker.spentTime));
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