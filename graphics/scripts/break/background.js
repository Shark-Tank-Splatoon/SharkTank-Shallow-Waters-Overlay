function toggleExpandBackground(expanded) {
	const pondBackground = document.querySelector('.pond-background');

	if (pondBackground) {
		gsap.set(pondBackground, { width: expanded ? '100%' : '1920px' });
	}
}

function showInfoBar() {}

function hideInfoBar() {}

function setInfoSwitchAnim() {}
