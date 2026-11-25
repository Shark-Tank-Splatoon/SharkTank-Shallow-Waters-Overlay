/*
Applies the values from the "Look & Feel" dashboard panel to the page as CSS variables.
The defaults live in styles/theme.css; this script only overrides the ones the team has changed.
*/

(function () {
    const root = document.documentElement;
    const ThemeOverrides = nodecg.Replicant('ThemeOverrides', {defaultValue: {}});

    // Only accept values the panel can produce: variable names like "text-light", values like "#aabbcc" or "55px".
    const NAME_PATTERN = /^[a-z0-9-]+$/;
    const VALUE_PATTERN = /^(#[0-9a-f]{3,8}|\d+(\.\d+)?px)$/i;

    let appliedNames = [];

    ThemeOverrides.on('change', newValue => {
        const overrides = newValue && typeof newValue === 'object' ? newValue : {};

        // Remove overrides that were reset, so the default from theme.css applies again.
        appliedNames.forEach(name => {
            if (!(name in overrides)) root.style.removeProperty(`--${name}`);
        });

        appliedNames = [];
        Object.entries(overrides).forEach(([name, value]) => {
            if (!NAME_PATTERN.test(name) || typeof value !== 'string' || !VALUE_PATTERN.test(value)) return;
            root.style.setProperty(`--${name}`, value);
            appliedNames.push(name);
        });
    });
})();
