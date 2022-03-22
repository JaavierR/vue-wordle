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
}
