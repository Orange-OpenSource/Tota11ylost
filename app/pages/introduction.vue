<!-- Tota11y Lost - Introduction Page -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'without-footer', title: 'intro.tabTitle' })

const { goToNextPage } = useNextPage()

const linkVisible = ref(false)

function onHint(index: number) {
  if (index === 3) {
    linkVisible.value = true
  }
}
</script>

<template>
  <div>
    <main>
      <div class="mx-xlarge mt-medium">
        <h2>{{ $t('intro.descriptionHeading') }}</h2>
        <p class="fs-hm" v-html="$t('intro.descriptionText1')" />
        <p class="fs-hm">
          {{ $t('intro.descriptionText2.begin') }}&nbsp;<a
            class="text-decoration-none no-hover-effect"
            :class="linkVisible ? 'visible-link' : 'masked-link no-focus-outline'"
            href="#"
            @click.prevent="goToNextPage"
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
          data-bs-toggle="modal"
          data-bs-target="#tooBadModal"
        >
          {{ $t('intro.startButton') }}
        </button>

        <!-- "Too bad" Modal -->
        <div
          id="tooBadModal"
          class="modal fade"
          tabindex="-1"
          aria-labelledby="tooBadModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 id="tooBadModalLabel" class="modal-title h5">
                  {{ $t('intro.modalTitle') }}
                </h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal">
                  <span class="visually-hidden">{{ $t('intro.modalButtonClose') }}</span>
                </button>
              </div>
              <div class="modal-body">
                <p class="fs-hm">
                  {{ $t('intro.modalBody') }}
                </p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-minimal" data-bs-dismiss="modal">
                  {{ $t('intro.modalButtonClose') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <GameHints page-id="intro" large-text @hint="onHint" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.no-hover-effect {
  cursor: auto !important;

  &:hover {
    text-decoration: none !important;
    color: inherit !important;
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
