<script setup lang="ts">
const gameInfo = {
    guessesAllowed: 3,
    wordLength: 3,
}

let currentTileIndex = 0
let currentRowIndex = 0

const board = ref(
    Array.from({ length: gameInfo.guessesAllowed }, () => {
        return Array.from({ length: gameInfo.wordLength }, () => '')
    })
)

const onKeyPress = (e: KeyboardEvent) => onKey(e.key)

const fillTile = (letter: string) => {
    board.value[currentRowIndex][currentTileIndex] = letter
    console.log({ letter, board })

    if (currentTileIndex === gameInfo.wordLength - 1) {
        currentRowIndex++
        currentTileIndex = 0
    } else {
        currentTileIndex++
    }
}

const onKey = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) {
        fillTile(key.toLowerCase())
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
                    <div class="tile">{{ tile }}</div>
                </template>
            </div>
        </template>
    </div>
</template>
