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

btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      stopMouse();
      break;
    default:
  }
});

function stopMouse() {
  document.removeEventListener("DOMContentLoaded", setFalseCursor);
  clearInterval(intervalTremorFalseCursor);
  document.removeEventListener("mousemove", addMouseEvent);
  document.removeEventListener("click", addClickEvent);

  const falseCursor = document.getElementById("falsecursor");
  const documentBody = document.querySelectorAll("body");
  const closePopup = document.getElementById("close-popup");
  const validateLink = document.getElementById("link30or60");

  falseCursor.style.display = "none";
  documentBody[0].classList.remove("no-cursor");
  closePopup.classList.remove("no-cursor");
  closePopup.style.cursor = "pointer";
  validateLink.style.cursor = "pointer";

  function closeModal() {
    const modalMoteur = document.getElementById("modalMoteur");
    let modal = boosted.Modal.getInstance(modalMoteur);
    modal.hide();
  }

  closePopup.addEventListener("click", closeModal);
}
