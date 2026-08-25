function getStageValue(value, fallback = '') {
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (value && typeof value === 'object') {
        return value.name || value.label || value.title || fallback;
    }
    return fallback;
}

function getStageMap(game) {
    return game?.map || game?.stage || {};
}

function getStageImageKey(game) {
    const map = getStageMap(game);
    if (typeof map === 'string' || typeof map === 'number') return String(map);
    if (map && typeof map === 'object') {
        return map.key || map.id || map.name || '';
    }
    return '';
}

function getStageWinner(game) {
    return getStageValue(
        game?.winner || game?.winningTeam || game?.winnerTeam,
        game?.isCompleted ? '' : ''
    );
}

function getStageWinnerTeam(game, round) {
    const teamA = round?.teamA || {};
    const teamB = round?.teamB || {};
    const winner = game?.winner || game?.winningTeam || game?.winnerTeam;

    if (winner && typeof winner === 'object') return winner;

    const winnerValue = getStageValue(winner).toLowerCase();
    if (winnerValue && [teamA.id, teamA.name].some(value => getStageValue(value).toLowerCase() === winnerValue)) {
        return teamA;
    }
    if (winnerValue && [teamB.id, teamB.name].some(value => getStageValue(value).toLowerCase() === winnerValue)) {
        return teamB;
    }
    if (game?.winnerSide === 'A' || game?.winningSide === 'A') return teamA;
    if (game?.winnerSide === 'B' || game?.winningSide === 'B') return teamB;

    const teamAScore = Number(game?.teamA?.score ?? game?.scoreA);
    const teamBScore = Number(game?.teamB?.score ?? game?.scoreB);
    if (game?.isCompleted && teamAScore > teamBScore) return teamA;
    if (game?.isCompleted && teamBScore > teamAScore) return teamB;
    return null;
}

function setStageText(stage, selector, value) {
    const element = stage.querySelector(selector);
    if (element) element.textContent = value;
}

function setStageData(stage, game, round) {
    const map = getStageMap(game);
    const mapName = getStageValue(map, getStageValue(game?.mapName || game?.stageName, 'Unknown map'));
    const stageImageKey = getStageImageKey(game);
    const mode = getStageValue(game?.mode || game?.gameMode, '');
    const winnerTeam = getStageWinnerTeam(game, round);
    const winnerImage = winnerTeam?.logoUrl || winnerTeam?.imageUrl || winnerTeam?.logo || '';
    const stageImage = assetPaths.value?.stageImages?.[stageImageKey] || '';

    setStageText(stage, '[data-stage-name]', mapName);
    setStageText(stage, '[data-stage-mode]', mode);

    const stageInfo = stage.querySelector('.stage-info');
    if (stageInfo) stageInfo.classList.toggle('without-mode', !mode);

    const winnerImageElement = stage.querySelector('[data-stage-winner-image]');
    if (winnerImageElement) {
        winnerImageElement.style.backgroundImage = winnerImage ? `url("${winnerImage}")` : 'none';
    }

    const stageImageElement = stage.querySelector('[data-stage-map-image]');
    if (stageImageElement) {
        stageImageElement.style.backgroundImage = stageImage ? `url("${stageImage}")` : 'none';
    }

    stage.dataset.completed = String(Boolean(game?.isCompleted));
}

function setStagesData(round) {
    const stagesScene = document.querySelector('.stages-scene');
    const stagesGrid = document.querySelector('[data-stages-grid]');
    if (!stagesScene || !stagesGrid) return;

    const games = Array.isArray(round?.games) ? round.games : [];
    const stageElements = Array.from(stagesGrid.querySelectorAll(':scope > [data-stage]'));
    const gameCount = games.length || 5;
    const formatClass = gameCount <= 3 ? 'bo3' : 'bo5';

    stagesGrid.classList.remove('bo3', 'bo5');
    stagesGrid.classList.add(formatClass);
    stagesScene.style.setProperty('--stage-accent', round?.teamA?.color || '#78d6c5');

    stageElements.forEach((stage, index) => {
        const game = games[index];
        stage.style.display = game ? '' : 'none';
        if (game) setStageData(stage, game, round);
    });

    const teamA = round?.teamA || {};
    const teamB = round?.teamB || {};
    const teamAName = document.querySelector('#team-a-name-scoreboard');
    const teamBName = document.querySelector('#team-b-name-scoreboard');
    const teamAScore = document.querySelector('[data-stage-score-a]');
    const teamBScore = document.querySelector('[data-stage-score-b]');

    if (teamAName) teamAName.textContent = getStageValue(teamA.name);
    if (teamBName) teamBName.textContent = getStageValue(teamB.name);
    if (teamAScore) teamAScore.textContent = getStageValue(teamA.score, '0');
    if (teamBScore) teamBScore.textContent = getStageValue(teamB.score, '0');
}

activeRound.on('change', setStagesData);
assetPaths.on('change', () => setStagesData(activeRound.value));
