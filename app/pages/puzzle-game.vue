<!-- Tota11y Lost - Puzzle Game (Motor Impairment Simulation) -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
import type { PuzzlePiece } from '~/composables/usePuzzleDrag'

definePageMeta({ layout: 'without-footer', title: 'puzzleGame.tabTitle' })

const { goToNextPage } = useNextPage()

// Puzzle image config
const IMAGE_SRC = '/game-assets/puzzle/MULTI-SCREEN_RGB.png'
const COLS = 2
const ROWS = 2
const PIECE_W = 200
const PIECE_H = 200
const BOARD_W = COLS * PIECE_W
const BOARD_H = ROWS * PIECE_H

// Pieces are placed near the 4 corners of the puzzle section, around a
// centered target grid — this maximizes the drag distance for each piece.
// The section's actual size is measured at runtime (see measureContainer),
// so the corners always match the real width/height of the page section,
// not a fixed guessed value.
const CORNER_INSET = 40 // distance from the section edge to a corner piece
const CORNER_JITTER = 15 // small random offset so corner positions aren't identical every time
const DEFAULT_CONTAINER_H = 550

const containerSize = reactive({ width: 900, height: DEFAULT_CONTAINER_H })

// Grid is centered both horizontally and vertically in the section
const GRID_OFFSET_X = computed(() => (containerSize.width - BOARD_W) / 2)
const GRID_OFFSET_Y = computed(() => (containerSize.height - BOARD_H) / 2)

// Container ref for bounds
const boardRef = ref<HTMLElement | null>(null)

// Measure the real rendered size of the puzzle section so corner positions
// match the actual section edges, whatever the screen width is.
function measureContainer() {
  const el = boardRef.value
  if (!el) return
  containerSize.width = el.clientWidth
  containerSize.height = el.clientHeight
}

// Generate target positions (2×2 grid, centered in the section)
function createPieces(): PuzzlePiece[] {
  const targets: PuzzlePiece[] = []
  let id = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      targets.push({
        id: id++,
        x: 0,
        y: 0,
        targetX: GRID_OFFSET_X.value + c * PIECE_W,
        targetY: GRID_OFFSET_Y.value + r * PIECE_H,
        locked: false,
      })
    }
  }
  return targets
}

// The 4 corner slots pieces are shuffled into (top-left, top-right, bottom-left, bottom-right)
function getCornerSlots() {
  return [
    { x: CORNER_INSET, y: CORNER_INSET },
    { x: containerSize.width - PIECE_W - CORNER_INSET, y: CORNER_INSET },
    { x: CORNER_INSET, y: containerSize.height - PIECE_H - CORNER_INSET },
    { x: containerSize.width - PIECE_W - CORNER_INSET, y: containerSize.height - PIECE_H - CORNER_INSET },
  ]
}

// Shuffle pieces into the 4 corners, farthest possible from the centered target grid
function shufflePieces(pieces: PuzzlePiece[]) {
  const shuffled = [...pieces].sort(() => Math.random() - 0.5)
  const corners = getCornerSlots()

  shuffled.forEach((p, i) => {
    const corner = corners[i % corners.length]!
    p.x = corner.x + (Math.random() - 0.5) * CORNER_JITTER
    p.y = corner.y + (Math.random() - 0.5) * CORNER_JITTER
  })
}

const pieces = reactive(createPieces())
shufflePieces(pieces)

const gaugeValue = ref(100)
const completed = ref(false)

const {
  gripGauge,
  activePiece,
  startDrag,
  updatePointer,
  releasePiece,
  applyHint,
} = usePuzzleDrag({
  snapRadius: 30,
  onSnap(_piece) {
    // Could add sound effect here
  },
  onComplete() {
    completed.value = true
    setTimeout(() => goToNextPage(), 1500)
  },
  onGaugeUpdate(value) {
    gaugeValue.value = value
  },
  onDrop(_piece) {
    // Piece silently returns to start — no special feedback
  },
})

// Sync reactive gauge from composable
watchEffect(() => {
  gaugeValue.value = gripGauge.value
})

