import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    // Get all invoices with their payments
    // We need to calculate due dates even when not explicitly set
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceTotal: {
          not: null
        }
      },
      include: {
        payment: true
      }
    });

    // Group by due date ranges: 0-7 days, 8-30 days, 31-60 days, 60+ days
    const rangeOutflow: Record<string, number> = {
      '0-7 days': 0,
      '8-30 days': 0,
      '31-60 days': 0,
      '60+ days': 0
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day

    invoices.forEach(invoice => {
      const invoiceTotal = invoice.invoiceTotal || 0;
      if (invoiceTotal <= 0) return;

      let dueDate: Date | null = null;

      // Priority 1: Use explicit dueDate from payment
      if (invoice.payment?.dueDate) {
        dueDate = new Date(invoice.payment.dueDate);
      } 
      // Priority 2: Calculate from invoiceDate + netDays (if payment record exists)
      else if (invoice.invoiceDate && invoice.payment?.netDays != null && invoice.payment.netDays > 0) {
        dueDate = new Date(invoice.invoiceDate);
        dueDate.setDate(dueDate.getDate() + invoice.payment.netDays);
      }
      // Priority 3: Calculate from invoiceDate + paymentTerms (parse if string like "Net 30")
      else if (invoice.invoiceDate && invoice.payment?.paymentTerms) {
        const paymentTerms = invoice.payment.paymentTerms;
        // Try to extract number from terms like "Net 30", "30 days", etc.
        const netDaysMatch = paymentTerms.match(/(\d+)/);
        const netDays = netDaysMatch ? parseInt(netDaysMatch[1]) : 30;
        dueDate = new Date(invoice.invoiceDate);
        dueDate.setDate(dueDate.getDate() + netDays);
      }
      // Priority 4: Default to invoiceDate + 30 days (common business practice)
      else if (invoice.invoiceDate) {
        dueDate = new Date(invoice.invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30);
      }
      // Priority 5: If no invoiceDate, use createdAt + 30 days as fallback
      else if (invoice.createdAt) {
        dueDate = new Date(invoice.createdAt);
        dueDate.setDate(dueDate.getDate() + 30);
      }

      if (dueDate) {
        dueDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const diffDays = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Categorize into date ranges
        // Past due (negative) and very soon (0-7 days) go into first bucket
        if (diffDays <= 7) {
          rangeOutflow['0-7 days'] += invoiceTotal;
        } else if (diffDays >= 8 && diffDays <= 30) {
          rangeOutflow['8-30 days'] += invoiceTotal;
        } else if (diffDays >= 31 && diffDays <= 60) {
          rangeOutflow['31-60 days'] += invoiceTotal;
        } else if (diffDays > 60) {
          rangeOutflow['60+ days'] += invoiceTotal;
        }
      }
    });

    // Convert to array in the correct order
    const forecast = [
      { period: '0-7 days', amount: Math.round(rangeOutflow['0-7 days'] * 100) / 100 },
      { period: '8-30 days', amount: Math.round(rangeOutflow['8-30 days'] * 100) / 100 },
      { period: '31-60 days', amount: Math.round(rangeOutflow['31-60 days'] * 100) / 100 },
      { period: '60+ days', amount: Math.round(rangeOutflow['60+ days'] * 100) / 100 }
    ];

    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
