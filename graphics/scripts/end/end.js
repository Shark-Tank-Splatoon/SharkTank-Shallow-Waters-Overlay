function getEndCommentatorName(commentator) {
    if (!commentator || typeof commentator !== 'object') return '';
    return commentator.name || '';
}

function getEndCommentatorPfp(commentator) {
    if (!commentator || typeof commentator !== 'object') return '';
    return commentator.pfpUrl || '';
}

function getEndCommentatorSocial(commentator) {
    if (!commentator || typeof commentator !== 'object') return '';
    return commentator.socialMedia || commentator.social || commentator.twitter || '';
}

function setBackgroundImage(element, imageUrl) {
    if (!element) return;

    if (!imageUrl) {
        element.style.removeProperty('background-image');
        return;
    }

    const escapedUrl = String(imageUrl).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    element.style.setProperty('background-image', `url("${escapedUrl}")`);
}

function setEndCommentators(value) {
    const commentators = Array.isArray(value) ? value.slice(0, 4) : [];

    document.querySelectorAll('[data-end-commentator]').forEach(element => {
        const index = Number(element.dataset.endCommentator);
        const commentator = commentators[index] || {};
        const name = getEndCommentatorName(commentator);
        const social = getEndCommentatorSocial(commentator);
        const pfp = getEndCommentatorPfp(commentator);
        const nameElement = element.querySelector('[data-end-commentator-name]');
        const socialElement = element.querySelector('[data-end-commentator-social]');
        const pfpElement = element.querySelector('[data-end-commentator-pfp]');

        if (nameElement) nameElement.textContent = name;
        if (socialElement) socialElement.textContent = social;
        setBackgroundImage(pfpElement, pfp);
        element.hidden = !name && !social && !pfp;
    });
}

if (EndCommentators && typeof EndCommentators.on === 'function') {
    EndCommentators.on('change', setEndCommentators);
    setEndCommentators(EndCommentators.value);
}

function setEndWinnerTeam(value) {
    const element = document.querySelector('[data-end-winner-team]');
    if (element) element.textContent = typeof value === 'string' ? value : '';
}

if (EndWinnerTeam && typeof EndWinnerTeam.on === 'function') {
    EndWinnerTeam.on('change', setEndWinnerTeam);
    setEndWinnerTeam(EndWinnerTeam.value);
}
