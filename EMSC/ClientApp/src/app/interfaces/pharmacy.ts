export interface Pharmacy {
  id: number;
  medArName: string;
  medEnName: string;

  pharmacyName: string;
  personAttach: string;

  patientId: number;
  medId: number;
  requestedQuantity: number;
  orderState: number;
  dispensedQuantity: number;
  requestDate: string;
  dispensDate: string;
  dispensedAttach: string;
  mangDispensDate: string;
  mangDispensedAttach: string;
  notes: string;
  letterIndex: string;
  firstOpened: number;


  userId: string;
  userDate: string;
  prePrice: string;
  preDays: string;
  preDate: Date;
  phId: number;

  patientName: string;
  passportNo: string;
  letterDate: Date;
  nationalNo: number;
  letterIndexNO: string;
  letterType: number;

}
