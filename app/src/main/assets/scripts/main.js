// I wish JS had structs, but this will have to do for now.
class elements {
	static emptyStartMessage;
	static trackerContainer;
	static trackerEditor;
	static trackerEditorId;
	static trackerEditorTitle;
	static trackerEditorEditName;
	static trackerEditorEditType;
	static trackerEditorTypeIcon;
	static trackerEditorEditDate;
	static trackerEditorEditDateTime;
	static trackerEditorEditSpentMoney
	static trackerEditorEditSpentTime
	static trackerEditorButtonsMain;
	static trackedEditorButtonsDelete;
	static about;
}

// Run once on app startup.
document.addEventListener('contextmenu', event => event.preventDefault());
window.onload = function() {
	// Element references.
	elements.emptyStartMessage = document.getElementById('empty-start-message');
	elements.trackerContainer = document.getElementById('tracker-container');
	elements.trackerEditor = document.getElementById('tracker-editor');
	elements.trackerEditorId = document.getElementById('tracker-editor-id');
	elements.trackerEditorTitle = document.getElementById('tracker-editor-title');
	elements.trackerEditorEditName = document.getElementById('tracker-editor-edit-name');
	elements.trackerEditorEditType = document.getElementById('tracker-editor-edit-type');
	elements.trackerEditorTypeIcon = document.getElementById('tracker-editor-type-icon');
	elements.trackerEditorEditDate = document.getElementById('tracker-editor-edit-date');
	elements.trackerEditorEditDateTime = document.getElementById('tracker-editor-edit-date-time');
	elements.trackerEditorEditSpentMoney = document.getElementById('tracker-editor-edit-spent-money');
	elements.trackerEditorEditSpentTime = document.getElementById('tracker-editor-edit-spent-time');
	elements.trackerEditorButtonsMain = document.getElementById('tracker-editor-buttons-main');
	elements.trackerEditorButtonsDelete = document.getElementById('tracker-editor-buttons-delete');
	elements.about = document.getElementById('about');

	// Constructor tracker editor type dropdown.
	for(key in Data.trackerProfiles){
		var option = document.createElement('option');
		option.text = Data.trackerProfiles[key].name;
		option.value = key;
		elements.trackerEditorEditType.add(option);
	}
	elements.trackerEditorTypeIcon.className = Data.trackerProfiles[Object.keys(Data.trackerProfiles)[0]].icon;

	render();

	// Initial load done, fade in.
	document.body.style.opacity = 1;
}

// Runs multiple times.
function render() {
	elements.trackerContainer.innerHTML = '';

	Data.load();

	if(Data.trackers.length > 0) {
		hideElement(elements.emptyStartMessage);

		// Construct trackers.
		for(var id = 0; id < Data.trackers.length; id++) {
			var tracker = Data.trackers[id];
			var html = `
				<div class="box">
					<div class="columns is-gapless is-multiline is-size-3">
						<div class="column">
							<i class="${Data.trackerProfiles[tracker.profile].icon}"></i>&nbsp;${tracker.name}
						</div>
						<div class="column has-text-right has-text-left-mobile">
							${Tracker.getSoberTime(tracker)}
						</div>
					</div>

					<progress class="progress is-success is-large  mb-0 mt-0" value="${Tracker.getGoalProgress(tracker)}" max="1" data-label="1 Day"></progress>
					<p class="has-text-centered has-text-grey mt-0 pt-0 is-size-4">Next goal: ${Tracker.getNextGoalString(tracker)}</p>
			`;

			if(tracker.spentMoney + tracker.spentTime > 0) {
				html += `
					<div class="box">
				`;

				if(tracker.spentMoney > 0) {
					html += `
						<div class="field">
							<label class="label">Money Saved</label>
							<div class="control">
								<span class="is-size-4">${Tracker.getSpentMoney(tracker)}</span>
							</div>
						</div>
					`;
				}

				if(tracker.spentTime > 0) {
					html += `
						<div class="field">
							<label class="label">Time Saved</label>
							<div class="control">
								<span class="is-size-4">${Tracker.getSpentTime(tracker)}</span>
							</div>
						</div>
					`;
				}

				html += `
					</div>
				`;
			}

			html += `
					<p class="has-text-centered mt-4">
						<i class="las la-edit la-3x" onclick="GUI.loadTrackerEditor(${id});"></i>
						<i class="las la-chevron-circle-down la-3x" onclick="GUI.moveTracker(${id}, 1);"></i>
						<i class="las la-chevron-circle-up la-3x" onclick="GUI.moveTracker(${id}, -1);"></i>
					</p>
				</div>
			`;

			elements.trackerContainer.innerHTML += html;
		}
	}
	else {
		showElement(elements.emptyStartMessage);
	}
}

