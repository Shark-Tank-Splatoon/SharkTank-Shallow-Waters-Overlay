/*
JS Script for switching between scenes in the break overlay. Inspired by IPL's Low Ink Overlay project. The original code can be found here: https://github.com/inkfarer/low-ink-overlays/blob/master/graphics/scripts/break/sceneSwitcher.js
This script is used to switch between the different scenes in the break overlay.
It listens for changes in the "scene" replicant and updates the visibility of the scenes accordingly.
*/
function setSceneVisibility(sceneSelector, visible) {
    const sceneContent = document.querySelector(`${sceneSelector} > .scene-content`);

    if (!sceneContent || !window.gsap) return;

    gsap.set(sceneContent, {
        x: visible ? 0 : 1920,
        opacity: visible ? 1 : 0
    });
}

function hideMainScene() {
    setSceneVisibility('.main-scene', false);
}

function hideTeams() {
    setSceneVisibility('.teams-scene', false);
}

function hideStages() {
    setSceneVisibility('.stages-scene', false);
}

function showScene(sceneSelector) {
    toggleExpandBackground(false);
    gsap.to(`${sceneSelector} > .scene-content`, {
        x: 0,
        opacity: 1,
        duration: 0.5
    });
}

function showMainScene() {
    showScene('.main-scene');
}

function showTeams() {
    toggleExpandBackground(false);
    gsap.set('.teams-scene > .scene-content', {
        x: 0,
        opacity: 1
    });
    gsap.fromTo('.teams-roster', {
        opacity: 0
    }, {
        opacity: 1,
        duration: 0.5
    });
}

function showStages() {
    toggleExpandBackground(false);
    gsap.set('.stages-scene > .scene-content', {
        x: 0,
        opacity: 0
    });
    gsap.to('.stages-scene > .scene-content', {
        opacity: 1,
        duration: 0.5
    });
}

if (activeBreakScene && typeof activeBreakScene.on === 'function') {
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
                hideInfoBar();
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
}

