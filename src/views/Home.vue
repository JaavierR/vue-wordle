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

const refreshTileStatusCurrentRow = () => {
    currentRow.value.forEach((tile, index) => {
        tile.state = theWord.includes(tile.letter) ? 'present' : 'absent'

        if (currentGuess.value[index] === theWord[index]) {
            tile.state = 'correct'
        }
    })
}

const submitGuess = () => {
    let guessesAllowed = board.value.length
    let guess = currentGuess.value

    if (guess.length < theWord.length) return

    refreshTileStatusCurrentRow()

    if (guess === theWord) {
        showMessage('You win')
    } else if (guessesAllowed === currentRowIndex.value + 1) {
        showMessage('Game over. You lose')
        state.value = 'completed'
    } else {
        showMessage('NOPE')
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
    <main>
        <div id="game">
            <template v-for="row in board" :key="row">
                <div class="row">
                    <template v-for="tile in row" :key="tile">
                        <div class="tile" :class="tile.state">
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
