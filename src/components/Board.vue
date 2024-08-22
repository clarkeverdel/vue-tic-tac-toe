<script setup lang="ts">
import { computed, ref } from 'vue'

const lineClasses = [
  'top-row',
  'middle-row',
  'bottom-row',
  'left-column',
  'middle-column',
  'right-column',
  'diagonal-1',
  'diagonal-2'
] as const

const winnerOutcomes: {
  outcomes: [number, number, number]
  class: (typeof lineClasses)[number]
}[] = [
  { outcomes: [1, 2, 3], class: lineClasses[0] },
  { outcomes: [4, 5, 6], class: lineClasses[1] },
  { outcomes: [7, 8, 9], class: lineClasses[2] },
  { outcomes: [1, 4, 7], class: lineClasses[3] },
  { outcomes: [2, 5, 8], class: lineClasses[4] },
  { outcomes: [3, 6, 9], class: lineClasses[5] },
  { outcomes: [1, 5, 9], class: lineClasses[6] },
  { outcomes: [3, 5, 7], class: lineClasses[7] }
]

// positions are based on indexes

type PlayerId = 'x' | 'o'
type GameState = (null | PlayerId)[]

type Move = { index: number; score: number }

const humanPlayerId = 'x'
const computerPlayerId = 'o'

const tiles = Array.from({ length: 9 }, (_, index) => index)

const currentState = ref<GameState>(Array.from({ length: 9 }, () => null))
const currentPlayer = ref<PlayerId>('x')
const gameStatus = ref<'winner' | 'draw' | 'undetermined'>('undetermined')

const hasWinner = computed(() => gameStatus.value === 'winner')
const isDraw = computed(() => gameStatus.value === 'draw')
const lineClass = ref<(typeof lineClasses)[number] | null>(null)

let bestScore

const resetGame = () => {
  currentState.value = Array.from({ length: 9 }, () => null)
  currentPlayer.value = humanPlayerId
  gameStatus.value = 'undetermined'
  lineClass.value = null
}

const checkWinningPositions = (gameCurrent: GameState, player: PlayerId) => {
  let positions = findPositions(gameCurrent, player)
  for (let i = 0; i < winnerOutcomes.length; i++) {
    if (winnerOutcomes[i].outcomes.every((item) => positions.includes(item - 1))) {
      return true
    }
  }
  return false
}

const checkDraw = (gameCurrent: GameState) => {
  return gameCurrent.filter((value) => value).length === 9
}

const findPositions = (array: GameState, value: PlayerId) => {
  const positions = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      positions.push(i)
    }
  }
  return positions
}

const checkWinner = () => {
  for (const outcome of winnerOutcomes) {
    const [a, b, c] = outcome.outcomes

    if (
      currentState.value[a - 1] &&
      currentState.value[a - 1] === currentState.value[b - 1] &&
      currentState.value[a - 1] === currentState.value[c - 1]
    ) {
      gameStatus.value = 'winner'
      lineClass.value = outcome.class

      return true
    }
  }
  return false
}

const emptyCells = (gameCurrent: GameState) => {
  let empty = []
  for (let i = 0; i < gameCurrent.length; i++) {
    if (!gameCurrent[i]) empty.push(i)
  }
  return empty
}

const updateGame = (index: number) => {
  return currentState.value.map((value, i) => {
    if (i === index) {
      return currentPlayer.value
    }

    return value
  })
}

const checkGameStatus = () => {
  const isDraw = checkDraw(currentState.value)
  if (isDraw) {
    gameStatus.value = 'draw'
    // Show a very confusing emoji on the screen
    return
  }

  const isWinner = checkWinner()

  if (isWinner) {
    // Show a toast on the screen
    // You won!
    return
  }
}

const switchTurn = () => {
  if (currentPlayer.value === humanPlayerId) {
    currentPlayer.value = computerPlayerId
    computerTurn()
  } else if (currentPlayer.value === computerPlayerId) {
    currentPlayer.value = humanPlayerId
  }
}

const computerTurn = async () => {
  setTimeout(async () => {
    let empty = emptyCells(currentState.value)
    if (empty.length > 0) {
      let bestMove = await miniMax(currentState.value, computerPlayerId, empty.length)
      currentState.value = updateGame(bestMove.index)
    }

    switchTurn()

    checkGameStatus()
  }, 1000)
}

const onClickTile = async (event: Event) => {
  if (currentPlayer.value !== humanPlayerId) {
    // Show a toast on the screen
    // Not your turn!
    return
  }

  const target = event.target as HTMLButtonElement
  const index = Number(target.getAttribute('data-index'))

  if (currentState.value[index]) {
    // If the tile is already filled, show a toast on the screen
    return
  }

  // Set new game state
  currentState.value = updateGame(index)

  checkGameStatus()

  switchTurn()
}

