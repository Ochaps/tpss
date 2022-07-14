export enum SplitTypeOptions {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
  RATIO = 'RATIO'
}

export interface SplitEntry {
  SplitType: SplitTypeOptions
  SplitValue: number
  SplitEntityId: string
}

export interface SplitOptions {
  ID: number
  Amount: number
  Currency: string
  CustomerEmail: string
  SplitInfo: SplitEntry[]
}

export interface SplitResult {
  ID: SplitOptions['ID']
  Balance: number
  SplitBreakdown: {
    SplitEntityId: SplitEntry['SplitEntityId']
    Amount: number
  }[]
}
