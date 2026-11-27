import { createApp } from 'vue';
import '@iplsplatoon/vue-components/style.css';
import FunFactButtons from './FunFactButtons.vue';
import SwitchToggle from './SwitchToggle.vue';
import '../sharktankdashboard.js';

createApp(FunFactButtons).mount('#fun-fact-buttons');

createApp(SwitchToggle).mount('#homeland-toggle')