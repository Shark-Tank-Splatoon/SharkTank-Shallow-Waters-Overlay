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

const FunFactData = nodecg.Replicant('FunFactData', {
    defaultValue: {
        text: '',
        isVisible: false
    }
});
const FunFactText = document.getElementById('fun-fact-text');
const FunFactShow = document.getElementById('fun-fact-show');
const FunFactHide = document.getElementById('fun-fact-hide');

function updateFunFact(data) {
    FunFactData.value = {
        text: FunFactData.value?.text || '',
        isVisible: FunFactData.value?.isVisible === true,
        ...data
    };
}

function updateFunFactControls(data = {}) {
    if (FunFactText && FunFactText.value !== (data.text || '')) {
        FunFactText.value = data.text || '';
    }

    const isVisible = data.isVisible === true;
    if (FunFactShow) FunFactShow.setAttribute('aria-pressed', String(isVisible));
    if (FunFactHide) FunFactHide.setAttribute('aria-pressed', String(!isVisible));
}

if (FunFactText) {
    FunFactText.addEventListener('input', event => {
        updateFunFact({text: event.target.value});
    });
}

if (FunFactShow) {
    FunFactShow.addEventListener('click', () => updateFunFact({isVisible: true}));
}

if (FunFactHide) {
    FunFactHide.addEventListener('click', () => updateFunFact({isVisible: false}));
}

if (FunFactData && typeof FunFactData.on === 'function') {
    FunFactData.on('change', updateFunFactControls);
    updateFunFactControls(FunFactData.value);
}