function toggleExpandBackground(expanded) {
	const pondBackground = document.querySelector('.pond-background');

	if (pondBackground) {
		gsap.set(pondBackground, { width: expanded ? '100%' : '1920px' });
	}
}

function showInfoBar() {}

function hideInfoBar() {}

function setInfoSwitchAnim() {}

function getRoundFormatLabel(round = {}) {
	const gameCount = Array.isArray(round?.games) ? round.games.length : 0;
	if (gameCount === 0) return '';

	switch (round?.match?.type) {
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

function getCommentatorName(value) {
	if (!value) return '';
	if (typeof value !== 'object') return String(value);

	const name = value.name || value.displayName || value.realName || value.handle || value.value || '';
	const social = value.twitter || value.social || value.socialMedia || '';
	if (name && social) return `${name} (${social})`;
	return name || social;
}

function getCommentatorNames(value) {
	if (Array.isArray(value)) {
		return value.map(getCommentatorName).filter(Boolean).join(' & ');
	}

	if (value && typeof value === 'object') {
		return Object.values(value)
			.map(getCommentatorName)
			.filter(Boolean)
			.join(' & ');
	}

	return getCommentatorName(value);
}

function setCommentatorNames(value) {
	const names = getCommentatorNames(value);
	document.querySelectorAll('[data-commentator-names]').forEach(element => {
		const track = element.querySelector('.commentator-names-track');
		if (track) track.textContent = names ? `${names}     ${names}` : '';
		else element.textContent = names;
	});
}

function getPlayerNames(team = {}) {
	if (!Array.isArray(team?.players)) return '';

	return team.players
		.map(player => player?.inGameName?.name ?? player?.inGameName ?? player?.name ?? '')
		.filter(Boolean)
		.join('\n');
}

function setTeamLogo(selector, team = {}) {
	const element = document.querySelector(selector);
	if (!element) return;

	const logoUrl = team?.showLogo && team?.logoUrl ? team.logoUrl : '';
	element.style.backgroundImage = logoUrl ? `url("${logoUrl}")` : 'none';
}

function setActiveRoundData(round) {
	if (!round) return;

	const teamsScene = document.querySelector('.teams-scene');
	const teamsRoster = document.querySelector('.teams-roster');
	if (!teamsScene || !teamsRoster) return;

	const teamA = round?.teamA || {};
	const teamB = round?.teamB || {};
	const match = round?.match || {};
	const gameCount = Array.isArray(round?.games) ? round.games.length : 0;

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

if (activeRound && typeof activeRound.on === 'function') {
	activeRound.on('change', setActiveRoundData);
}

if (casters && typeof casters.on === 'function') {
	casters.on('change', setCommentatorNames);
	setCommentatorNames(casters.value);
}
