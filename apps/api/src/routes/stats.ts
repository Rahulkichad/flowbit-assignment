import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const totalSpend = await prisma.invoice.aggregate({
      _sum: { invoiceTotal: true },
      where: {}
    });
    const invoicesProcessed = await prisma.invoice.count();
    const documentsUploaded = await prisma.document.count();
    const avgInvoice = await prisma.invoice.aggregate({ _avg: { invoiceTotal: true } });

    res.json({
      totalSpend: totalSpend._sum.invoiceTotal ?? 0,
      invoicesProcessed,
      documentsUploaded,
      avgInvoiceValue: avgInvoice._avg.invoiceTotal ?? 0
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
