<script setup>
import { ref, computed } from 'vue';
import { IplSmallToggle } from '@iplsplatoon/vue-components';

const homelandEdition = nodecg.Replicant('HomelandEnabled', {
    defaultValue: { isVisible: false }
});

const data = ref({ isVisible: false});
homelandEdition.on('change', (newValue) => {
    data.value = { ...newValue};
})

const isVisible = computed({
    get: () => data.value.isVisible,
    set: (isVisible) => {
        homelandEdition.value = {
            ...(homelandEdition.value ?? {}),
            isVisible
        };
    }
});
</script>

<template>
    <div class="mode-switch">
        <ipl-small-toggle
            v-model="isVisible"
        >
            Homeland Edition<br>
            <small>Turn on and off the Homeland edition Icon</small>
        </ipl-small-toggle>
    </div>
</template>