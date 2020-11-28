class Goal {
	constructor(goalHours, lastGoalHours, divideBy, timeUnit) {
		this._goalHours = goalHours;
		this._lastGoalHours = lastGoalHours;
		this._divideBy = divideBy;
		this._timeUnit = timeUnit;
	}

	get goalHours() { return this._goalHours; }
	get lastGoalHours() { return this._lastGoalHours; }
	get divideBy() { return this._divideBy; }
	get timeUnit() { return this._timeUnit; }
}

class TrackerProfile {
	constructor(name, icon) {
		this._name = name;
		this._icon = icon;
	}

	get name() { return this._name; }

	get icon() { return this._icon; }
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
		hours = (Math.floor(hours * 10) / 10);
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

	static goals = [
		new Goal(6,		0,		1,		'Hour'),	// 6 hours
		new Goal(12,	6,		1,		'Hour'),	// 12 hours
		new Goal(24,	12,		1,		'Hour'),	// 24 hours
		new Goal(48,	24,		1,		'Hour'),	// 48 hours
		new Goal(168,	48,		24,		'Day'),		// 7 days
		new Goal(336,	168,	24,		'Day'),		// 14 days
		new Goal(672,	336,	168,	'Week'),	// 4 weeks
		new Goal(1344,	672,	168,	'Week'),	// 8 weeks
		new Goal(2922,	1344,	730.5,	'Month'),	// 4 months
		new Goal(5844,	2922,	730.5,	'Month'),	// 8 months
		new Goal(8766,	5844,	730.5,	'Month')	// 12 months
	];

	static trackers = [];
	static pin = null;

	static load() {
		if(typeof(Storage) == 'undefined') return false;

		Data.pin = localStorage.getItem('pin');

		Data.trackers = JSON.parse(localStorage.getItem('trackers'));
		if(Data.trackers === null) Data.trackers = [];

		// When we load the trackers, their dates are strings, and must be converted to Dates.
		for(var i = 0; i < Data.trackers.length; i++) {
			Data.trackers[i].date = new Date(Data.trackers[i].date);
		}

		return true;
	}

	static write() {
		localStorage.setItem('pin', Data.pin);
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