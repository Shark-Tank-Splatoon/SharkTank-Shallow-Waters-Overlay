// Pibble mode glorp alert

if (!pibbleImage) {
    console.warn('[pibble] pibble-image element not found');
}

const pibbleImage = document.getElementById('pibble-image');

function enablePibble() {
    if (pibbleImage) pibbleImage.hidden = false;
}

function disablePibble() {
    if (pibbleImage) pibbleImage.hidden = true;
}

if (PibbleModeEnabled && typeof PibbleModeEnabled.on === 'function') {
    PibbleModeEnabled.on('change', newValue => {
        if (newValue) {
            enablePibble();
        } else {
            disablePibble();
        }
    });
}