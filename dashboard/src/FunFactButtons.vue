<script setup>
import { ref, computed } from 'vue';
import { IplButton, IplTextarea } from '@iplsplatoon/vue-components';

const funFact = nodecg.Replicant('FunFactData', {
    defaultValue: { text: '', isVisible: false }
});

const data = ref({ text: '', isVisible: false });
funFact.on('change', (newValue) => {
    data.value = { ...newValue };
});

const isVisible = computed(() => data.value.isVisible);

const funFactText = computed({
    get: () => data.value.text,
    set: (text) => {
        funFact.value = { ...funFact.value, text };
    }
});

function setVisible(isVisible) {
    funFact.value = {
        ...(funFact.value ?? { text: '' }),
        isVisible
    };
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
async function funFactTimer(){
    setVisible(true);
    await sleep(10_000);
    setVisible(false);
    }

</script>

<template>
    <div class="fun-fact-switch">
        <ipl-textarea
            v-model="funFactText"
            name="funFactText"
            placeholder="Did you know..."
            label="Text"
            :disabled="isVisible"
        />
        <IplButton
            label="Show for 10 seconds"
            async
            @click="funFactTimer"
        />
    </div>
</template>

<style scoped>
.fun-fact-switch {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>