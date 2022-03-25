<script setup lang="ts">
import type Tile from '@/class/Tile'

const emit = defineEmits<{ (e: '@keyPressed', key: string): void }>()

const props = defineProps<{ board: Tile[][] }>()
const boardCopy = ref([...props.board])

const letters = ref([
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['Enter', ...'ZXCVBNM'.split(''), 'Backspace'],
])

const matchingTileForKey = (key: string) =>
    boardCopy.value
        .flat()
        .filter((tile) => tile.status)
        .sort((_t1: Tile, t2: Tile) => (t2.status === 'correct' ? 1 : 0))
        .find((tile) => tile.letter === key.toLowerCase())

const virtualKey = (e: Event) => {
    let key = ''
    const target = e.target as HTMLButtonElement
    const button = target.closest('button')

    if (button) {
        key = button?.dataset.key || ''
    }

    emit('@keyPressed', key)
}
</script>

<template>
    <div id="keyboard" @click.stop="virtualKey">
        <template v-for="row in letters" :key="row">
            <div class="row">
                <template v-for="key in row" :key="key">
                    <button
                        type="button"
                        class="key"
                        :class="[
                            matchingTileForKey(key)?.status,
                            (key === 'Enter' || key === 'Backspace') && 'big',
                        ]"
                        :data-key="key"
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
</template>
