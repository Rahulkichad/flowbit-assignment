import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

// Get top 10 vendors by spend
router.get('/top10', async (req, res) => {
  try {
    const vendorSpend = await prisma.invoice.groupBy({
      by: ['vendorId'],
      where: {
        vendorId: {
          not: null
        }
      },
      _sum: {
        invoiceTotal: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          invoiceTotal: 'desc'
        }
      },
      take: 10
    });

    // Get vendor details
    const vendorIds = vendorSpend.map(v => v.vendorId).filter(Boolean) as string[];
    const vendors = await prisma.vendor.findMany({
      where: {
        id: {
          in: vendorIds
        }
      }
    });

    const vendorMap = new Map(vendors.map(v => [v.id, v]));

    const top10 = vendorSpend.map(v => ({
      vendorId: v.vendorId,
      vendorName: vendorMap.get(v.vendorId!)?.name || 'Unknown',
      totalSpend: Math.round((v._sum.invoiceTotal || 0) * 100) / 100,
      invoiceCount: v._count.id
    }));

    res.json(top10);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
