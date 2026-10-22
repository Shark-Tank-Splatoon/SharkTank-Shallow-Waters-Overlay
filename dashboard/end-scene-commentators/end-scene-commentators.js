const EndCommentators = nodecg.Replicant('EndCommentators', {
    defaultValue: [
        {name: '', socialMedia: '', pfpUrl: ''},
        {name: '', socialMedia: '', pfpUrl: ''},
        {name: '', socialMedia: '', pfpUrl: ''},
        {name: '', socialMedia: '', pfpUrl: ''}
    ]
});
const endCommentatorNameInputs = document.querySelectorAll('[data-end-commentator-name]');
const endCommentatorSocialInputs = document.querySelectorAll('[data-end-commentator-social]');
const endCommentatorPfpInputs = document.querySelectorAll('[data-end-commentator-pfp]');
const EndWinnerTeam = nodecg.Replicant('EndWinnerTeam', {defaultValue: ''});
const endWinnerTeamInput = document.querySelector('[data-end-winner-team]');

function getEndCommentators() {
    const existing = Array.isArray(EndCommentators.value) ? EndCommentators.value : [];
    return Array.from({length: 4}, (_, index) => ({
        name: endCommentatorNameInputs[index]?.value ?? existing[index]?.name ?? '',
        socialMedia: endCommentatorSocialInputs[index]?.value ?? existing[index]?.socialMedia ?? '',
        pfpUrl: endCommentatorPfpInputs[index]?.value ?? existing[index]?.pfpUrl ?? ''
    }));
}

function updateEndCommentators() {
    EndCommentators.value = getEndCommentators();
}

function updateEndCommentatorControls(value = []) {
    const commentators = Array.isArray(value) ? value : [];
    endCommentatorNameInputs.forEach((input, index) => {
        input.value = commentators[index]?.name || '';
    });
    endCommentatorSocialInputs.forEach((input, index) => {
        input.value = commentators[index]?.socialMedia || commentators[index]?.social || commentators[index]?.twitter || '';
    });
    endCommentatorPfpInputs.forEach((input, index) => {
        input.value = commentators[index]?.pfpUrl || '';
    });
}

endCommentatorNameInputs.forEach(input => input.addEventListener('input', updateEndCommentators));
endCommentatorSocialInputs.forEach(input => input.addEventListener('input', updateEndCommentators));
endCommentatorPfpInputs.forEach(input => input.addEventListener('input', updateEndCommentators));

if (EndCommentators && typeof EndCommentators.on === 'function') {
    EndCommentators.on('change', updateEndCommentatorControls);
    updateEndCommentatorControls(EndCommentators.value);
}

if (endWinnerTeamInput) {
    endWinnerTeamInput.addEventListener('input', () => {
        EndWinnerTeam.value = endWinnerTeamInput.value;
    });
}

if (EndWinnerTeam && typeof EndWinnerTeam.on === 'function') {
    EndWinnerTeam.on('change', value => {
        if (endWinnerTeamInput) endWinnerTeamInput.value = value || '';
    });
    if (endWinnerTeamInput) endWinnerTeamInput.value = EndWinnerTeam.value || '';
}
