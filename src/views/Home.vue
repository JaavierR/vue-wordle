<script setup lang="ts">
import Tile from '@/class/Tile'
import words from '@/data/words'

const theWord = 'cat'
const state = ref('active')
const errors = ref(false)
const message = ref('')
const currentRowIndex = ref(0)
const currentRow = computed(() => board.value[currentRowIndex.value])
const currentGuess = computed(() =>
    currentRow.value.map((tile) => tile.letter).join('')
)
const letters = ref([
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['Enter', ...'ZXCVBNM'.split(''), 'Backspace'],
])

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
        return showMessage('Game over. You lose')
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

const matchingTileForKey = (key: string) =>
    board.value
        .flat()
        .filter((tile) => tile.status)
        .sort((_t1: Tile, t2: Tile) => (t2.status === 'correct' ? 1 : 0))
        .find((tile) => tile.letter === key.toLowerCase())

window.addEventListener('keyup', onKeyPress)

onBeforeUnmount(() => window.removeEventListener('keyup', onKeyPress))

const virtualKey = (e: Event) => {
    let virtualLetter = ''
    const target = e.target as HTMLButtonElement

    if (target.matches('button')) {
        virtualLetter = target.textContent || ''
    }

    if (target.matches('svg') || target.matches('path')) {
        virtualLetter = 'Backspace'
    }

    onKey(virtualLetter)
}
</script>

<template>
    <main>
        <output>
            {{ message }}
        </output>
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

        <div id="keyboard" @click.stop="virtualKey">
            <template v-for="row in letters" :key="row">
                <div class="row">
                    <template v-for="key in row" :key="key">
                        <button
                            type="button"
                            class="key"
                            :class="[
                                matchingTileForKey(key)?.status,
                                (key === 'Enter' || key === 'Backspace') &&
                                    'big',
                            ]"
                        >
                            <template v-if="key === 'Backspace'">
                                <svg
                                    id="backspace"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <title>{{ key }}</title>
                                    <path
                                        id="backspace"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                                    />
                                </svg>
                            </template>

                            <template v-else>
                                {{ key }}
                            </template>
                        </button>
                    </template>
                </div>
            </template>
        </div>
    </main>
</template>
