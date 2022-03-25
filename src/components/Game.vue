<script setup lang="ts">
import type Tile from '@/class/Tile'

const props =
    defineProps<{ board: Tile[][]; currentRowIndex: number; errors: boolean }>()
</script>

<template>
    <div id="game">
        <template v-for="(row, index) in board" :key="row">
            <div
                class="row"
                :class="{
                    current: currentRowIndex === index,
                    invalid: currentRowIndex === index && errors,
                }"
            >
                <template v-for="tile in row" :key="tile">
                    <div class="tile" :class="tile.status">
                        {{ tile.letter }}
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
