PibbleModeEnabled.on('change', newValue => {
    if (newValue) {
        enablePibble();
    } else {
        disablePibble();
    }
});

const pibbleImage = document.getElementById('pibble-image');

function enablePibble() {
    pibbleImage.hidden = false;
}

function disablePibble() {
    pibbleImage.hidden = true;
}
