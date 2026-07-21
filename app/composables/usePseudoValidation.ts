/*
Software Name: Tota11ylost
SPDX-FileCopyrightText: Copyright (c) Orange SA
SPDX-License-Identifier: AGPL-3.0-or-later
*/

const PSEUDO_MIN_LENGTH = 3
const PSEUDO_MAX_LENGTH = 20

// ============================================================
// PROFANITY DETECTION - TWO-LEVEL SYSTEM
// ============================================================
//
// LEVEL 1 — "BOUNDARY_WORDS" (short/ambiguous, 2-4 letters)
//   Words that commonly appear inside legitimate words (e.g. "ass" in "massy", "dick" in "dickinson").
//   These are ONLY blocked if they appear as a standalone segment:
//     - At the start/end of the string
//     - Surrounded by non-alpha characters (digits, underscores, hyphens, spaces)
//   Example: "massy" → OK | "ass123" → BLOCKED | "_ass_" → BLOCKED
//
// LEVEL 2 — "PROFANITY_WORDS" (long/specific, 5+ letters or unambiguous)
//   Words that virtually never appear in legitimate words.
//   These are blocked via simple substring match (as before).
//   Example: "xxhitlerxx" → BLOCKED | "jesuisunebite" → BLOCKED
// ============================================================

const BOUNDARY_WORDS = [
  // English short
  'ass', '@ss', '4ss', '455',
  'cum', 'c_m',
  'cock', 'c0ck', 'c@ck',
  'cunt', 'c_nt', 'c4nt', 'cun7',
  'dick', 'd1ck', 'd!ck',
  'fag', 'f@g',
  'tit', 'tits', 't1ts',
  'nip',
  'hoe', 'h0e',
  'nig',
  'piss', 'p1ss', 'p!ss',
  'damn', 'd@mn', 'd4mn',
  'hell',
  'anal', '@nal', '4n4l',
  'anus', '@nus',
  'butt',
  'clit',
  'jizz', 'j1zz',
  'twat', 'tw@t', 'tw4t',
  'wank',
  'nude',
  'sex', 's3x', 's€x',
  'xxx',
  'rape', 'r@pe', 'r4p3',
  // French short
  'con', 'c0n',
  'cul',
  'pd',
  'tg',
  'ntm',
  'fdp',
  'nase', 'naze',
  'pouf', 'p0uf',
  'niac', 'n1ac',
  'pute', 'pu7e', 'put3', 'pu73',
  // Spanish short
  'puta', 'put@', 'pu74',
  'coño', 'c0ñ0', 'c0no', 'c@no',
]

