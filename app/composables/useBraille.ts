// Tota11y Lost - Braille Tools Composable
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Orange SA
// Based on braille-tools by Olivier Giulieri (MIT)

export function useBraille() {
  function brailleChar(bPix: string): string {
    return `<div class="br br-${bPix}"></div>`
  }

  function toBraille(message: string): string {
    let txt = ''
    let prevCharNum = false
    let inQuote = false

    for (let i = 0;
      i < message.length;
      i++) {
      const myChar = message.charAt(i)

      if (myChar >= 'a' && myChar <= 'z') {
        txt += brailleChar(myChar)
        prevCharNum = false
      }
      else if (myChar >= 'A' && myChar <= 'Z') {
        txt += brailleChar('cap') + brailleChar(myChar)
        prevCharNum = false
      }
      else if (myChar > '0' && myChar <= '9') {
        if (!prevCharNum) txt += brailleChar('num')
        txt += brailleChar(String.fromCharCode(myChar.charCodeAt(0) + 48))
        prevCharNum = true
      }
      else {
        switch (myChar) {
          case ' ': txt += brailleChar('sp')
            prevCharNum = false
            break
          case '0':
            if (!prevCharNum) txt += brailleChar('num')
            txt += brailleChar('j')
            prevCharNum = true
            break
          case '\n': txt += '<br><br>'
            prevCharNum = false
            break
          case '.':
            txt += brailleChar(prevCharNum ? 'dec' : 'period')
            break
          case ',': txt += brailleChar('comma')
            prevCharNum = false
            break
          case '?': txt += brailleChar('qu')
            prevCharNum = false
            break
          case '!': txt += brailleChar('ex')
            prevCharNum = false
            break
          case ':': txt += brailleChar('col')
            prevCharNum = false
            break
          case ';': txt += brailleChar('sc')
            prevCharNum = false
            break
          case '\'':
            txt += brailleChar(inQuote ? 'qc' : 'qo')
            inQuote = !inQuote
            prevCharNum = false
            break
          case '(': case ')':
            txt += brailleChar('par')
            prevCharNum = false
            break
          default: prevCharNum = false
        }
      }
    }
    return txt
  }

  return { toBraille }
}
