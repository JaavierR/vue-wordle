<script setup lang="ts">
import Tile from '@/class/Tile'

const theWord = 'cat'
const currentRowIndex = ref(0)
const currentRow = computed(() => board.value[currentRowIndex.value])
const currentGuess = computed(() =>
    currentRow.value.map((tile) => tile.letter).join('')
)

const board = ref(
    Array.from({ length: 3 }, () => {
        return Array.from({ length: 3 }, () => new Tile())
    })
)

const onKeyPress = (e: KeyboardEvent) => onKey(e.key)

const fillTile = (letter: string) => {
    for (const tile of currentRow.value) {
        if (!tile.letter) {
            tile.fill(letter)
            break
        }
    }
}

const submitGuess = () => {
    let guess = currentGuess.value

    if (guess.length < theWord.length) return

    if (guess === theWord) {
        alert('You win')
    } else {
        alert('NOPE')
        currentRowIndex.value++
    }
}

const onKey = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) {
        fillTile(key)
    } else if (key === 'Backspace') {
        console.log('remove')
    } else if (key === 'Enter') {
        submitGuess()
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
