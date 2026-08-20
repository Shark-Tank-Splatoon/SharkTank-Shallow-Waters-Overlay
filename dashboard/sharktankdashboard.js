const DASHBOARD_BUNDLE_NAME = 'ipl-overlay-controls';
const PibbleModeEnabled = nodecg.Replicant('PibbleModeEnabled', {defaultValue: false});
const PibbleModeToggle = document.getElementById('pibble-mode-toggle');

PibbleModeToggle.addEventListener('change', e => {
    PibbleModeEnabled.value = e.target.checked;
});

PibbleModeEnabled.on('change', newValue => {
    PibbleModeToggle.checked = newValue;
});
