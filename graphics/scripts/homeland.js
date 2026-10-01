const homelandImage = document.getElementById('homeland-image');

function enableHomeland() {
    homelandImage.hidden = false;
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
