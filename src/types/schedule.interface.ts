export interface ISchedule {
  id: string;
  startDateTime: Date;
  endDateTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctorSchedule {
  scheduleId: string;
  doctorId: string;
  isBooked: boolean;
  appointmentId?: string;
  createdAt: string;
  updatedAt: string;
  schedule?: ISchedule;
}
