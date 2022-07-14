import {
  SplitEntry,
  SplitTypeOptions,
  SplitOptions,
  SplitResult
} from './interfaces'

import { ParameterError } from './errors'

export * from './errors'
export * from './interfaces'

const getNumbericEnum = (item: SplitTypeOptions) => {
  switch (item) {
    case SplitTypeOptions.FLAT: {
      return 2
    }

    case SplitTypeOptions.PERCENTAGE: {
      return 1
    }

    default: {
      return 0
    }
  }
}

/*
1. FLAT types should be computed before PERCENTAGE OR RATIO types
2. PERCENTAGE types should be computed before RATIO types.
3. RATIO types should always be computed last.
*/

const weightedSort = (data: SplitEntry[]): SplitEntry[] => {
  return data.sort((a, b) => {
    const computedValueA = getNumbericEnum(a.SplitType)
    const computedValueB = getNumbericEnum(b.SplitType)

    return computedValueA > computedValueB ? -1 : 1
  })
}

export function calculateSplit(options: SplitOptions): SplitResult {
  // handle parameter check

  let NormalBalance = options.Amount
  let RatioBalance = 0

  const sortedData = weightedSort(options.SplitInfo)

  const totalRatios = sortedData
    .filter((e) => e.SplitType === SplitTypeOptions.RATIO)
    .map((v) => v.SplitValue)
    .reduce((a, v) => a + v, 0)

  const SplitBreakdown = sortedData
    .map((entry) => {
      switch (entry.SplitType) {
        case SplitTypeOptions.FLAT: {
          NormalBalance = NormalBalance - entry.SplitValue

          return {
            SplitEntityId: entry.SplitEntityId,
            Amount: entry.SplitValue
          }
        }

        case SplitTypeOptions.PERCENTAGE: {
          const splitAmount = (entry.SplitValue / 100) * NormalBalance
          NormalBalance = NormalBalance - splitAmount

          return {
            SplitEntityId: entry.SplitEntityId,
            Amount: splitAmount
          }
        }

        case SplitTypeOptions.RATIO: {
          const splitAmount = (entry.SplitValue / totalRatios) * NormalBalance
          RatioBalance = RatioBalance + splitAmount

          return {
            SplitEntityId: entry.SplitEntityId,
            Amount: splitAmount
          }
        }

        default: {
          break
        }
      }

      return null
    })
    .filter((e) => e !== null) as SplitResult['SplitBreakdown']

  const isEntityLess = SplitBreakdown.every((e) => e.Amount < 0)

  if (isEntityLess) {
    throw new ParameterError(
      'The split amount value computed for each entity cannot be lesser than 0.'
    )
  }

  const isEntityGreater = SplitBreakdown.every((e) => e.Amount > options.Amount)

  if (isEntityGreater) {
    throw new ParameterError(
      'The split amount value computed for each entity cannot be greater than the transaction amount.'
    )
  }

  const Balance = NormalBalance - RatioBalance

  if (Balance < 0) {
    throw new ParameterError('Balance is less than 0')
  }

  const finalSplitAmount = SplitBreakdown.map((v) => v.Amount).reduce(
    (a, v) => a + v
  )

  if (finalSplitAmount > options.Amount) {
    throw new ParameterError(
      'The sum of all split Amount values computed cannot be greated than the transaction Amount'
    )
  }

  return {
    ID: options.ID,
    Balance,
    SplitBreakdown
  }
}
