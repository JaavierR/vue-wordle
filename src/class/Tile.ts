export default class Tile {
    letter: string
    status: string

    constructor(letter = '', status = '') {
        this.letter = letter
        this.status = status
    }

    fill(key: string) {
        this.letter = key.toLowerCase()
    }

    empty() {
        this.letter = ''
    }

    updateStatus(currentGuess: string, theWord: string) {
        this.status = theWord.includes(this.letter) ? 'present' : 'absent'

        const correctGuess =
            currentGuess.indexOf(this.letter) === theWord.indexOf(this.letter)

        if (correctGuess) {
            this.status = 'correct'
        }
    }
}
