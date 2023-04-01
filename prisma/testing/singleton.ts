import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

import prisma from './client';

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  mockReset(prismaMock);
});

export const prismaMock: any = prisma as unknown as DeepMockProxy<PrismaClient>;
