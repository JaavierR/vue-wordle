<script setup lang="ts">
import Tile from '@/class/Tile'

let currentTileIndex = 0
const currentRowIndex = ref(0)
const currentRow = computed(() => board.value[currentRowIndex.value])

const board = ref(
    Array.from({ length: 3 }, () => {
        return Array.from({ length: 3 }, () => new Tile())
    })
)

const onKeyPress = (e: KeyboardEvent) => onKey(e.key)

const fillTile = (letter: string) => {
    // board.value[currentRowIndex.value][currentTileIndex] = letter
    for (const tile of currentRow.value) {
        if (!tile.letter) {
            tile.fill(letter)
            break
        }
    }

    if (currentTileIndex === board.value[0].length - 1) {
        currentRowIndex.value++
        currentTileIndex = 0
    } else {
        currentTileIndex++
    }
}

const onKey = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) {
        fillTile(key)
    } else if (key === 'Backspace') {
        console.log('remove')
    }
}

window.addEventListener('keyup', onKeyPress)

onBeforeUnmount(() => window.removeEventListener('keyup', onKeyPress))
</script>

<template>
    <div id="game">
        <template v-for="row in board" :key="row">
            <div class="row">
                <template v-for="tile in row" :key="tile">
                    <div class="tile">{{ tile.letter }}</div>
                </template>
            </div>
        </template>
    </div>
</template>
