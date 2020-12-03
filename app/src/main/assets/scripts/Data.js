class Goal {
	static goals = [
		new Goal(6,			0,		1,		'Hour'),	// 6 hours
		new Goal(12,		6,		1,		'Hour'),	// 12 hours
		new Goal(24,		12,		1,		'Hour'),	// 24 hours
		new Goal(48,		24,		1,		'Hour'),	// 48 hours
		new Goal(168,		48,		24,		'Day'),		// 7 days
		new Goal(336,		168,	24,		'Day'),		// 14 days
		new Goal(672,		336,	168,	'Week'),	// 4 weeks
		new Goal(1344,		672,	168,	'Week'),	// 8 weeks
		new Goal(2922,		1344,	730.5,	'Month'),	// 4 months
		new Goal(5844,		2922,	730.5,	'Month'),	// 8 months
		new Goal(8766,		5844,	730.5,	'Month'),	// 12 months
		new Goal(13149,		8766,	730.5,	'Month'),	// 18 months
		new Goal(17532,		13149,	730.5,	'Month'),	// 24 months
		new Goal(21915,		17532,	730.5,	'Month'),	// 30 months
		new Goal(26298,		21915,	730.5,	'Month'),	// 36 months
		new Goal(35040,		26298,	8760,	'Year'),	// 4 years
		new Goal(43800,		35040,	8760,	'Year'),	// 5 years
		new Goal(87600,		43800,	8760,	'Year'),	// 10 years
		new Goal(175200,	87600,	8760,	'Year'),	// 20 years
		new Goal(8760000,	175200,	8760,	'Year')		// forever
	];

	static getGoal(hours) {
		if(hours <= 0) hours = 0.1; // Ensure hours are > 0.

		for(var i = Goal.goals.length - 1; i >= 1; i--) {
			if (hours > Goal.goals[i].lastGoalHours) return Goal.goals[i];
		}

		return Goal.goals[0];
	}

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
	constructor(name = 'New Addiction', profile = 'other', date = new Date(), spentMoney = 0, spentTime = 0, isTryptamine = false) {
		this.name = name;
		this.profile = profile;
		this.date = date;
		this.spentMoney = spentMoney;
		this.spentTime = spentTime;
		this.isTryptamine = isTryptamine;

		this.goal = Goal.goals[Goal.goals.length - 1];
	}

	static html2Date(date, time) {
		date = new Date(date + ' ' + time);
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

	static formatTime(hours) {
		var g = Goal.getGoal(hours);
		var unit = g.timeUnit;

		hours = Math.floor(hours / g.divideBy * 10) / 10;
		if(hours != 1) unit += 's';

		return hours + ' ' + unit;
	}

	static getHoursFromStart(tracker) {
		return Math.abs(Date.now() - tracker.date) / (60*60*1000);
	}

	static getSoberTime(tracker) {
		return Tracker.formatTime(
			Tracker.getHoursFromStart(tracker)
		);
	}

	static getNextGoalString(tracker) {
		return Tracker.formatTime(
			Goal.getGoal(
				Tracker.getHoursFromStart(tracker)
			)
			.goalHours
		);
	}

	static getGoalProgress(tracker) {
		var g = tracker.goal;
		return 1.0 * (
			Tracker.getHoursFromStart(tracker) - g.lastGoalHours
		) / (
			g.goalHours - g.lastGoalHours
		);
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
		return Tracker.formatTime(Tracker.getSpentTotal(tracker, tracker.spentTime));
	}

	static getTryptamineTolerance(tracker) {
		var days = Tracker.getHoursFromStart(tracker) / 24;

		return Math.floor(
			Math.max(
				100,
				280.059565 * Math.pow(days, -0.412565956)
			) * 100
		) / 100 + '%';
	}
}

class Data {
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
	static pin = null;

	static load() {
		if(typeof(Storage) == 'undefined') return false;

		Data.pin = localStorage.getItem('pin');

		Data.trackers = JSON.parse(localStorage.getItem('trackers'));
		if(Data.trackers == null) Data.trackers = [];

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