// Pointer handlers
function onPointerDown(e: PointerEvent, piece: PuzzlePiece) {
  if (piece.locked || completed.value) return
  const board = boardRef.value
  if (!board) return
  const rect = board.getBoundingClientRect()
  startDrag(piece, e.clientX - rect.left, e.clientY - rect.top)
  ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  const board = boardRef.value
  if (!board) return
  const rect = board.getBoundingClientRect()
  updatePointer(e.clientX - rect.left, e.clientY - rect.top)
}

function onPointerUp() {
  releasePiece(pieces)
}

// Hints
function onHint(index: number) {
  applyHint(index)
}

// Grid position for clip-path (row, col from piece id)
function pieceRow(id: number) {
  return Math.floor(id / COLS)
}
function pieceCol(id: number) {
  return id % COLS
}

function onWindowResize() {
  measureContainer()
  // Recompute the grid target for every piece against the new section size.
  // Locked pieces are moved to follow the grid; unlocked, non-dragged pieces
  // are re-shuffled into the (possibly moved) corners.
  const toReshuffle: PuzzlePiece[] = []
  pieces.forEach((p, i) => {
    const tx = GRID_OFFSET_X.value + pieceCol(i) * PIECE_W
    const ty = GRID_OFFSET_Y.value + pieceRow(i) * PIECE_H
    p.targetX = tx
    p.targetY = ty
    if (p.locked) {
      p.x = tx
      p.y = ty
    }
    else if (activePiece.value?.id !== p.id) {
      toReshuffle.push(p)
    }
  })
  shufflePieces(toReshuffle)
}

onMounted(async () => {
  await nextTick()
  measureContainer()
  // Now that we know the real section size, place the grid target and pieces for real
  pieces.forEach((p, i) => {
    p.targetX = GRID_OFFSET_X.value + pieceCol(i) * PIECE_W
    p.targetY = GRID_OFFSET_Y.value + pieceRow(i) * PIECE_H
  })
  shufflePieces(pieces)
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})
</script>

<template>
  <ClientOnly>
    <div class="puzzle-game fs-hm mw-none">
      <GameHeader :page-title="$t('puzzleGame.pageTitle')" />

      <main>
        <div class="mx-large">
          <h2 class="my-small">
            {{ $t('puzzleGame.descriptionHeading') }}
          </h2>
          <p class="fs-hm">
            {{ $t('puzzleGame.descriptionText1') }}
          </p>
          <h2>{{ $t('puzzleGame.userTypeHeading') }}</h2>
          <p class="fs-hm">
            {{ $t('puzzleGame.userTypeText') }}
          </p>
          <h2>{{ $t('puzzleGame.rulesHeading') }}</h2>
          <ul>
            <li>{{ $t('puzzleGame.rule1') }}</li>
            <li>{{ $t('puzzleGame.rule2') }}</li>
          </ul>
        </div>

        <!-- Puzzle zone: gauge aligned above the centered target grid, spaced from the instructions -->
        <div class="puzzle-zone">
          <div
            class="grip-gauge-container"
            role="progressbar"
            :aria-valuenow="Math.round(gaugeValue)"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="$t('puzzleGame.gripGauge')"
          >
            <div class="grip-gauge-label">
              {{ $t('puzzleGame.gripGauge') }}
            </div>
            <div class="grip-gauge-track">
              <div
                class="grip-gauge-fill"
                :style="{ width: gaugeValue + '%' }"
                :class="{
                  'gauge-high': gaugeValue > 60,
                  'gauge-medium': gaugeValue > 25 && gaugeValue <= 60,
                  'gauge-low': gaugeValue <= 25,
                }"
              />
            </div>
            <div class="grip-gauge-value">
              {{ Math.round(gaugeValue) }}%
            </div>
          </div>

          <!-- Puzzle board: centered target grid with pieces staged near the 4 corners -->
          <div
            ref="boardRef"
            class="puzzle-board"
            :style="{ height: containerSize.height + 'px' }"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <!-- Target grid outline: outer dashed frame + internal divider lines. -->
            <!-- Lines are positioned as a percentage of the frame itself so they can -->
            <!-- never extend past its edges, and there is exactly one line per -->
            <!-- internal boundary (no doubled/overlapping borders). -->
            <div
              class="target-grid"
              :style="{
                width: BOARD_W + 'px',
                height: BOARD_H + 'px',
                left: GRID_OFFSET_X + 'px',
                top: GRID_OFFSET_Y + 'px',
              }"
            >
              <div
                v-for="c in COLS - 1"
                :key="'v-' + c"
                class="target-grid-line target-grid-line--v"
                :style="{ left: (c * 100 / COLS) + '%' }"
              />
              <div
                v-for="r in ROWS - 1"
                :key="'h-' + r"
                class="target-grid-line target-grid-line--h"
                :style="{ top: (r * 100 / ROWS) + '%' }"
              />
            </div>

            <!-- Puzzle pieces -->
            <div
              v-for="piece in pieces"
              :key="piece.id"
              class="puzzle-piece"
              :class="{
                'piece-locked': piece.locked,
                'piece-dragging': activePiece?.id === piece.id,
              }"
              :style="{
                width: PIECE_W + 'px',
                height: PIECE_H + 'px',
                left: piece.x + 'px',
                top: piece.y + 'px',
              }"
              :aria-label="$t('puzzleGame.pieceLabel', { n: piece.id + 1 })"
              @pointerdown="(e: PointerEvent) => onPointerDown(e, piece)"
            >
              <div
                class="piece-image"
                :style="{
                  backgroundImage: `url(${IMAGE_SRC})`,
                  backgroundSize: `${BOARD_W}px ${BOARD_H}px`,
                  backgroundPosition: `-${pieceCol(piece.id) * PIECE_W}px -${pieceRow(piece.id) * PIECE_H}px`,
                  width: '100%',
                  height: '100%',
                }"
              />
            </div>
          </div>

          <!-- Victory message -->
          <div v-if="completed" class="victory-message" role="alert">
            <p>{{ $t('puzzleGame.victory') }}</p>
          </div>
        </div>

        <div class="mx-large">
          <GameHints page-id="puzzleGame" large-text @hint="onHint" />
        </div>
      </main>
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.puzzle-game {
  min-height: 100vh;
  background-color: #f5f5f5;
  color: #000;
}

