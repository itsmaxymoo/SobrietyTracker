// I wish JS had structs, but this will have to do for now.
class elements {
	static emptyStartMessage;
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
}

// Run once on app startup.
document.addEventListener('contextmenu', event => event.preventDefault());
window.onload = function() {
	// Element references.
	elements.emptyStartMessage = document.getElementById('empty-start-message');
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

	// Constructor tracker editor type dropdown.
	for(key in Data.trackerProfiles){
		var option = document.createElement('option');
		option.text = Data.trackerProfiles[key].name;
		option.value = key;
		elements.trackerEditorEditType.add(option);
	}
	elements.trackerEditorTypeIcon.className = Data.trackerProfiles[Object.keys(Data.trackerProfiles)[0]].icon;

	// Hide elements to not be shown by default.
	hideElement(elements.trackerEditorButtonsDelete);
	hideElement(elements.trackerEditor);

	render();
}

// Runs multiple times.
function render() {
	Data.load();

	if(Data.trackers.length > 0) {
		hideElement(elements.emptyStartMessage);
	}
	else {
		showElement(elements.emptyStartMessage);
	}
}

function hideElement(e) {
	e.style.display = 'none';
}

function showElement(e) {
	e.style.display = 'block';
}

// GUI Functions.
class GUI {
	static createNewTracker() {
		var trackerId = Data.createNewTracker();

		GUI.loadTrackerEditor(trackerId);

		GUI.trackerEditorTypeIconUpdate();
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
}