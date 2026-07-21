<!-- Tota11y Lost - Introduction Page -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'intro.tabTitle' })

const { goToNextPage } = useNextPage()

const linkVisible = ref(false)
const modalVisible = ref(false)
const modalRef = ref<HTMLElement | null>(null)

watch(modalVisible, async (visible) => {
  if (visible) {
    await nextTick()
    modalRef.value?.focus()
  }
})

function onHint(index: number) {
  if (index === 3) {
    linkVisible.value = true
  }
}

function navigateViaLink() {
  goToNextPage()
}
</script>

<template>
  <div>
    <GameHeader :page-title="$t('intro.pageTitle')" />
    <main>
      <div class="mx-xlarge mt-medium">
        <h2>{{ $t('intro.descriptionHeading') }}</h2>
        <p class="fs-hm" v-html="$t('intro.descriptionText1')" />
        <p class="fs-hm">
          {{ $t('intro.descriptionText2.begin') }}&nbsp;<a
            class="text-decoration-none no-hover-effect"
            :class="linkVisible ? 'visible-link' : 'masked-link no-focus-outline'"
            href="#"
            @click.prevent="navigateViaLink"
          >{{ $t('intro.descriptionText2.here') }}</a>{{ $t('intro.descriptionText2.end') }}
        </p>

        <h2>{{ $t('intro.rulesHeading') }}</h2>
        <ul>
          <li class="fs-hm">
            {{ $t('intro.rule1') }}
          </li>
          <li class="fs-hm">
            {{ $t('intro.rule2') }}
          </li>
          <li class="fs-hm">
            {{ $t('intro.rule3') }}
          </li>
        </ul>

        <button
          class="btn fs-hs p-small btn-brand my-small"
          @click="modalVisible = true"
        >
          {{ $t('intro.startButton') }}
        </button>

        <!-- "Too bad" Modal -->
        <div
          v-if="modalVisible"
          ref="modalRef"
          class="modal d-block"
          tabindex="-1"
          aria-labelledby="tooBadModalLabel"
          aria-modal="true"
          role="dialog"
          @keydown.escape="modalVisible = false"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 id="tooBadModalLabel" class="modal-title h5">
                  {{ $t('intro.modalTitle') }}
                </h1>
                <button type="button" class="btn-close" @click="modalVisible = false">
                  <span class="visually-hidden">{{ $t('intro.modalButtonClose') }}</span>
                </button>
              </div>
              <div class="modal-body">
                <p class="fs-hm">
                  {{ $t('intro.modalBody') }}
                </p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-minimal" @click="modalVisible = false">
                  {{ $t('intro.modalButtonClose') }}
                </button>
              </div>
            </div>
          </div>

          <GameHints page-id="intro" large-text @hint="onHint" />
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5) ;

  .modal-content {
    background-color: white ;
  }
}

.no-hover-effect {
  cursor: auto !important;

  &:hover {
    text-decoration: none !important;
    color: inherit !important;
  }
}

.masked-link {
  color: rgb(0, 0, 0) !important;

  &:hover,
  &:active,
  &:visited,
  &:focus,
  &:focus-visible {
    color: rgb(0, 0, 0) !important;
    text-decoration: none !important;
    outline: none !important;
    border: none !important;
  }
}

a {
  font-weight: normal;
}

.visible-link {
  color: var(--bs-link-color);
  font-weight: normal;
  text-decoration: underline !important;
  cursor: pointer !important;

  &:hover {
    color: var(--bs-link-hover-color) !important;
    text-decoration: underline !important;
  }
}
</style>
