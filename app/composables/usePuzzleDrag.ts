// Tota11y Lost - Puzzle Drag Composable (Motor impairment simulation)
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA

export interface PuzzlePiece {
  id: number
  /** Current position (top-left corner) */
  x: number
  y: number
  /** Correct target position */
  targetX: number
  targetY: number
  /** Whether this piece is locked in place */
  locked: boolean
}

export interface PuzzleDragOptions {
  /** Snap tolerance in pixels (default 30) */
  snapRadius?: number
  /** Called when a piece snaps into place */
  onSnap?: (piece: PuzzlePiece) => void
  /** Called when all pieces are placed */
  onComplete?: () => void
  /** Called every frame during drag with grip gauge value 0-100 */
  onGaugeUpdate?: (value: number) => void
  /** Called when piece is dropped (grip ran out) */
  onDrop?: (piece: PuzzlePiece) => void
}

// Normal distribution samples for tremor (reused from useTremor logic)
const normalSamples = [
  -0.954, -0.390, 0.955, -0.742, 0.415, 1.114, 0.761, 0.738,
  -0.538, 2.953, 1.297, 0.879, -0.431, 0.908, 1.329, -2.062,
  0.854, 0.645, 0.296, 0.029,
]

function sampleNormal(): number {
  const idx = Math.floor(Math.random() * normalSamples.length)
  return normalSamples[idx] ?? 0
}

