import type { PurchaseRepository } from '@domain/repositories/PurchaseRepository';
import { api } from '@infrastructure/http/axiosClient';

export class HttpPurchaseRepository implements PurchaseRepository {

  /* TODO ver como hacemos con las compras via http */
  async purchase(): Promise<void> {
    const { data } = await api.get('/purchase');
    return data;
  }
}
