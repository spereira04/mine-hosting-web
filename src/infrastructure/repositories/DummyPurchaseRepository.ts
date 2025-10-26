import type { PurchaseRepository } from '@domain/repositories/PurchaseRepository';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export class DummyPurchaseRepository implements PurchaseRepository {

  async purchase(): Promise<void> {
    await sleep(400);
    return new Promise();
  }
}