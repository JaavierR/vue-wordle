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
        const word: (string | null)[] = theWord.split('')

        // Check for correct letters...
        for (const tile of row) {
            const isCorrect = word[tile.position] === tile.letter

            if (isCorrect) {
                tile.status = 'correct'
                word[tile.position] = null
            }
        }

        // Check for present letters...
        let rowWithoutStatus = row.filter((tile) => !tile.status)

        for (const tile of rowWithoutStatus) {
            if (word.includes(tile.letter)) {
                tile.status = 'present'
                word[tile.position] = null
            }
        }

        // Anything that remains is absent...
        rowWithoutStatus = row.filter((tile) => !tile.status)

        for (const tile of rowWithoutStatus) {
            tile.status = 'absent'
        }
    }

    fill(key: string) {
        this.letter = key.toLowerCase()
    }

    empty() {
        this.letter = ''
    }
}
