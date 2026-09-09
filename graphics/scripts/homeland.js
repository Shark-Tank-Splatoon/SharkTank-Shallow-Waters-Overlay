HomelandEnabled.on('change', newValue => {
    if (newValue) {
        enableHomeland();
    } else {
        disableHomeland();
    }
});

const homelandImage = document.getElementById('homeland-image');

function enableHomeland() {
    homelandImage.hidden = false;
}

function disableHomeland() {
    homelandImage.hidden = true;
}
