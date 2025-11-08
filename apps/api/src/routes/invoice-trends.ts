import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    // Get invoice trends for the last 12 months
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          not: null
        }
      },
      select: {
        invoiceDate: true,
        invoiceTotal: true
      },
      orderBy: {
        invoiceDate: 'asc'
      }
    });

    // Group by month
    const monthlyData: Record<string, { count: number; total: number }> = {};
    
    invoices.forEach(invoice => {
      if (invoice.invoiceDate) {
        const date = new Date(invoice.invoiceDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { count: 0, total: 0 };
        }
        
        monthlyData[monthKey].count += 1;
        monthlyData[monthKey].total += invoice.invoiceTotal || 0;
      }
    });

    // Convert to array and format
    const trends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        invoiceCount: data.count,
        totalSpend: Math.round(data.total * 100) / 100
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