.puzzle-game main {
  padding: 2rem;
}

/* Puzzle zone: separated from the instructions text above, gauge aligned with the grid below */
.puzzle-zone {
  margin: 3rem auto 0;
  display: flex;
  flex-direction: column;
}

/* Grip gauge */
.grip-gauge-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto 1.5rem;
}

.grip-gauge-label {
  font-weight: 700;
  white-space: nowrap;
  font-size: 0.9rem;
}

.grip-gauge-track {
  flex: 1;
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #333;
}

.grip-gauge-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.1s linear;
}

.gauge-high { background: #2e7d32; }
.gauge-medium { background: #f57c00; }
.gauge-low { background: #c62828; }

.grip-gauge-value {
  font-weight: 700;
  font-size: 0.9rem;
  min-width: 3em;
  text-align: right;
}

/* Puzzle board */
.puzzle-board {
  position: relative;
  width: 100%;
  touch-action: none;
  user-select: none;
}

.target-grid {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  border: 2px dashed #999;
}

/* Internal divider lines: each spans exactly the full width/height of the
   frame (via top:0/bottom:0 or left:0/right:0), so it can never overflow
   past the frame's own border, and is centered on its own position with
   transform so only a single 1px line is drawn per boundary. */
.target-grid-line {
  position: absolute;
}

.target-grid-line--v {
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 1px dashed #ccc;
  transform: translateX(-50%);
}

.target-grid-line--h {
  left: 0;
  right: 0;
  height: 0;
  border-top: 1px dashed #ccc;
  transform: translateY(-50%);
}

/* Pieces */
.puzzle-piece {
  position: absolute;
  cursor: grab;
  border: 2px solid #333;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.2s;
  z-index: 10;

  &:active, &.piece-dragging {
    cursor: grabbing;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.4);
    z-index: 20;
  }

  &.piece-locked {
    cursor: default;
    border-color: #2e7d32;
    box-shadow: 0 0 8px rgba(46, 125, 50, 0.5);
    z-index: 5;
  }
}

.piece-image {
  pointer-events: none;
}

/* Victory */
.victory-message {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e7d32;
  padding: 1rem;
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
