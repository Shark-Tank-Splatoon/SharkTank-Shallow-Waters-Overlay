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

function hideStartingSoon() {
    setSceneVisibility('.starting-soon', false);
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
    toggleExpandBackground(false);
    gsap.set('.main-scene > .scene-content', {
        x: 0,
        opacity: 0
    });
    gsap.to('.main-scene > .scene-content', {
        opacity: 1,
        duration: 0.5
    });
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

function showStartingSoon() {
    toggleExpandBackground(false);
    gsap.set('.starting-soon > .scene-content', {
        x: 0,
        opacity: 0
    });
    gsap.to('.starting-soon > .scene-content', {
        opacity: 1,
        duration: 0.5
    });
}

const SCENE_SELECTORS = {
    'main': '.main-scene',
    'teams': '.teams-scene',
    'stages': '.stages-scene',
    'starting-soon': '.starting-soon'
};

function syncBubbleLoops(scene) {
    const activeScene = document.querySelector(SCENE_SELECTORS[scene]);

    document.querySelectorAll('.bubble-loop').forEach(video => {
        if (activeScene && activeScene.contains(video)) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}

const TRANSITION_SWAP_AT = 0.6;

function playTransition(onCovered, onDone) {
    const video = document.getElementById('transition');
    let swapped = false;
    let swapTimer;
    const swap = () => {
        if (swapped) return;
        swapped = true;
        onCovered();
    };
    const finish = () => {
        clearTimeout(swapTimer);
        swap();
        if (video) video.style.visibility = 'hidden';
        onDone();
    };

    if (!video) {
        finish();
        return;
    }

    const start = () => {
        swapTimer = setTimeout(swap, TRANSITION_SWAP_AT * 1000);
    };

    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.style.visibility = 'visible';
    video.addEventListener('ended', finish, { once: true });

    video.play()
        .then(start)
        .catch(() => {
            // Sound blocked (e.g. a normal browser tab): retry muted
            video.muted = true;
            return video.play().then(start);
        })
        .catch(() => {
            video.removeEventListener('ended', finish);
            finish();
        });
}

function applyScene(newValue, oldValue) {
    if (!oldValue) {
        hideMainScene();
        hideTeams();
        hideStages();
        hideStartingSoon();
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
            case 'starting-soon':
                hideStartingSoon();
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
        case 'starting-soon':
            showStartingSoon();
            break;
        default:
    }

    syncBubbleLoops(newValue);
}

let currentScene;
let isTransitioning = false;
let queuedScene = null;

function updateScene(newValue) {
    if (currentScene === undefined) {
        currentScene = newValue;
        applyScene(newValue, null);
        return;
    }

    if (isTransitioning) {
        queuedScene = newValue;
        return;
    }

    if (newValue === currentScene) return;

    const fromScene = currentScene;
    currentScene = newValue;
    isTransitioning = true;

    playTransition(
        () => applyScene(newValue, fromScene),
        () => {
            isTransitioning = false;
            const next = queuedScene;
            queuedScene = null;
            if (next && next !== currentScene) updateScene(next);
        }
    );
}

if (activeBreakScene && typeof activeBreakScene.on === 'function') {
    activeBreakScene.on('change', updateScene);

    if (activeBreakScene.value) {
        updateScene(activeBreakScene.value);
    }
}

