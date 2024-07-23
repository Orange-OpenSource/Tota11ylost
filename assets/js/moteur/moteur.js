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

let normal = [
  -0.954486511205664, -0.390343505844172, 0.954967163741049, -0.741969088844115,
  0.415498313809018, 1.11448864081483, 0.76051606293719, 0.737922868989143,
  -0.538210735151749, 2.95321369930028, 1.29722248593233, 0.879352418857219,
  -0.431491137709812, 0.907957414011492, 1.32937856972126, -2.06193940045371,
  0.853924002501051, 0.644568387942851, 0.29585966062521, 0.029283909642257,
  -0.116309884538336, -0.21247946969567, 0.520679721081564, 1.40888714495192,
  -0.872289147256009, -0.895142161740987, -0.210110524304462, -1.09347050985988,
  -1.24695998274644, 0.108705615063444, -0.0299178988550738, 1.47641798733614,
  0.489325530238317, -1.25614368071793, -0.265909415432471, 0.526102923817908,
  -0.10480962312103, -1.07215275189888, -0.383193549659934, 0.51002010941531,
  0.944163306601511, -0.0321767673468271, -1.35144964116703, 0.263596823001421,
  0.540427623567371, -1.04241902308392, -0.670516393824332, 0.158485972372211,
  0.164154884035072, -1.93009734490646, 0.852783520922024, -1.34765702216979,
  -0.531800074686698, 0.280961008814437, 0.630531054720149, 0.343363294659579,
  -1.2170531471355, 1.58324901607691, -0.539584265875985, 0.311161618787563,
  -0.317124254762646, -0.260151494067805, -0.673509625719232, 0.136403271282643,
  1.01258180403649, 0.575317947712617, 1.14868551793635, 0.327870722017452,
  0.94293964636229, -1.22571566590562, 1.37854270548666, -0.0948946472840643,
  0.966120915277423, -0.298859582000788, 1.67278530569779, -1.28203090996874,
  0.296928115774355, -1.09044170966977, 1.46093203424296, -0.239098151446543,
  -1.51561000187031, -0.154811273589294, 0.0319192709941601, -0.527036227344993,
  -0.513927560425381, 0.579844345200166, -0.0747662994634585, 0.64628638844104,
  -0.321894061028443, -0.798643441029118, -2.02075744646756, -0.319258166115966,
  0.0963191114713903, -0.794920474769472, 0.0610320023340435, 0.345931510365856,
  -1.31282275014755, -0.0968080218000676, 0.37646603364382, 1.82218271404721,
];
let tremorBasePx = 40;
let verticalOffset = 0; // Ajoutez le décalage vertical ici
let intervalTremorFalseCursor;
let addMouseEvent;
let addClickEvent;

function sampleInt(magnitude) {
  return normal[Math.round(Math.random() * normal.length)] * magnitude;
}

document.addEventListener("DOMContentLoaded", setFalseCursor);

function setFalseCursor(event) {
  const myModal = new boosted.Modal("#modalMoteur", {});
  const modalToggle = document.getElementById("modalMoteur");
  myModal.show(modalToggle);

  let falseCursor = document.getElementById("falsecursor");

  let lastCursor = {
    clientX: 0,
    clientY: 0,
  };

  function addTremorToFalseCursor() {
    let randX = sampleInt(tremorBasePx);
    let randY = sampleInt(tremorBasePx);
    let newY = (lastCursor.clientY + randY + verticalOffset).toString() + "px";
    let newx = (lastCursor.clientX + randX).toString() + "px";
    falseCursor.style.top = newY;
    falseCursor.style.left = newx;
    falseCursor.style.transition = "top 0.2s, left 0.2s linear";
  }

  function addMouseEvent(event) {
    lastCursor = event;
  }

  function addClickEvent() {
    const x = parseInt(falseCursor.style.left, 10);
    const y = parseInt(falseCursor.style.top, 10);
    const element = document.elementFromPoint(x, y);

    if (element) {
      if (element.id === "close-popup") {
        myModal.hide(modalToggle);
      } else if (element.id === "link30or60") {
        element.click();
      }
    }
  }

  intervalTremorFalseCursor = setInterval(addTremorToFalseCursor, 200);
  document.addEventListener("mousemove", addMouseEvent);
  document.addEventListener("click", addClickEvent);
}
