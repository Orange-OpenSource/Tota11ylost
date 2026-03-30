<!-- Tota11y Lost - Footer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<template>
  <footer class="footer bg-dark navbar-dark mt-auto">
    <h2 class="visually-hidden">
      {{ $t('common.footer.sitemapAndInformation') }}
    </h2>
    <div class="ms-4 footer-terms">
      <ul class="navbar-nav gap-md-3">
        <li class="fw-bold">
          {{ $t('common.footer.copyright') }}
        </li>
        <li>
          <a class="nav-link" :href="$t('common.footer.href_termsAndConditions')">
            {{ $t('common.footer.termsAndConditions') }}
          </a>
        </li>
        <li>
          <a class="nav-link" :href="$t('common.footer.href_privacy')">
            {{ $t('common.footer.privacy') }}
          </a>
        </li>
        <li>
          <a class="nav-link" :href="$t('common.footer.href_accessibilityStatement')">
            {{ $t('common.footer.accessibilityStatement') }}
          </a>
        </li>
        <li>
          <a class="nav-link" :href="$t('common.footer.href_cookiePolicy')">
            {{ $t('common.footer.cookiePolicy') }}
          </a>
        </li>
        <li>
          <a class="nav-link" hreflang="en" :href="$t('common.footer.href_licence')">
            {{ $t('common.footer.licence') }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>
