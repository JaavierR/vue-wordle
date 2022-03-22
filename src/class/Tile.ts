type LetterStatus = 'correct' | 'present' | 'absent'

export default class Tile {
    letter: string
    status: string
    position: number

    constructor(position: number, letter = '', status = '') {
        this.letter = letter
        this.status = status
        this.position = position
    }

    static updateStatusesForRow(
        row: Tile[],
        theWord: string,
        keyStatus: Record<string, LetterStatus>
    ) {
        for (const tile of row) {
            tile.updateStatus(theWord, keyStatus)
        }

        row.filter(
            (tile) =>
                tile.status === 'present' &&
                row.some(
                    (t) => t.letter === tile.letter && t.status === 'correct'
                )
        ).forEach((tile) => {
            // keyStatus[tile.letter] = 'absent'
            tile.status = 'absent'
        })
    }

    fill(key: string) {
        this.letter = key.toLowerCase()
    }

    empty() {
        this.letter = ''
    }

    updateStatus(theWord: string, keyStatus: Record<string, LetterStatus>) {
        if (!theWord.includes(this.letter)) {
            keyStatus[this.letter] = 'absent'
            return (this.status = 'absent')
        }

        if (this.letter === theWord[this.position]) {
            keyStatus[this.letter] = 'correct'
            return (this.status = 'correct')
        }

        keyStatus[this.letter] = 'present'
        return (this.status = 'present')
    }
}
