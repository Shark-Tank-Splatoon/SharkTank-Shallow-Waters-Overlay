// Homeland Edition overlay -> Toggled via dashboard
const homelandImage = document.getElementById('homeland-image');

if (!homeladnImage) {
    console.warn('[homeland] homeland-image element not found');
}

function enableHomeland() {
    if (homelandImage) homelandImage.hidden = false;
}

function disableHomeland() {
    homelandImage.hidden = true;
}

function updateHomeland(newValue) {
    if (newValue) {
        enableHomeland();
    } else {
        disableHomeland();
    }
}

if (HomelandEnabled && typeof HomelandEnabled.on === 'function') {
    HomelandEnabled.on('change', updateHomeland);
    updateHomeland(HomelandEnabled.value);
}
