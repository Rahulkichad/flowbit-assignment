import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  const { page = '1', per_page = '25', q } = req.query;
  const pageNum = parseInt(page as string, 10);
  const perPageNum = parseInt(per_page as string, 10);

  const where: any = {};
  if (q) {
    where.OR = [
      { invoiceIdText: { contains: q as string, mode: 'insensitive' } },
      { vendor: { name: { contains: q as string, mode: 'insensitive' } } }
    ];
  }

  try {
    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { vendor: true, customer: true },
        skip: (pageNum - 1) * perPageNum,
        take: perPageNum,
        orderBy: { invoiceDate: 'desc' }
      }),
      prisma.invoice.count({ where })
    ]);
    res.json({ items, total, page: pageNum, per_page: perPageNum });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
