<script setup lang="ts">
import Tile from '@/class/Tile'
import { allWords, theWords, answers } from '@/data/words'

const guessAllowed = 6
const theWord = ref(theWords[Math.floor(Math.random() * theWords.length)])
const state = ref('active')
const errors = ref(false)
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
    Array.from({ length: guessAllowed }, () => {
        return Array.from(
            { length: theWord.value.length },
            (_, index) => new Tile(index)
        )
    })
)

const showMessage = (msg: string, time = 1600) => {
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
    let guess = currentGuess.value.toLowerCase()

    if (guess.length < theWord.value.length) return

    if (!answers.includes(guess)) {
        errors.value = true
        return showMessage('Not in word list')
    }

    Tile.updateStatusesForRow(currentRow.value, theWord.value)

    if (guess === theWord.value) {
        state.value = 'completed'
        return showMessage('Genius')
    }

    if (!remainingGuesses.value) {
        state.value = 'completed'
        return showMessage(theWord.value, 0)
    }

    currentRowIndex.value++
}

const onKey = (key: string) => {
    errors.value = false
    if (state.value === 'completed') return

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
    <div id="game-wrap">
        <Transition>
            <div v-if="message" class="message">
                {{ message }}
            </div>
        </Transition>
        <main>
            <Game
                :board="board"
                :current-row-index="currentRowIndex"
                :errors="errors"
            />

            <Keyboard :board="board" @@key-pressed="onKey" />
        </main>
    </div>
</template>
