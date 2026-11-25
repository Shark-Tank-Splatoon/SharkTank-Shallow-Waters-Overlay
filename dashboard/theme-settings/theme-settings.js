/*
JS for the "Look & Feel" dashboard panel.

Each entry in FIELDS becomes a colour picker or a size field. The chosen values are stored in the
"ThemeOverrides" replicant, and graphics/scripts/theme.js applies them to the graphics as CSS variables.

To add a new editable value, add an entry here and the same name + default to graphics/styles/theme.css.
  name:    the CSS variable name without the leading "--"
  type:    "color" or "size" (size is in pixels)
  default: must match the default in graphics/styles/theme.css
*/

const FIELDS = [
    {
        title: 'Break, starting-soon & end screens: text',
        items: [
            {name: 'text-light', type: 'color', default: '#ffffff', label: 'Main text colour', hint: 'Team names, commentator names, stage labels, winner name'},
            {name: 'text-dark', type: 'color', default: '#000000', label: 'Dark text colour', hint: 'Scoreboard and match info, end-screen commentator names'},
            {name: 'text-card', type: 'color', default: '#f3ecee', label: 'Commentator card text', hint: 'Commentator card and next match text on the break screen'},
            {name: 'stage-info-text', type: 'color', default: '#12343d', label: 'Stage info text', hint: 'Map and mode info under each stage'}
        ]
    },
    {
        title: 'Break & end screens: outlines around text',
        items: [
            {name: 'stroke-main', type: 'color', default: '#051b50', label: 'Main outline colour', hint: 'Team and commentator names, winner name'},
            {name: 'stroke-card', type: 'color', default: '#0946d5', label: 'Commentator card outline', hint: 'Commentator card and next match text'},
            {name: 'stroke-stage-label', type: 'color', default: '#0c1e51', label: 'Stage label outline', hint: 'Labels on the stage list'},
            {name: 'stroke-light', type: 'color', default: '#ffffff', label: 'End screen light outline', hint: 'Outline around end-screen commentator names and socials'}
        ]
    },
    {
        title: 'Backgrounds',
        items: [
            {name: 'commentator-pfp-bg', type: 'color', default: '#b7e6f5', label: 'Commentator picture background', hint: 'Shows behind commentator profile pictures'},
            {name: 'end-bg', type: 'color', default: '#03135b', label: 'End screen background', hint: ''}
        ]
    },
    {
        title: 'Rosters screen',
        items: [
            {name: 'roster-pill-fill', type: 'color', default: '#22baf2', label: 'Team name bars & commentator bar', hint: 'Main colour of the water-style bars'},
            {name: 'roster-pill-line', type: 'color', default: '#5fd9f8', label: 'Water lines on the bars', hint: 'The lighter swirl pattern'},
            {name: 'roster-ring', type: 'color', default: '#aae8f5', label: 'Bar outline', hint: 'Light outline around the bars'},
            {name: 'roster-card-fill', type: 'color', default: '#022e87', label: 'Roster card background', hint: 'Panel the player names sit on'},
            {name: 'roster-card-edge', type: 'color', default: '#001050', label: 'Roster card border', hint: ''},
            {name: 'roster-card-line', type: 'color', default: '#0b468f', label: 'Water lines on the card border', hint: ''},
            {name: 'roster-blob-fill', type: 'color', default: '#f3ecee', label: 'Splash in the middle', hint: 'Behind Bo3 / PA3, also the microphone icon'},
            {name: 'roster-blob-edge', type: 'color', default: '#58caf1', label: 'Splash outline and droplets', hint: ''}
        ]
    },
    {
        title: 'In-game scene: colours',
        items: [
            {name: 'ingame-team-name-color', type: 'color', default: '#000000', label: 'Team name colour', hint: ''},
            {name: 'ingame-commentator-color', type: 'color', default: '#ffffff', label: 'Commentator name colour', hint: ''},
            {name: 'ingame-funfact-color', type: 'color', default: '#ffffff', label: 'Fun fact text colour', hint: ''},
            {name: 'score-stroke-a', type: 'color', default: '#7a520e', label: 'Score outline, team A', hint: ''},
            {name: 'score-stroke-b', type: 'color', default: '#5d96f6', label: 'Score outline, team B', hint: ''}
        ]
    },
    {
        title: 'In-game scene: text sizes (px)',
        items: [
            {name: 'ingame-team-name-size', type: 'size', default: '55px', label: 'Team name size', hint: ''},
            {name: 'ingame-score-size', type: 'size', default: '45px', label: 'Score size', hint: ''},
            {name: 'ingame-commentator-size', type: 'size', default: '50px', label: 'Commentator name size', hint: ''},
            {name: 'ingame-funfact-size', type: 'size', default: '42px', label: 'Fun fact text size', hint: ''}
        ]
    }
];

