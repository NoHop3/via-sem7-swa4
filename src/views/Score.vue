<template>
    <div>
        <div>
            <h2 class="center">Your Top 3 Scores:</h2>
            <div v-for="game in userTopScores" :key="game.id" class="textColor3">
                Game {{ game.id }} - Score: {{ game.score }}
            </div>
        </div>
        <h2 class="center">Top 10 Scores:</h2>
        <div>
            <div v-for="game in topScores" :key="game.id" class="textColor3">
                Player {{ game.user }} - {{ game.score }} points
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { computed } from 'vue';
import { getAllGames } from '../services/game.service';
import { store } from '@/store/store';

export default {
    data() {
        return {
            model: store
        }
    },
    setup() {
        const userTopScores = computed(() => {
            return store.games
                .filter(game => game.completed && game.user === store.user.userId)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);
        });

        const topScores = computed(() => {
            return store.games
                .filter(game => game.completed)
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
        });

        return { userTopScores, topScores };
    },
    mounted() {
        getAllGames(store.user.token).then((result) => {
            if (result !== undefined) store.games = result;
        });
    }
};
</script>

<style scoped>
/* Your CSS here */
</style>