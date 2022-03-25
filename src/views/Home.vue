<script setup lang="ts">
import Tile from '@/class/Tile'
import words from '@/data/words'

const theWord = 'Cat'
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
    Array.from({ length: 3 }, () => {
        return Array.from({ length: 3 }, (_, index) => new Tile(index))
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
    let guess = currentGuess.value

    if (guess.length < theWord.length) return

    if (!words.includes(guess)) {
        errors.value = true
        return showMessage('Invalid word...')
    }

    Tile.updateStatusesForRow(currentRow.value, theWord)

    if (guess === theWord) {
        state.value = 'completed'
        return showMessage('You win')
    }

    if (!remainingGuesses.value) {
        state.value = 'completed'
        return showMessage(theWord, 0)
    }

    currentRowIndex.value++
    return showMessage('NOPE')
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
</template>
