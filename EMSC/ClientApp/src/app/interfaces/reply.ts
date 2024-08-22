import { Data } from "ngx-bootstrap/positioning/models";

export interface Reply {
  id?: number;
  patientId: number;
  trId: number;
  plcTreatment: number;
  reply: string;
  patientName: string;
  passportNo: string;
  userId: string;
  nationalNo: number;
  replyState: number;
  ReplyState: number;
  country: string;
  userDate: Date;
  replyDate: Date;
  phoneNumber: string;
  hospName: string;
  entryDate: Data;
}