const PROFANITY_WORDS = [
  // Historical figures / hate symbols
  'hitler', 'h1tler', 'h!tler', 'hitl3r',
  'nazi', 'naz1', 'n4z1', 'n@zi', 'neonazi',
  'mussolini', 'muss0lini', 'mus50lini',
  'stalin', 'st4l1n', 'st@l1n',
  'swastika', 'svastika',

  // English profanity & insults
  'shit', 'sh1t', 'sh!t', 'sheit', 'sh17', 'shitty',
  'fuck', 'f_ck', 'f4ck', 'fuk', 'fck', 'phuck', 'phuk', 'fuckin', 'fucking', 'fucked', 'motherfucker',
  'asshole', '@ssh0le', '4ssh0l3', 'arsehole',
  'assmunch',
  'bitch', 'b1tch', 'b!tch', 'b17ch', 'bitches',
  'whore', 'wh0re', 'wh0r3', 'hooker',
  'slut', 's1ut', 's1_t', 'sl_t',
  'bastard', 'b@st@rd', 'b4st4rd', 'bast4rd', 'bastardo',
  'dipshit', 'd1psh1t', 'dips_it', 'bullshit', 'apeshit',
  'dildo',
  'nigger', 'n1gger', 'n!gger', 'nigg3r', 'n1gg3r', 'nigga', 'n1gga',
  'faggot', 'f@ggot', 'f4gg0t',
  'retard', 'r3tard', 'r3t4rd',
  'wanker', 'w@nker', 'w4nk3r',
  'bollocks', 'b0ll0cks',
  'blowjob', 'bl0wj0b', 'handjob',
  'tosser', 'tranny',
  'pissing', 'pisspig',

  // English - Body parts / sexual
  'boob', 'boobs', 'b00bs',
  'titty', 'titties', 't1tty',
  'nipple', 'nipples', 'n1pple',
  'pussy', 'pu55y', 'puss1',
  'penis', 'p3n1s', 'p3nis',
  'vagina', 'v@gina', 'v4g1na',
  'vulva',
  'clitoris',
  'butthole', 'buttcheeks',
  'booty', 'b00ty',
  'genitals',

  // English - Sexual acts / content
  'cumming',
  'orgasm', '0rgasm',
  'ejaculation',
  'masturbate', 'masturb',
  'erotic', 'erotism',
  'boner', 'b0ner',
  'horny', 'h0rny',
  'hentai', 'h3ntai',
  'milf', 'm1lf',
  'orgy', '0rgy',
  'threesome', 'thr33some',
  'bondage', 'b0ndage',
  'bdsm',
  'fetish', 'f3tish',
  'kinky', 'k1nky',
  'grope', 'gr0pe',
  'sodomize', 'sodomy', 's0domy',
  'rimjob', 'rimming',
  'fisting', 'f1sting',
  'deepthroat',
  'creampie',
  'bukkake',
  'semen', 's3men',
  'spunk',
  'snatch',
  'sexo',

  // English - Slurs / hate speech
  'coon', 'coons', 'c00n',
  'darkie', 'd@rkie',
  'beaner', 'beaners',
  'kike', 'k1ke',
  'spic', 'sp1c',
  'wetback', 'w3tback',
  'honkey', 'h0nkey',
  'raghead', 'r@ghead',
  'towelhead',
  'slanteye',
  'paki', 'p@ki',
  'jigaboo',

  // English - Porn / adult content
  'porn', 'p0rn', 'p@rn', 'porno', 'pornography',
  'nudity',
  'topless',
  'sexy', 's3xy',
  'escort',
  'smut',
  'playboy',
  'camgirl', 'camslut', 'camwhore',
  'lolita',
  'jailbait',
  'upskirt',
  'voyeur',
  'shemale',
  'busty',

  // English - Dangerous / criminal
  'raping', 'rapist',
  'pedophile', 'paedophile', 'p3dophile',
  'incest', '1ncest',
  'bestiality',
  'zoophilia',

  // French profanity & insults
  'putain', 'put@1n', 'puta1n', 'pu74in', 'put1n', 'putin',
  'salaud', 's@l@ud', 's4l4ud', 'sal0', 'salau',
  'connard', 'conn@rd', 'c0nn@rd', 'conn4rd', 'connar', 'connarde',
  'connasse', 'conn@sse', 'c0nn@sse', 'conasse', 'conne',
  'foutre', 'f0utre', 'f@utre', 'fouteur',
  'merde', 'm3rd3', 'm3rd', 'm€rde', 'merd3', 'merdeux', 'merdouillard',
  'bordel', 'b0rdel', 'b@rdel', 'bord3l',
  'salope', 's@l0pe', 's4l0p3', 'sal0pe', 'salop', 'salopard', 'saloperie',
  'pouffiasse', 'p0uff1@sse', 'pouf1asse', 'poufiasse',
  'enculé', 'encule', 'enculer', 'enc_le', '3ncul3', 'encu1e', 'enku1e', 'enkule', 'enculeur',
  'enfoiré', 'enfoire', 'enf0iré', 'enf0ir3', 'enf0ire', 'enfoi', 'enf01re',
  'enflure', 'enflur3',
  'baise', 'b@ise', 'b41se', 'baiser', 'b@iser', 'bais3r',
  'pédé', 'pede', 'p3d3', 'p3d€', 'péd3', 'p€d€', 'ped3',
  'pédale', 'pedale', 'p3dale',
  'petasse', 'pétasse', 'pet@sse', 'p3tasse', 'p3t@sse', 'péteux',
  'negro', 'négro', 'n3gro', 'n€gro',
  'nègre', 'negre', 'n3gre', 'n€gre', 'naigre',
  'noirot', 'n0irot',
  'tapette', 'tap3tte', 't@pette', 'tapet7e',
  'gouine', 'g0uine', 'gou1ne',
  'tantouse', 'tantouz', 'tant0use', 'tantouze', 'tantouserie',
  'branleur', 'branl3ur', 'br@nleur', 'branler',
  'couille', 'cou1lle', 'c0uille', 'couilles', 'couillon', 'couillonner',
  'chier', 'ch1er', 'ch!er', 'chieur', 'chieurs', 'chiennasse',
  'nique', 'n1que', 'n!que', 'niquer', 'n1k', 'nik', 'niker', 'niakoué',
  'niqtm',
  'filsdepute',
  'trou du cul', 'trouduc',
  'abruti', '@brut1', '4bruti',
  'crétin', 'cretin', 'cr3tin',
  'débile', 'debile', 'd3bile',
  'bouffon', 'bouf0n', 'b0uffon',
  'ta gueule', 'tagueule', 'ferme ta gueule',
  'casse toi', 'cassetoi',
  'batard', 'bâtard', 'b@tard', 'b4tard', 'batar',

  // French - Additional insults
  'bite', 'b1te', 'b!te',
  'andouille', '@ndouille',
  'avorton', '@vorton',
  'biatch', 'b!atch',
  'bicot', 'b1cot', 'b!cot',
  'bougnoul', 'bougnoule', 'bougnouliser',
  'bougre', 'b0ugre',
  'bouseux', 'b0useux',
  'branque', 'br@nque',
  'casse-couille', 'casse-couilles',
  'cafre', 'c@fre',
  'caldoche', 'c@ldoche',
  'chinetoc', 'chinetoque', 'chintok',
  'chleuh', 'schleu',
  'chnoque', 'schn0que', 'schnock',
  'crevard', 'crevure',
  'déguelasse', 'deguelasse',
  'emmerder', 'emmerdeur', 'emmerdeuse',
  'empafé', 'empafe',
  'espingoin',
  'étron', 'etron',
  'feignasse', 'f3ignasse',
  'fiotte', 'f1otte',
  'fritz',
  'fumier', 'fum1er',
  'garce', 'g@rce',
  'gaupe', 'g@upe',
  'gland', 'glandu', 'glandeur', 'glandeuse',
  'gogol', 'g0gol',
  'gourgandine',
  'grognasse', 'grogn@sse',
  'imbécile', 'imbecile', '1mbecile',
  'jean-foutre',
  'lopette', 'l0pette',
  'lavette', 'l@vette',
  'mange-merde',
  'mauviette',
  'michto', 'm1chto',
  'minable', 'm1nable',
  'minus', 'm1nus',
  'misérable', 'miserable',
  'moins-que-rien',
  'moricaud', 'mor1caud',
  'niaiseux',
  'pignouf', 'p1gnouf',
  'pimbêche', 'pimbêch3',
  'pisseux', 'piss3ux', 'pissou',
  'pleutre',
  'plouc', 'pl0uc',
  'porcasse',
  'poucav', 'p0ucav',
  'pourriture', 'pourritur3',
  'punaise', 'puna1se',
  'queutard', 'qu3utard',
  'raclure', 'r@clure',
  'raton', 'r@ton',
  'rosbif', 'r0sbif',
  'roulure', 'r0ulure',
  'sagouin', 'sag0uin',
  'satrouille', 'satr0uille',
  'sous-merde',
  'tafiole', 'taf1ole',
  'tarlouze', 'tarl0uze',
  'tocard', 't0card',
  'traînée', 'trainee', 'tra1nee',
  'truiasse', 'tru1asse',
  'vaurien', 'v@urien',
  'youpin', 'youpine',

  // Spanish profanity
  'mierda', 'm13rd@', 'm1erd4',
  'cabrón', 'cabron', 'cabr0n', 'c@br0n',
  'pendejo', 'p3nd3j0', 'p€nd€j0',
  'verga', 'v3rg@', 'v€rg@',
  'chingar', 'ch1ng@r', 'ch!ng@r',
  'joder', 'j0d3r', 'j0d€r',
  'gilipollas', 'g1l1p0ll@s', 'g!l!p0ll@s',
  'hostia', 'h0st1@', 'h@st1@',
  'maricón', 'maricon', 'mar1c0n',
  'zorra', 'z0rra', 'z0rr@',
  'culero', 'cul3ro', 'cul€ro',
  'mamón', 'mamon', 'mam0n',
]

