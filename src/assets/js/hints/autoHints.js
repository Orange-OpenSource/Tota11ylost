/*
Software Name: Tota11ylost
SPDX-FileCopyrightText: Copyright (c) Orange SA
SPDX-License-Identifier: AGPL-3.0-or-later

This software is distributed under the GNU Affero General Public License v3.0 or later,
the text of which is available at https://opensource.org/license/agpl-v3
or see the "LICENSE" file for more details.

Authors: See CONTRIBUTORS.txt file
Software description: Experience in a playful way the challenges faced by people with digital disabilities
*/

// Automatic hints for form-registration: each hint opens a dismissible alert modal.
// Delay before each hint; the next countdown starts when the previous modal is closed.
const AUTO_HINT_DELAYS = [120000, 90000, 60000];
const FIELD_SELECTOR = 'input, select, textarea';

const autoHintModal = document.getElementById('autoHintModal');
const autoHintTitle = document.getElementById('autoHintModalTitle');
const autoHintBody = document.getElementById('autoHintModalBody');
const autoHintLast = document.getElementById('autoHintModalLast');
const autoHintClose = document.getElementById('autoHintClose');

let autoHintCount = 0;
let lastField = null;

function startAutoHints() {
  const delay = AUTO_HINT_DELAYS[autoHintCount];
  if (delay === undefined) return;
  setTimeout(openAutoHint, delay);
}

function openAutoHint() {
  autoHintCount++;
  autoHintTitle.textContent = i18next.t('hints.hintActivated', { index: autoHintCount });
  autoHintBody.textContent = i18next.t('hints.formRegistration', { returnObjects: true })[autoHintCount - 1];
  // Emptied rather than hidden: aria-describedby would still read hidden content
  autoHintLast.textContent = autoHintCount === AUTO_HINT_DELAYS.length ? i18next.t('hints.lastHint') : '';
  autoHintModal.hidden = false;
  applyHint(autoHintCount);
  autoHintClose.focus();
}

function closeAutoHint() {
  autoHintModal.hidden = true;
  startAutoHints();
  const target = lastField && lastField.isConnected ? lastField : document.getElementById('pistache');
  target.scrollIntoView({ block: 'center' });
  target.focus({ preventScroll: true });
}

autoHintClose.addEventListener('click', closeAutoHint);

document.addEventListener('focusin', (e) => {
  if (e.target instanceof HTMLElement && e.target.matches(FIELD_SELECTOR)) {
    lastField = e.target;
  }
});

// Listened on document so the trap works even when focus is outside the modal (e.g. on body)
document.addEventListener('keydown', (e) => {
  if (autoHintModal.hidden) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeAutoHint();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    autoHintClose.focus();
  }
});