const miniMax = (gameCurrent: GameState, player: PlayerId, depth: number) => {
  const min = (a: number, b: number) => {
    return a < b ? a : b
  }

  const max = (a: number, b: number) => {
    return a > b ? a : b
  }

  let empty = emptyCells(gameCurrent)

  if (checkWinningPositions(gameCurrent, humanPlayerId)) {
    return { score: -1 }
  }
  if (checkWinningPositions(gameCurrent, computerPlayerId)) {
    return { score: 1 }
  }
  if (empty.length === 0 || depth === 0) {
    return { score: 0 }
  }

  depth--

  let movePossibles: Move[] = []

  for (let i = 0; i < empty.length; i++) {
    let move = {} as { index: number; score: number }
    move.index = empty[i]

    let newGame = gameCurrent.slice()
    newGame[empty[i]] = player

    let result = miniMax(
      newGame,
      player === computerPlayerId ? humanPlayerId : computerPlayerId,
      depth
    )
    move.score = result?.score
    movePossibles.push(move)
  }

  let bestMove: number = undefined!

  if (player === computerPlayerId) {
    bestScore = -Infinity
    for (let i = 0; i < movePossibles.length; i++) {
      bestScore = max(bestScore, movePossibles[i].score)
      if (movePossibles[i].score === bestScore) {
        bestMove = i
      }
    }
  } else {
    bestScore = Infinity
    for (let i = 0; i < movePossibles.length; i++) {
      bestScore = min(bestScore, movePossibles[i].score)
      if (movePossibles[i].score === bestScore) {
        bestMove = i
      }
    }
  }

  return movePossibles[bestMove]
}
</script>

<template>
  <section :class="['grid', hasWinner && 'line line-' + lineClass]">
    <div class="grid-tile" v-for="tile in tiles" :key="tile">
      <button
        class="grid-tile-button"
        v-on:click="onClickTile"
        :data-index="tile"
        :disabled="hasWinner"
      >
        {{ currentState[tile] }}
      </button>
    </div>
  </section>

  <h2 v-if="hasWinner === true">Has winner: {{ hasWinner }} (player: {{ currentPlayer }})</h2>
  <h2 v-if="isDraw">It's a draw! 🤔</h2>
  <button @click="resetGame" v-if="hasWinner || isDraw">Start new game</button>
</template>

<style scoped>
/**
 * Diagonal line mathematical formula: length = s * √2
 * This means that we can calculate the length of the diagonal line by multiplying the side length by the square root of 2.
 * The square root of 2 is approximately 1.4142.
 */

.grid:deep {
  --square-root-of-2: 1.4142;
  --tile-gap: 1rem;
  --tile-width: calc(100% - calc(var(--tile-gap) * 2)) / 3;
  --half-tile-width: calc(var(--tile-width) / 2);
  --one-plus-gap: calc(var(--tile-width) + var(--tile-gap));
  --two-plus-gap: calc(var(--one-plus-gap) * 2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-block: 2rem;
  position: relative;
  overflow: hidden;
}

.grid-tile {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  background-color: #f0f0f0;
}

.grid-tile-button {
  width: 100%;
  height: 100%;
  font-size: 2rem;
  background-color: #fff;
  border: 0;
  cursor: pointer;
}

.line::after {
  content: '';
  width: 5px;
  height: 90%;
  background-color: red;
  display: block;
  position: absolute;
}

.line-top-row::after {
  left: 50%;
  top: var(--half-tile-width);
  transform: translate(0, calc(-50% + 2.5px)) rotate(90deg);
}

.line-middle-row::after {
  left: 50%;
  top: calc(var(--one-plus-gap) + var(--half-tile-width));
  transform: translate(0, calc(-50% + 2.5px)) rotate(90deg);
}

.line-bottom-row::after {
  left: 50%;
  top: calc(var(--two-plus-gap) + var(--half-tile-width));
  transform: translate(0, -50%) rotate(90deg);
}

.line-left-column::after {
  top: 5%;
  left: var(--half-tile-width);
  transform: translate(-50%, 0%) rotate(0deg);
}

.line-middle-column::after {
  top: 5%;
  left: calc(var(--one-plus-gap) + var(--half-tile-width));
  transform: translate(-50%, 0%) rotate(0deg);
}

.line-right-column::after {
  top: 5%;
  left: calc(var(--two-plus-gap) + var(--half-tile-width));
  transform: translate(-50%, 0%) rotate(0deg);
}

.line-diagonal-1::after {
  --height: calc(90% * var(--square-root-of-2));
  height: calc(90% * var(--square-root-of-2));
  top: calc(50% - var(--height) / 2);
  left: 50%;
  transform: translate(-50%, 0%) rotate(135deg);
}
.line-diagonal-2::after {
  --height: calc(90% * var(--square-root-of-2));
  height: calc(90% * var(--square-root-of-2));
  top: calc(50% - var(--height) / 2);
  left: 50%;
  transform: translate(-50%, 0%) rotate(45deg);
}
</style>
