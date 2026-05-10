import { IInspectionRepository } from '../../domain/repositories/IInspectionRepository';
import { Inspection } from '../../domain/entities/Inspection';

export class InMemoryInspectionRepository implements IInspectionRepository {
  private inspections: Inspection[] = [];

  async save(inspection: Inspection): Promise<void> {
    this.inspections.push(inspection);
  }

  async findById(id: string): Promise<Inspection | null> {
    const inspection = this.inspections.find(i => i.id === id);
    return inspection || null;
  }

  async findByUserId(userId: string): Promise<Inspection[]> {
    return this.inspections.filter(i => i.requestedBy === userId);
  }

  async update(inspection: Inspection): Promise<void> {
    const index = this.inspections.findIndex(i => i.id === inspection.id);
    if (index !== -1) {
      this.inspections[index] = inspection;
    }
  }
}