function hideElement(e) {
	e.style.display = 'none';
}

function showElement(e) {
	e.classList.remove('starts-hidden');
	e.style.display = 'block';
}

// GUI Functions.
class GUI {
	static createNewTracker() {
		var trackerId = Data.createNewTracker();

		GUI.loadTrackerEditor(trackerId);

		GUI.trackerEditorTypeIconUpdate();
	}

	static moveTracker(id, direction) {
		if(Data.moveTracker(id, direction)) {
			render();

			return true;
		}

		return false;
	}

	static loadTrackerEditor(trackerId){
		elements.trackerEditorId.value = trackerId;
		var tracker = Data.trackers[trackerId];
		showElement(elements.trackerEditor);

		elements.trackerEditorTitle.innerHTML = tracker.name;
		elements.trackerEditorEditName.value = tracker.name;
		elements.trackerEditorEditType.value = tracker.profile;
		elements.trackerEditorEditDate.value = Tracker.date2HTML(tracker.date)[0];
		elements.trackerEditorEditDateTime.value = Tracker.date2HTML(tracker.date)[1];
		elements.trackerEditorEditSpentMoney.value = tracker.spentMoney;
		elements.trackerEditorEditSpentTime.value = tracker.spentTime;
	}

	static trackerEditorNameUpdate() {
		elements.trackerEditorTitle.innerHTML = elements.trackerEditorEditName.value;
	}

	static trackerEditorTypeIconUpdate() {
		elements.trackerEditorTypeIcon.className = Data.trackerProfiles[elements.trackerEditorEditType.value].icon;
	}

	static trackerEditorSetDisabled(disabled) {
		elements.trackerEditorEditName.disabled = disabled;
		elements.trackerEditorEditType.disabled = disabled;
		elements.trackerEditorEditDate.disabled = disabled;
		elements.trackerEditorEditDateTime.disabled = disabled;
		elements.trackerEditorEditSpentMoney.disabled = disabled;
		elements.trackerEditorEditSpentTime.disabled = disabled;
	}

	static trackerEditorDelete() {
		GUI.trackerEditorSetDisabled(true);

		hideElement(elements.trackerEditorButtonsMain);
		showElement(elements.trackerEditorButtonsDelete);
	}

	static trackerEditorDeleteCancel() {
		showElement(elements.trackerEditorButtonsMain);
		hideElement(elements.trackerEditorButtonsDelete);

		GUI.trackerEditorSetDisabled(false);
	}

	static trackerEditorDeleteConfirm() {
		Data.deleteTracker(elements.trackerEditorId.value);
		hideElement(elements.trackerEditor);
		showElement(elements.trackerEditorButtonsMain);
		hideElement(elements.trackerEditorButtonsDelete);

		Data.write();

		render();

		GUI.trackerEditorSetDisabled(false);
	}

	static trackerEditorSave() {
		var trackerId = elements.trackerEditorId.value;
		var tracker = Data.trackers[trackerId];
		
		tracker.name = elements.trackerEditorEditName.value;
		tracker.profile = elements.trackerEditorEditType.value;
		tracker.date = Tracker.html2Date(
			elements.trackerEditorEditDate.value,
			elements.trackerEditorEditDateTime.value
		);
		tracker.spentMoney = elements.trackerEditorEditSpentMoney.value;
		tracker.spentTime = elements.trackerEditorEditSpentTime.value;

		Data.write();

		hideElement(elements.trackerEditor);

		render();
	}

	static showAbout(show) {
		if(show) {
			showElement(elements.about);
		}
		else {
			hideElement(elements.about);
		}
	}
}