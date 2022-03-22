export default class Tile {
    letter: string
    state: string

    constructor(letter = '', state = '') {
        this.letter = letter
        this.state = state
    }

    fill(key: string) {
        this.letter = key.toLowerCase()
    }

    empty() {
        this.letter = ''
    }
}
