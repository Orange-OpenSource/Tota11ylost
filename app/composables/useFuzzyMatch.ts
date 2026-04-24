// SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i]![0] = i
  for (let j = 0; j <= n; j++) dp[0]![j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i]![j] = a[i - 1] === b[j - 1]
        ? dp[i - 1]![j - 1]!
        : 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!)
    }
  }
  return dp[m]![n]!
}

export function isFuzzyMatch(input: string, target: string, maxRatio = 0.25): boolean {
  const targetNumbers = target.match(/\d+/g)
  if (targetNumbers) {
    const inputNumbers: string[] = input.match(/\d+/g) ?? []
    if (!targetNumbers.every(num => inputNumbers.includes(num))) return false
  }
  if (input.includes(target)) return true
  const distance = levenshtein(input, target)
  return distance / Math.max(target.length, 1) <= maxRatio
}
