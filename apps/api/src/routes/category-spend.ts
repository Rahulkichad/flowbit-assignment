import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    // Get all line items with their categories (sachkonto)
    const lineItems = await prisma.invoiceLineItem.findMany({
      select: {
        sachkonto: true,
        totalPrice: true
      }
    });

    // Group by category
    const categoryMap: Record<string, number> = {};
    
    lineItems.forEach(item => {
      const category = item.sachkonto || 'Other';
      categoryMap[category] = (categoryMap[category] || 0) + (item.totalPrice || 0);
    });

    // Map sachkonto codes to readable categories
    const categoryNames: Record<string, string> = {
      '4000': 'Operations',
      '4100': 'Marketing',
      '4200': 'Facilities',
      '4300': 'IT & Software',
      '4400': 'Professional Services',
      '4500': 'Travel & Entertainment',
      '4600': 'Office Supplies',
      '4700': 'Utilities',
      '4800': 'Insurance',
      '4900': 'Other Expenses'
    };

    // Convert to array and sort by spend
    const categories = Object.entries(categoryMap)
      .map(([code, spend]) => ({
        category: categoryNames[code] || code || 'Other',
        spend: Math.round(spend * 100) / 100
      }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10); // Top 10 categories

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
