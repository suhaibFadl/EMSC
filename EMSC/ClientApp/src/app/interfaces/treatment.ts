export interface Treatment {
  id?: number;
  patientId: number;
  medical_Diagnosis: string;
  date_Diagnosis: Date;
  attach: string;
  UserId: string;
  UserDate: Date;
  trId: number;
  hospitalCountryId: number;
  hospitalId: number;
  hospitalName: string;
  patientName: string;
  passportNo: string;
  phoneNumber: string;
  nationalNo: number;
  treatment: number;
  hospName: number;
  fileStatus: number;
  closingDate: Date;
  fileState: number;
  notes: string;

}
