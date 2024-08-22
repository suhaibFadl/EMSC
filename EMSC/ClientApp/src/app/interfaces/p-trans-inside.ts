import { Data } from "@angular/router";

export interface PTransInside {
  id?: number;
  patientId: number;
  userId: string;
  patientName: string;
  passportNo: string;
  letterDate: Date;
  nationalNo: number;
  attach: string;
  letterDest: number;
  letterIndexNO: string;
  plcTreatment: number;
  replyState: string;
  hospitalId: number;
  hospName: string;
  UserDate: Date;
  branchId: number;
  name: string;
  userName: string;
  medicalDiagnosis: string;
  reply: string;
  ReplyState: number;
  phoneNumber: string;
  entryDate: Data;

}
