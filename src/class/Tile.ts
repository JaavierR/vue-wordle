export default class Tile {
    letter: string
    status: string
    position: number

    constructor(position: number, letter = '', status = '') {
        this.letter = letter
        this.status = status
        this.position = position
    }

    static updateStatusesForRow(row: Tile[], theWord: string) {
        for (const tile of row) {
            tile.updateStatus(theWord)
        }

        row.filter(
            (tile) =>
                tile.status === 'present' &&
                row.some(
                    (t) => t.letter === tile.letter && t.status === 'correct'
                )
        ).forEach((tile) => (tile.status = 'absent'))
    }

    fill(key: string) {
        this.letter = key.toLowerCase()
    }

    empty() {
        this.letter = ''
    }

    updateStatus(theWord: string) {
        if (!theWord.includes(this.letter)) {
            return (this.status = 'absent')
        }

        if (this.letter === theWord[this.position]) {
            return (this.status = 'correct')
        }

        return (this.status = 'present')
    }
}
