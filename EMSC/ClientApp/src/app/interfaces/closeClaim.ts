export interface CloseClaim {
  id: number;
  billNo: string;
  claimType: number;
  diagnosis: string;
  exitDate: Date;
  billDate: Date;
  notes: string;
  trId: number;
}
