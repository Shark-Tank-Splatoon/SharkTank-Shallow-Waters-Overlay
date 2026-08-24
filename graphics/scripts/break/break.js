function toggleExpandBackground(expanded) {
	const pondBackground = document.querySelector('.pond-background');

	if (pondBackground) {
		gsap.set(pondBackground, { width: expanded ? '100%' : '1920px' });
	}
}

function showInfoBar() {}

function hideInfoBar() {}

function setInfoSwitchAnim() {}

function getRoundFormatLabel(round) {
	const gameCount = Array.isArray(round.games) ? round.games.length : 0;
	if (gameCount === 0) return '';

	switch (round.match?.type) {
		case 'PLAY_ALL':
			return `PA${gameCount}`;
		case 'BEST_OF':
			return `Bo${gameCount}`;
		default:
			return '';
	}
}

function setText(selector, value) {
	const element = document.querySelector(selector);
	if (element) element.textContent = value;
}

function getPlayerNames(team) {
	if (!Array.isArray(team.players)) return '';

	return team.players
		.map(player => player?.inGameName?.name ?? player?.inGameName ?? player?.name ?? '')
		.filter(Boolean)
		.join('\n');
}

function setTeamLogo(selector, team){
	const element = document.querySelector(selector);
	if (!element) return;
	element.style.backgroundImage = team.showLogo && team.logoUrl ? `url("${team.logoUrl}")` : 'none';
}

function setActiveRoundData(round) {
	if (!round) return;

	const teamsScene = document.querySelector('.teams-scene');
	const teamsRoster = document.querySelector('.teams-roster');
	if (!teamsScene || !teamsRoster) return;

	const teamA = round.teamA || {};
	const teamB = round.teamB || {};
	const match = round.match || {};
	const gameCount = Array.isArray(round.games) ? round.games.length : 0;

	teamsScene.dataset.matchName = match.name || '';
	teamsScene.dataset.matchType = match.type || '';
	teamsScene.dataset.matchCompleted = String(Boolean(match.isCompleted));
	teamsScene.dataset.games = String(gameCount);
	teamsRoster.dataset.teamAName = teamA.name || '';
	teamsRoster.dataset.teamAScore = String(teamA.score ?? 0);
	teamsRoster.dataset.teamBName = teamB.name || '';
	teamsRoster.dataset.teamBScore = String(teamB.score ?? 0);

	setText('[data-active-round-match]', match.name || '');
	setText('[data-active-round-team-a]', teamA.name || '');
	setText('[data-active-round-team-a-roster]', getPlayerNames(teamA));
	setText('[data-active-round-team-b]', teamB.name || '');
	setText('[data-active-round-team-b-roster]', getPlayerNames(teamB));
	setText('[data-active-round-score-a]', String(teamA.score ?? 0));
	setText('[data-active-round-score-b]', String(teamB.score ?? 0));
	setText('[data-active-round-games]', getRoundFormatLabel(round));

	setTeamLogo('[data-active-round-team-a-logo]', teamA);
	setTeamLogo('[data-active-round-team-b-logo]', teamB);

	teamsScene.style.setProperty('--team-a-color', teamA.color || 'transparent');
	teamsScene.style.setProperty('--team-b-color', teamB.color || 'transparent');
}

activeRound.on('change', setActiveRoundData);
