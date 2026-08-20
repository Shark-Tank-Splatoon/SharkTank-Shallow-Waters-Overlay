/*
JS Script for switching between scenes in the break overlay. Inspired by IPL's Low Ink Overlay project. The original code can be found here: https://github.com/inkfarer/low-ink-overlays/blob/master/graphics/scripts/break/sceneSwitcher.js
This script is used to switch between the different scenes in the break overlay.
It listens for changes in the "scene" replicant and updates the visibility of the scenes accordingly.
*/
const sceneT1 = gsap.timeline();

activeBreakScene.on('change', (newValue, oldValue) => {
    if (!oldValue) {
        switch (newValue) {
            case 'main':
                hideStages();
                hideTeams();
                break;
            case 'teams':
                hideMainScene();
                hideStages();
                break;
            case 'stages':
                hideMainScene();
                hideTeams();
                break;
            default:

        }
    } else {
        switch (oldValue) {
            case 'main':
                hideMainScene();
                break;
            case 'teams':
                hideTeams();
                break;
            case 'stages':
                hideStages();
                break;
            default:

        }
    }
    switch (newValue) {
        case 'main':
            hideInfoBar('-=0.6');
            setInfoSwitchAnim();
            showMainScene();
            break;
        case 'teams':
            showInfoBar();
            showTeams();
            break;
        case 'stages':
            showInfoBar();
            showStages();
            break;
        default:
    }
}); 

function showMainScene() {
    toggleExpandBackground(false);
    sceneT1.add(gsap.to('.scene-main > .scene-content', {
        x: 0,
        opacity: 1,
        duration: 0.5
    } ), '-=0.3')
}