export function usePuzzleDrag(options: PuzzleDragOptions = {}) {
  const snapRadius = options.snapRadius ?? 30

  // Difficulty multipliers (affected by hints)
  const drainMultiplier = ref(1) // 1 = normal, 0.5 = hint1 (slower drain)
  const tremorMultiplier = ref(1) // 1 = normal, 0.5 = hint2 (less tremor)
  const simulationDisabled = ref(false)

  // Drag state
  const activePiece = ref<PuzzlePiece | null>(null)
  const gripGauge = ref(100)
  const tremorOffset = reactive({ x: 0, y: 0 })
  const isDragging = ref(false)

  // Internal state (not reactive for perf)
  let lastPointerX = 0
  let lastPointerY = 0
  let lastFrameTime = 0
  let lastSpeed = 0
  let animFrameId: number | null = null
  let dragOffsetX = 0
  let dragOffsetY = 0
  let pieceStartX = 0
  let pieceStartY = 0

  // Speed thresholds
  const SPEED_FAST = 8 // px/frame — above this = fast drag
  const SPEED_SLOW = 2 // px/frame — below this = slow drag

  // Drain rates (% per frame at 60fps)
  const DRAIN_FAST = 2.0
  const DRAIN_SLOW = 0.3

  // Tremor amplitudes (pixels)
  const TREMOR_FAST = 3
  const TREMOR_SLOW = 35

  function startDrag(piece: PuzzlePiece, pointerX: number, pointerY: number) {
    if (piece.locked || simulationDisabled.value === undefined) return
    if (piece.locked) return

    activePiece.value = piece
    isDragging.value = true
    gripGauge.value = 100
    tremorOffset.x = 0
    tremorOffset.y = 0
    lastPointerX = pointerX
    lastPointerY = pointerY
    lastFrameTime = performance.now()
    lastSpeed = 0

    // Offset so piece doesn't jump to cursor center
    dragOffsetX = piece.x - pointerX
    dragOffsetY = piece.y - pointerY
    pieceStartX = piece.x
    pieceStartY = piece.y

    animFrameId = requestAnimationFrame(dragLoop)
  }

  function updatePointer(pointerX: number, pointerY: number) {
    if (!isDragging.value || !activePiece.value) return

    lastPointerX = pointerX
    lastPointerY = pointerY
  }

  function dragLoop(timestamp: number) {
    if (!isDragging.value || !activePiece.value) return

    const dt = timestamp - lastFrameTime
    lastFrameTime = timestamp

    // Avoid huge jumps on first frame or tab switch
    if (dt > 100) {
      animFrameId = requestAnimationFrame(dragLoop)
      return
    }

    const piece = activePiece.value

    // Calculate speed (px per 16ms frame equivalent)
    const rawX = lastPointerX + dragOffsetX
    const rawY = lastPointerY + dragOffsetY
    const dx = rawX - piece.x
    const dy = rawY - piece.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const frameNormalized = dt / 16.67 // normalize to 60fps
    const speed = frameNormalized > 0 ? distance / frameNormalized : 0

    // Smooth speed
    lastSpeed = lastSpeed * 0.7 + speed * 0.3

    if (simulationDisabled.value) {
      // No simulation: direct positioning
      piece.x = rawX
      piece.y = rawY
      tremorOffset.x = 0
      tremorOffset.y = 0
      animFrameId = requestAnimationFrame(dragLoop)
      return
    }

    // Determine drain rate and tremor amplitude based on speed
    let drainRate: number
    let tremorAmplitude: number

    if (lastSpeed > SPEED_FAST) {
      drainRate = DRAIN_FAST
      tremorAmplitude = TREMOR_FAST
    }
    else if (lastSpeed < SPEED_SLOW) {
      drainRate = DRAIN_SLOW
      tremorAmplitude = TREMOR_SLOW
    }
    else {
      // Linear interpolation between slow and fast
      const t = (lastSpeed - SPEED_SLOW) / (SPEED_FAST - SPEED_SLOW)
      drainRate = DRAIN_SLOW + t * (DRAIN_FAST - DRAIN_SLOW)
      tremorAmplitude = TREMOR_SLOW + t * (TREMOR_FAST - TREMOR_SLOW)
    }

    // Apply multipliers from hints
    drainRate *= drainMultiplier.value
    tremorAmplitude *= tremorMultiplier.value

    // Drain gauge
    const drainPerFrame = drainRate * (dt / 16.67)
    gripGauge.value = Math.max(0, gripGauge.value - drainPerFrame)
    options.onGaugeUpdate?.(gripGauge.value)

    // Check if grip lost
    if (gripGauge.value <= 0) {
      dropPiece()
      return
    }

    // Apply tremor
    const tX = sampleNormal() * tremorAmplitude
    const tY = sampleNormal() * tremorAmplitude
    tremorOffset.x = tX
    tremorOffset.y = tY

    // Update piece position (raw + tremor)
    piece.x = rawX + tX
    piece.y = rawY + tY

    animFrameId = requestAnimationFrame(dragLoop)
  }

  function dropPiece() {
    if (!activePiece.value) return

    const piece = activePiece.value

    // Return to start position
    piece.x = pieceStartX
    piece.y = pieceStartY

    options.onDrop?.(piece)
    endDrag()
  }

  function endDrag() {
    isDragging.value = false
    tremorOffset.x = 0
    tremorOffset.y = 0

    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }

    activePiece.value = null
  }

  function releasePiece(pieces: PuzzlePiece[]) {
    if (!activePiece.value) return

    const piece = activePiece.value

    // Check if close enough to target (use position without tremor for fairness)
    const rawX = lastPointerX + dragOffsetX
    const rawY = lastPointerY + dragOffsetY
    const dx = rawX - piece.targetX
    const dy = rawY - piece.targetY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist <= snapRadius) {
      // Snap!
      piece.x = piece.targetX
      piece.y = piece.targetY
      piece.locked = true
      options.onSnap?.(piece)

      // Check if all pieces are placed
      if (pieces.every(p => p.locked)) {
        options.onComplete?.()
      }
    }
    else {
      // Return to start
      piece.x = pieceStartX
      piece.y = pieceStartY
    }

    endDrag()
  }

  // Hint controls
  function applyHint(index: number) {
    if (index === 1) {
      drainMultiplier.value = 0.5
    }
    else if (index === 2) {
      tremorMultiplier.value = 0.5
    }
    else if (index === 3) {
      simulationDisabled.value = true
    }
  }

  onUnmounted(() => {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
    }
  })

  return {
    // State
    activePiece: readonly(activePiece),
    gripGauge: readonly(gripGauge),
    tremorOffset: readonly(tremorOffset),
    isDragging: readonly(isDragging),
    simulationDisabled: readonly(simulationDisabled),

    // Actions
    startDrag,
    updatePointer,
    releasePiece,
    dropPiece,
    applyHint,
  }
}
