export interface HotelMovement {
  id?: number;
  patientId: number;
  trId: number;
  tpId: number;
  patientName: string;
  passportNo: string;
  nationalNo: number;
  hotelName: string;
  hotelId: string;
  entryDate: Date;
  leavingDate: Date;
  userId: string;
  userDate: Date;
  phoneNumber: string;
  attach: string;
  country: string;
  branchName: string;
}
