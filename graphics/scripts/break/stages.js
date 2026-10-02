const SET_OVER_IMAGE = 'img/8_extra/setover.png';
const SET_OVER_LABEL = 'Set is Over!';
const COUNTER_PICK_IMAGE = 'img/4_bo3bo5/bo5/counter%20pick%20image.png';
const COUNTER_PICK_LABEL = 'Counterpick!';
const GAME_MODE_IMAGES = {
    'Clam Blitz': 'img/4_bo3bo5/stageicons/cb.png',
    Rainmaker: ['img/4_bo3bo5/stageicons/rmderp.png', 'img/4_bo3bo5/stageicons/rmmad.png'],
    'Splat Zones': 'img/4_bo3bo5/stageicons/splatz.png',
    'Tower Control': 'img/4_bo3bo5/stageicons/tc.png'
};

function isUnknownStageName(value) {
    return /^(unknown|no)\s+(map|stage)$/i.test(String(value || '').trim());
}

function isStageGamePlayed(game) {
    return game?.winner === 'alpha' || game?.winner === 'bravo';
}

function getStageWinnerTeam(game, round) {
    const teamA = round?.teamA || {};
    const teamB = round?.teamB || {};
    if (game?.winner === 'alpha') return teamA;
    if (game?.winner === 'bravo') return teamB;
    return null;
}

function getGameModeImage(game) {
    const image = GAME_MODE_IMAGES[game?.mode];
    return Array.isArray(image)
        ? image[Math.floor(Math.random() * image.length)]
        : image || '';
}

function setGameModeImage(stageIndex, image) {
    const element = document.querySelector(`[data-stage-mode-image="${stageIndex}"]`);
    if (!element) return;

    element.style.backgroundImage = image ? `url("${image}")` : 'none';
    element.classList.toggle('has-mode', Boolean(image));
}

function setStageText(stage, selector, value) {
    const element = stage.querySelector(selector);
    if (element) element.textContent = value;
}

function setStageData(stage, game, round) {
    const mapName = game?.stage && !isUnknownStageName(game.stage)
        ? game.stage
        : COUNTER_PICK_LABEL;
    const winnerTeam = getStageWinnerTeam(game, round);
    const isCompleted = Boolean(winnerTeam);
    const winnerImage = winnerTeam?.showLogo ? winnerTeam.logoUrl : '';
    const winnerImageUrl = winnerImage || (isCompleted ? '../../img/2_commbreak/pibble%20(MANDATORY).jpg' : '');
    const stageImage = assetPaths?.value?.stageImages?.[game?.stage] || COUNTER_PICK_IMAGE;
    const gameModeImage = getGameModeImage(game);

    setStageText(stage, '[data-stage-name]', mapName);

    const stageLabel = document.querySelector(`[data-stage-label="${stage.dataset.stageIndex}"]`);
    if (stageLabel) {
        setStageText(stageLabel, '[data-stage-label-name]', mapName);
    }

    const winnerImageElement = stage.querySelector('[data-stage-winner-image]');
    if (winnerImageElement) {
        winnerImageElement.style.setProperty('--winner-image', winnerImageUrl ? `url("${winnerImageUrl}")` : 'none');
        winnerImageElement.classList.toggle('has-winner', Boolean(winnerImageUrl));
    }

    const stageImageElement = stage.querySelector('[data-stage-map-image]');
    if (stageImageElement) {
        stageImageElement.style.backgroundImage = stageImage ? `url("${stageImage}")` : 'none';
    }

    setGameModeImage(stage.dataset.stageIndex, gameModeImage);

    stage.dataset.completed = String(isCompleted);
}

function setStagesData(round = {}) {
    const stagesScene = document.querySelector('.stages-scene');
    const stagesGrid = document.querySelector('[data-stages-grid]');
    if (!stagesScene || !stagesGrid) return;

    const games = Array.isArray(round?.games) ? round.games : [];
    const stageElements = Array.from(stagesGrid.querySelectorAll(':scope > [data-stage]'));
    const gameCount = games.length || 5;
    const formatClass = gameCount <= 3 ? 'bo3' : 'bo5';
    const teamAScore = round?.teamA?.score || 0;
    const teamBScore = round?.teamB?.score || 0;
    const matchIsOver = teamAScore >= 3 || teamBScore >= 3;
    const isBo5 = games.length >= 5;

    stagesGrid.classList.remove('bo3', 'bo5');
    stagesGrid.classList.add(formatClass);
    stagesScene.style.setProperty('--stage-accent', round?.teamA?.color || '#78d6c5');

    stageElements.forEach((stage, index) => {
        const game = games[index];
        const showSetOver = matchIsOver && isBo5 && !isStageGamePlayed(game);
        stage.style.display = game || showSetOver ? '' : 'none';
        if (showSetOver) {
            setStageData(stage, {}, round);
            setStageText(stage, '[data-stage-name]', SET_OVER_LABEL);
            const stageLabel = document.querySelector(`[data-stage-label="${stage.dataset.stageIndex}"]`);
            if (stageLabel) setStageText(stageLabel, '[data-stage-label-name]', SET_OVER_LABEL);
            stage.querySelector('[data-stage-map-image]')?.style.setProperty('background-image', `url("${SET_OVER_IMAGE}")`);
        } else if (game) {
            setStageData(stage, game, round);
        } else {
            setGameModeImage(stage.dataset.stageIndex, '');
        }
    });

    const teamA = round?.teamA || {};
    const teamB = round?.teamB || {};
    const teamAName = document.querySelector('#team-a-name-scoreboard');
    const teamBName = document.querySelector('#team-b-name-scoreboard');
    const teamAScoreElement = document.querySelector('[data-stage-score-a]');
    const teamBScoreElement = document.querySelector('[data-stage-score-b]');

    if (teamAName) teamAName.textContent = teamA.name || '';
    if (teamBName) teamBName.textContent = teamB.name || '';
    if (teamAScoreElement) teamAScoreElement.textContent = String(teamA.score ?? 0);
    if (teamBScoreElement) teamBScoreElement.textContent = String(teamB.score ?? 0);
}

if (activeRound && typeof activeRound.on === 'function') {
    activeRound.on('change', setStagesData);
}

if (assetPaths && typeof assetPaths.on === 'function') {
    assetPaths.on('change', () => setStagesData(activeRound?.value || {}));
}
