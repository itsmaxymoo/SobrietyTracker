var elementEmptyStartMessage;
var elementTrackerEditor;
var elementTrackerEditorButtonsMain;
var elementTrackerEditorButtonsDelete;

document.addEventListener('contextmenu', event => event.preventDefault());
window.onload = function() {
	Data.load();

	elementEmptyStartMessage = document.getElementById('empty-start-message');
	elementTrackerEditor = document.getElementById('tracker-editor');
	elementTrackerEditorButtonsMain = document.getElementById('tracker-editor-buttons-main');
	elementTrackerEditorButtonsDelete = document.getElementById('tracker-editor-buttons-delete');

	hideElement(elementTrackerEditorButtonsDelete);

	render();
}

function render(){
	if(Data.trackers.length > 0){
		hideElement(elementEmptyStartMessage);
	}
}

function hideElement(e){
	e.style.display = 'none';
}

function showElement(e){
	e.style.display = 'block';
}