type PseudoError = 'tooShort' | 'profanity' | null

export const usePseudoValidation = () => {
  const validatePseudo = (pseudo: string): PseudoError => {
    const trimmed = pseudo.trim()

    if (trimmed.length < PSEUDO_MIN_LENGTH) {
      return 'tooShort'
    }

    const pseudoLower = trimmed.toLowerCase()

    // Level 1: Boundary words — only block if NOT embedded inside a larger alphabetic word
    for (const word of BOUNDARY_WORDS) {
      const index = pseudoLower.indexOf(word)
      if (index !== -1) {
        const charBefore = index > 0 ? pseudoLower[index - 1] : ''
        const charAfter = index + word.length < pseudoLower.length ? pseudoLower[index + word.length] : ''
        const letterBefore = /[a-zà-ÿ]/.test(charBefore!)
        const letterAfter = /[a-zà-ÿ]/.test(charAfter!)

        if (!letterBefore && !letterAfter) {
          return 'profanity'
        }
      }
    }

    // Level 2: Specific words — always block via substring match
    for (const word of PROFANITY_WORDS) {
      if (pseudoLower.includes(word)) {
        return 'profanity'
      }
    }

    return null
  }

  /**
   * Returns the translation key for a given error code
   */
  const getPseudoErrorMessage = (errorCode: PseudoError): string => {
    switch (errorCode) {
      case 'tooShort':
        return 'welcome.errorPseudoTooShort'
      case 'profanity':
        return 'welcome.errorPseudoProfanity'
      default:
        return ''
    }
  }

  return {
    PSEUDO_MIN_LENGTH,
    PSEUDO_MAX_LENGTH,
    validatePseudo,
    getPseudoErrorMessage,
  }
}
