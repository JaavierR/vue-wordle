<script setup lang="ts">
import Tile from '@/class/Tile'

const theWord = 'cat'
const state = ref('active')
const message = ref('')
const currentRowIndex = ref(0)
const currentRow = computed(() => board.value[currentRowIndex.value])
const currentGuess = computed(() =>
    currentRow.value.map((tile) => tile.letter).join('')
)

const remainingGuesses = computed(
    () => board.value.length - currentRowIndex.value - 1
)

const board = ref(
    Array.from({ length: 3 }, () => {
        return Array.from({ length: 3 }, () => new Tile())
    })
)

const showMessage = (msg: string, time = 1000) => {
    message.value = msg
    if (time > 0) {
        setTimeout(() => {
            message.value = ''
        }, time)
    }
}

const onKeyPress = (e: KeyboardEvent) => onKey(e.key)

const fillTile = (letter: string) => {
    for (const tile of currentRow.value) {
        if (!tile.letter) {
            tile.fill(letter)
            break
        }
    }
}

const emptyTile = () => {
    for (const tile of [...currentRow.value].reverse()) {
        if (tile.letter) {
            tile.empty()
            break
        }
    }
}

const submitGuess = () => {
    let guess = currentGuess.value

    if (guess.length < theWord.length) return

    for (const tile of currentRow.value) {
        tile.updateStatus(currentGuess.value, theWord)
    }

    if (guess === theWord) {
        state.value = 'completed'
        return showMessage('You win')
    }

    if (!remainingGuesses.value) {
        state.value = 'completed'
        return showMessage('Game over. You lose')
    }

    currentRowIndex.value++
    return showMessage('NOPE')
}

const onKey = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) {
        fillTile(key)
    } else if (key === 'Backspace') {
        emptyTile()
    } else if (key === 'Enter') {
        submitGuess()
    }
}

window.addEventListener('keyup', onKeyPress)

onBeforeUnmount(() => window.removeEventListener('keyup', onKeyPress))
</script>

<template>
    <main>
        <div id="game">
            <template v-for="(row, index) in board" :key="row">
                <div
                    class="row"
                    :class="{
                        current: currentRowIndex === index,
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
        <output>
            {{ message }}
        </output>
    </main>
</template>
