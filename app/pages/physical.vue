<!-- Tota11y Lost - Physical (Motor) Impairment Page -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'physical.tabTitle' })

const { goToNextPage } = useNextPage()
const { start: startTremor, stop: stopTremor } = useTremor()

const modalVisible = ref(true)
const modalRef = ref<HTMLElement | null>(null)
const tremorActive = ref(true)
const falseCursorRef = ref<HTMLImageElement | null>(null)

useHead({ htmlAttrs: { class: computed(() => tremorActive.value ? 'no-cursor' : '') } })

function handleFakeClick(_x: number, _y: number, element: Element | null) {
  if (!element) return

  if (element.id === 'close-popup' || element.closest('#close-popup')) {
    modalVisible.value = false
  }
  else if (element.id === 'link30or60' || element.closest('#link30or60')) {
    goToNextPage()
  }
}

function onHint(index: number) {
  if (index === 3) {
    tremorActive.value = false
    stopTremor()
  }
}

onMounted(async () => {
  await nextTick()
  if (falseCursorRef.value) {
    startTremor(falseCursorRef.value, handleFakeClick)
  }
  modalRef.value?.focus()
})

watch(modalVisible, (visible) => {
  if (import.meta.server) return
  document.documentElement.style.overflow = visible ? 'hidden' : ''
  document.body.style.overflow = visible ? 'hidden' : ''
}, { immediate: true })

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
</script>

<template>
  <ClientOnly>
    <div class="physical fs-hm">
      <GameHeader :page-title="$t('physical.pageTitle')" />

      <main>
        <div class="mx-large height40">
          <!-- Instructions Modal -->
          <div
            v-if="modalVisible"
            ref="modalRef"
            class="modal d-block"
            tabindex="-1"
            style="background: rgba(0,0,0,0.5);"
            role="dialog"
            aria-modal="true"
            @keydown.escape="modalVisible = false"
          >
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    id="close-popup"
                    class="my-small ms-auto close-popup border-none btn"
                    :aria-label="$t('physical.aria-label_closeModal')"
                    @click="modalVisible = false"
                  >
                    X
                  </button>
                </div>
                <div class="modal-body">
                  <h1>{{ $t('physical.modalTitle') }}</h1>
                  <h2>{{ $t('physical.descriptionHeading') }}</h2>
                  <p class="fs-hm" v-html="$t('physical.descriptionText1')" />
                  <p class="fs-hm">
                    {{ $t('physical.descriptionText2') }}
                  </p>
                  <h2>{{ $t('physical.userTypeHeading') }}</h2>
                  <p class="fs-hm">
                    {{ $t('physical.userTypeText') }}
                  </p>
                  <h2>{{ $t('physical.rulesHeading') }}</h2>
                  <ul>
                    <li>{{ $t('physical.rule1') }}</li>
                    <li>{{ $t('physical.rule2') }}</li>
                    <li>{{ $t('physical.rule3') }}</li>
                  </ul>
                  <GameHints page-id="physical" large-text @hint="onHint" />
                </div>
              </div>
            </div>
          </div>

          <a
            id="link30or60"
            href="#"
            class="valid fs-hs p-small mt-none"
            @click.prevent
          >
            {{ $t('physical.validateLink') }}
          </a>
        </div>
      </main>

      <!-- Fake cursor - follows mouse position with tremor offset -->
      <img
        v-if="tremorActive"
        ref="falseCursorRef"
        src="http://telcontar.net/Misc/screeniecursors/Cursor%20arrow%20white.png"
        class="fake-cursor"
        alt=""
      >
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.physical {
  background-color: #ffffff !important;
  color: #000 !important;
  min-height: 100vh;

  *:not(.btn-brand) {
    background-color: transparent;
    color: inherit;
  }
}

.physical main {
  background-color: #ffffff !important;

  *:not(.btn-brand) {
    background-color: transparent;
    color: #000;
  }
}

.modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.5) !important;
  padding: 1.5rem 0;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;

  .modal-dialog {
    margin: auto;
  }

  .modal-content {
    background-color: white !important;
    color: #000 !important;
    border: 1px solid #ddd;

    *:not(.btn-brand) {
      background-color: transparent !important;
      color: #000 !important;
    }
  }

  .modal-body {
    padding: 0rem 1.5rem;
  }

  .close-popup {
    --bs-btn-min-width: 1.75rem;
    --bs-btn-min-height: 1.75rem;
    background-color: transparent !important;
    color: #000 !important;
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1;
    padding: 0 !important;
     min-width: 1.75rem !important;
    min-height: 1.75rem !important;

    cursor: pointer;

    &:hover {
      color: #666;
    }

  }
}

.valid {
  display: inline-block;
  padding: 0.75rem 1.5rem !important;
  background-color: #ff6600 !important;
  color: white !important;
  text-decoration: none !important;
  border-radius: 0.25rem;
  font-weight: 600;

  &:hover {
    background-color: #e55a00 !important;
    text-decoration: none !important;
  }
}

.fake-cursor {
  position: fixed !important;
  pointer-events: none !important;
  width: 32px;
  height: 32px;
  z-index: 9999;
  display: block !important;
  opacity: 1 !important;
  object-fit: contain;
}
</style>
