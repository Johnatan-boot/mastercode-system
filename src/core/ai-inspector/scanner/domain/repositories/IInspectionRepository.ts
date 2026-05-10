import { Inspection } from '../entities/Inspection';

export interface IInspectionRepository {
  save(inspection: Inspection): Promise<void>;
  findById(id: string): Promise<Inspection | null>;
  findByUserId(userId: string): Promise<Inspection[]>;
  update(inspection: Inspection): Promise<void>;
}
