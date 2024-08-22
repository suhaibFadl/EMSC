export interface Claim {
   
  id?: number
  , batchId: number
  , billNo: string
  , billDate: Date
  , entryDate: Date
  , exitDate: Date
  , claimType: number,
  claimTotal: string,
  allowed: string, rejected: string, trId: number,
  diagnosis: string, notes: string, userId: string, userDate: Date
}
