/*
JS for the Shark Tank Dashboard custom Tab, used for integrating non-standard functionality. This is a custom tab that is not part of the standard overlay controls.
If you want a custom feature for this is the place to add it.
*/

// Start of the Pibble Mode Toggle
const PibbleModeEnabled = nodecg.Replicant('PibbleModeEnabled', { defaultValue: false });
const PibbleModeToggle = document.getElementById('pibble-mode-toggle');

if (PibbleModeToggle) {
    PibbleModeToggle.addEventListener('change', event => {
        PibbleModeEnabled.value = Boolean(event.target.checked);
    });

    PibbleModeEnabled.on('change', newValue => {
        PibbleModeToggle.checked = Boolean(newValue);
    });
}
// End of the Pibble Mode Toggle

const HomelandEnabled = nodecg.Replicant('HomelandEnabled', { defaultValue: false });
const HomelandToggle = document.getElementById('homeland-toggle');

if (HomelandToggle) {
    HomelandToggle.addEventListener('change', event => {
        HomelandEnabled.value = Boolean(event.target.checked);
    });

    HomelandEnabled.on('change', newValue => {
        HomelandToggle.checked = Boolean(newValue);
    });
}
// End of the Homeland Toggle