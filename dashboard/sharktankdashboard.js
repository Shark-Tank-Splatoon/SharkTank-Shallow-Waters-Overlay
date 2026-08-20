const PibbleModeEnabled = nodecg.Replicant('PibbleModeEnabled', DASHBOARD_BUNDLE_NAME);
const PibbleModeToggle = document.getElementById('pibble-mode-toggle');

PibbleModeToggle.addEventListener('change', e => {
    PibbleModeEnabled.value = e.target.checked;
});

PibbleModeEnabled.on('change', newValue => {
    PibbleModeToggle.checked = newValue;
});
