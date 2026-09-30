const SET_OVER_IMAGE = 'img/8_extra/setover.png';
const SET_OVER_LABEL = 'Set is Over!';
const COUNTER_PICK_IMAGE = 'img/4_bo3bo5/bo5/counter%20pick%20image.png';
const COUNTER_PICK_LABEL = 'Counterpick!';

function getStageValue(value, fallback = '') {
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (value && typeof value === 'object') {
        return value.name || value.label || value.title || fallback;
    }
    return fallback;
}

function isUnknownStageName(value) {
    return /^(unknown|no)\s+(map|stage)$/i.test(String(value || '').trim());
}

function getTeamScore(team = {}) {
    const score = team?.score ?? team?.wins ?? team?.matchScore;
    return Number(getStageValue(score, '0')) || 0;
}

function getBestOfCount(round, games) {
    const match = round?.match || {};
    const configuredBestOf = Number(
        match.bestOf ?? match.bestOfCount ?? match.gamesCount ?? round?.bestOf
    );
    if (configuredBestOf > 0) return configuredBestOf;

    const type = String(match.type || match.format || '').toUpperCase();
    if (type.includes('BO5') || type.includes('BEST_OF_5')) return 5;
    if (type.includes('BO3') || type.includes('BEST_OF_3')) return 3;

    return games.length;
}

function isStageGamePlayed(game) {
    if (!game || typeof game !== 'object') return false;
    if (game.isCompleted === true) return true;

    const winner = String(game.winner || game.winningTeam || game.winnerTeam || '').toLowerCase();
    return winner !== '' && winner !== 'none' && winner !== 'no_winner';
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

    if (winner && typeof winner === 'object') {
        const winnerId = getStageValue(winner.id).toLowerCase();
        const winnerName = getStageValue(winner.name).toLowerCase();
        const teamAValues = [getStageValue(teamA.id), getStageValue(teamA.name)].map(value => value.toLowerCase());
        const teamBValues = [getStageValue(teamB.id), getStageValue(teamB.name)].map(value => value.toLowerCase());
        if ([winnerId, winnerName].some(value => value && teamAValues.includes(value))) return teamA;
        if ([winnerId, winnerName].some(value => value && teamBValues.includes(value))) return teamB;
        return winner;
    }

    const winnerValue = getStageValue(winner).toLowerCase();
    if (winnerValue === 'alpha') return teamA;
    if (winnerValue === 'bravo') return teamB;
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
    const mapNameValue = getStageValue(map, getStageValue(game?.mapName || game?.stageName, ''));
    const mapName = mapNameValue && !isUnknownStageName(mapNameValue)
        ? mapNameValue
        : COUNTER_PICK_LABEL;
    const stageImageKey = getStageImageKey(game);
    const winnerTeam = getStageWinnerTeam(game, round);
    const isCompleted = Boolean(winnerTeam);
    const winnerImage = winnerTeam?.logoUrl || winnerTeam?.imageUrl || winnerTeam?.logo || '';
    const winnerImageUrl = winnerImage || (isCompleted ? '../../img/2_commbreak/pibble%20(MANDATORY).jpg' : '');
    const stageImage = assetPaths?.value?.stageImages?.[stageImageKey] || COUNTER_PICK_IMAGE;

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
    const teamAScore = getTeamScore(round?.teamA);
    const teamBScore = getTeamScore(round?.teamB);
    const matchIsOver = teamAScore >= 3 || teamBScore >= 3;
    const isBo5 = getBestOfCount(round, games) >= 5;

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
        }
    });

    const teamA = round?.teamA || {};
    const teamB = round?.teamB || {};
    const teamAName = document.querySelector('#team-a-name-scoreboard');
    const teamBName = document.querySelector('#team-b-name-scoreboard');
    const teamAScoreElement = document.querySelector('[data-stage-score-a]');
    const teamBScoreElement = document.querySelector('[data-stage-score-b]');

    if (teamAName) teamAName.textContent = getStageValue(teamA.name);
    if (teamBName) teamBName.textContent = getStageValue(teamB.name);
    if (teamAScoreElement) teamAScoreElement.textContent = getStageValue(teamA.score, '0');
    if (teamBScoreElement) teamBScoreElement.textContent = getStageValue(teamB.score, '0');
}

if (activeRound && typeof activeRound.on === 'function') {
    activeRound.on('change', setStagesData);
}

if (assetPaths && typeof assetPaths.on === 'function') {
    assetPaths.on('change', () => setStagesData(activeRound?.value || {}));
}
