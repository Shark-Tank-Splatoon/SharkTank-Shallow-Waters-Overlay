let funFactVisibilityRequest = 0;

function setFunFactVisibility(visible) {
    const funFact = document.querySelector('[data-fun-fact]');
    if (!funFact) return;

    funFact.setAttribute('aria-hidden', String(!visible));
    const request = ++funFactVisibilityRequest;
    funFact.style.transition = '';
    funFact.style.opacity = '';
    funFact.style.transform = '';

    if (!visible) {
        funFact.classList.remove('is-visible');
        window.setTimeout(() => {
            if (request !== funFactVisibilityRequest) return;
            funFact.style.transition = 'none';
            funFact.style.opacity = '0';
            funFact.style.transform = 'translateY(100%)';
        }, 600);
        return;
    }

    funFact.classList.remove('is-visible');
    window.setTimeout(() => {
        if (request !== funFactVisibilityRequest) return;
        void funFact.offsetWidth;
        funFact.classList.add('is-visible');
        window.setTimeout(() => {
            if (request !== funFactVisibilityRequest) return;
            funFact.style.transition = 'none';
            funFact.style.opacity = '1';
            funFact.style.transform = 'translateY(0)';
        }, 600);
    }, 0);
}

function setFunFactData(data = {}) {
    const funFactData = data && typeof data === 'object' ? data : {};
    const textElement = document.querySelector('[data-fun-fact-text]');
    if (textElement) textElement.textContent = funFactData.text || '';
    setFunFactVisibility(funFactData.isVisible === true);
}

function initializeFunFactData(attempt = 0) {
    if (FunFactData.value !== undefined) {
        setFunFactData(FunFactData.value);
        return;
    }

    if (attempt < 50) {
        window.setTimeout(() => initializeFunFactData(attempt + 1), 100);
    }
}

if (FunFactData && typeof FunFactData.on === 'function') {
    FunFactData.on('change', setFunFactData);
    initializeFunFactData();
}