const ThemeOverrides = nodecg.Replicant('ThemeOverrides', {defaultValue: {}});
const fieldsContainer = document.getElementById('theme-fields');
const resetAllButton = document.getElementById('theme-reset-all');

const controls = {};

function setOverride(name, value) {
    ThemeOverrides.value = {...(ThemeOverrides.value || {}), [name]: value};
}

function clearOverride(name) {
    const next = {...(ThemeOverrides.value || {})};
    delete next[name];
    ThemeOverrides.value = next;
}

function readInputValue(field, input) {
    if (field.type === 'size') {
        const size = Number.parseFloat(input.value);
        return Number.isFinite(size) && size > 0 ? `${size}px` : null;
    }
    return input.value;
}

function buildField(field) {
    const row = document.createElement('div');
    row.className = 'theme-field';

    const id = `theme-field-${field.name}`;

    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = field.label;
    row.appendChild(label);

    if (field.hint) {
        const hint = document.createElement('small');
        hint.textContent = field.hint;
        row.appendChild(hint);
    }

    const inputRow = document.createElement('div');
    inputRow.className = 'theme-input-row';

    const input = document.createElement('input');
    input.id = id;
    if (field.type === 'size') {
        input.type = 'number';
        input.min = '1';
        input.max = '400';
        input.step = '1';
        input.addEventListener('change', () => {
            const value = readInputValue(field, input);
            if (value) setOverride(field.name, value);
        });
    } else {
        input.type = 'color';
        input.addEventListener('input', () => setOverride(field.name, input.value));
    }
    inputRow.appendChild(input);

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'theme-reset';
    reset.textContent = '↺';
    reset.title = `Reset to original (${field.default})`;
    reset.setAttribute('aria-label', `Reset ${field.label} to original`);
    reset.addEventListener('click', () => clearOverride(field.name));
    inputRow.appendChild(reset);

    row.appendChild(inputRow);
    controls[field.name] = {field, input, reset, row};
    return row;
}

FIELDS.forEach(group => {
    const set = document.createElement('fieldset');
    set.className = 'theme-group';

    const legend = document.createElement('legend');
    legend.textContent = group.title;
    set.appendChild(legend);

    group.items.forEach(field => set.appendChild(buildField(field)));
    fieldsContainer.appendChild(set);
});

function showValues(overrides) {
    const current = overrides && typeof overrides === 'object' ? overrides : {};

    Object.values(controls).forEach(({field, input, reset, row}) => {
        const isOverridden = typeof current[field.name] === 'string';
        const value = isOverridden ? current[field.name] : field.default;

        const displayValue = field.type === 'size' ? String(Number.parseFloat(value)) : value;
        if (document.activeElement !== input && input.value !== displayValue) {
            input.value = displayValue;
        }

        row.classList.toggle('is-modified', isOverridden);
        reset.disabled = !isOverridden;
    });
}

resetAllButton.addEventListener('click', () => {
    if (window.confirm('Reset all colours and sizes to the original look?')) {
        ThemeOverrides.value = {};
    }
});

ThemeOverrides.on('change', showValues);
