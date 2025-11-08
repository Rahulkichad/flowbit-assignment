import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type AnyObj = Record<string, any>;

function asDate(v: any): Date | null {
  if (!v) return null;
  if (typeof v === 'string') return new Date(v);
  if (typeof v === 'object' && v.$date) return new Date(v.$date);
  return null;
}

function asNumber(v: any): number | null {
  if (v === '' || v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return Number(v);
  if (typeof v === 'object' && v.$numberLong) return Number(v.$numberLong);
  return null;
}

function get(obj: AnyObj, pathStr: string): any {
  return pathStr.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

async function main() {
  const fileArgIndex = process.argv.findIndex(a => a === '--file');
  const filePath = fileArgIndex > -1 ? process.argv[fileArgIndex + 1] : '../../data/Analytics_Test_Data.json';
  const abs = path.resolve(__dirname, filePath);
  const raw = fs.readFileSync(abs, 'utf-8');
  const items: AnyObj[] = JSON.parse(raw);

  for (const item of items) {
    const id: string = item._id || item.id;
    const fileName: string | undefined = item.name;
    const fileType: string | undefined = item.fileType;
    const filePathUrl: string | undefined = item.filePath;
    const fileSize = asNumber(item.fileSize);
    const status: string | undefined = item.status;
    const createdAt = asDate(item.createdAt) || asDate(item.metadata?.uploadedAt) || new Date();
    const processedAt = asDate(item.processedAt);

    const llm = item.extractedData?.llmData || {};

    const vendorName = get(llm, 'vendor.value.vendorName.value');
    const vendorPartyNumber = get(llm, 'vendor.value.vendorPartyNumber.value');
    const vendorAddress = get(llm, 'vendor.value.vendorAddress.value');
    const vendorTaxId = get(llm, 'vendor.value.vendorTaxId.value');

    const customerName = get(llm, 'customer.value.customerName.value');
    const customerAddress = get(llm, 'customer.value.customerAddress.value');

    const invoiceIdText = get(llm, 'invoice.value.invoiceId.value');
    const invoiceDate = asDate(get(llm, 'invoice.value.invoiceDate.value'));
    const deliveryDate = asDate(get(llm, 'invoice.value.deliveryDate.value'));

    const subTotal = asNumber(get(llm, 'summary.value.subTotal.value'));
    const totalTax = asNumber(get(llm, 'summary.value.totalTax.value'));
    const invoiceTotal = asNumber(get(llm, 'summary.value.invoiceTotal.value'));
    const documentType = get(llm, 'summary.value.documentType') || get(llm, 'summary.value.documentType.value');
    const currency = get(llm, 'summary.value.currencySymbol') || get(llm, 'summary.value.currencySymbol.value');

    const paymentDueDate = asDate(get(llm, 'payment.value.dueDate.value') ?? get(llm, 'payment.value.dueDate'));
    const paymentTerms = get(llm, 'payment.value.paymentTerms.value') ?? get(llm, 'payment.value.paymentTerms');
    const bankAccount = get(llm, 'payment.value.bankAccountNumber.value') ?? get(llm, 'payment.value.bankAccountNumber');
    const bic = get(llm, 'payment.value.BIC.value') ?? get(llm, 'payment.value.BIC');
    const accountName = get(llm, 'payment.value.accountName.value') ?? get(llm, 'payment.value.accountName');
    const netDays = asNumber(get(llm, 'payment.value.netDays.value') ?? get(llm, 'payment.value.netDays'));
    const discountPercentage = asNumber(get(llm, 'payment.value.discountPercentage.value') ?? get(llm, 'payment.value.discountPercentage'));
    const discountDays = asNumber(get(llm, 'payment.value.discountDays.value') ?? get(llm, 'payment.value.discountDays'));
    const discountedTotal = asNumber(get(llm, 'payment.value.discountedTotal.value') ?? get(llm, 'payment.value.discountedTotal'));

    let vendorId: string | null = null;
    if (vendorName) {
      const vendor = await prisma.vendor.upsert({
        where: { name: vendorName },
        update: { partyNumber: vendorPartyNumber ?? undefined, address: vendorAddress ?? undefined, taxId: vendorTaxId ?? undefined },
        create: { name: vendorName, partyNumber: vendorPartyNumber ?? undefined, address: vendorAddress ?? undefined, taxId: vendorTaxId ?? undefined },
      });
      vendorId = vendor.id;
    }

    let customerId: string | null = null;
    if (customerName || customerAddress) {
      const customer = await prisma.customer.create({
        data: { name: customerName ?? null, address: customerAddress ?? null },
      });
      customerId = customer.id;
    }

    const document = await prisma.document.upsert({
      where: { id },
      update: {
        fileName: fileName ?? null,
        filePath: filePathUrl ?? null,
        fileSize: fileSize != null ? BigInt(Math.trunc(fileSize)) : null,
        fileType: fileType ?? null,
        status: status ?? null,
        metadata: item.metadata ?? null,
        rawJson: item.extractedData ?? null,
        processedAt: processedAt ?? null,
      },
      create: {
        id,
        fileName: fileName ?? null,
        filePath: filePathUrl ?? null,
        fileSize: fileSize != null ? BigInt(Math.trunc(fileSize)) : null,
        fileType: fileType ?? null,
        status: status ?? null,
        metadata: item.metadata ?? null,
        rawJson: item.extractedData ?? null,
        processedAt: processedAt ?? null,
        createdAt: createdAt,
      },
    });

    const invoice = await prisma.invoice.create({
      data: {
        analyticsDocumentId: document.id,
        invoiceIdText: invoiceIdText ?? null,
        invoiceDate: invoiceDate ?? null,
        deliveryDate: deliveryDate ?? null,
        subtotal: subTotal ?? null,
        totalTax: totalTax ?? null,
        invoiceTotal: invoiceTotal ?? null,
        currency: currency ?? null,
        documentType: documentType ?? null,
        vendorId: vendorId ?? null,
        customerId: customerId ?? null,
      },
    });

    const itemsArr: any[] = get(llm, 'lineItems.value.items.value') || get(llm, 'lineItems.value.items') || [];

    for (const it of itemsArr) {
      const srNo = asNumber(get(it, 'srNo.value') ?? get(it, 'srNo'));
      const description = get(it, 'description.value') ?? get(it, 'description');
      const quantity = asNumber(get(it, 'quantity.value') ?? get(it, 'quantity'));
      const unitPrice = asNumber(get(it, 'unitPrice.value') ?? get(it, 'unitPrice'));
      const totalPrice = asNumber(get(it, 'totalPrice.value') ?? get(it, 'totalPrice'));
      const sachkonto = String(get(it, 'Sachkonto.value') ?? get(it, 'Sachkonto') ?? '');
      const bus = String(get(it, 'BUSchluessel.value') ?? get(it, 'BUSchluessel') ?? '');
      const vatRate = asNumber(get(it, 'vatRate.value') ?? get(it, 'vatRate'));
      const vatAmount = asNumber(get(it, 'vatAmount.value') ?? get(it, 'vatAmount'));

      await prisma.invoiceLineItem.create({
        data: {
          invoiceId: invoice.id,
          srNo: srNo ?? null,
          description: description ?? null,
          quantity: quantity ?? null,
          unitPrice: unitPrice ?? null,
          totalPrice: totalPrice ?? null,
          sachkonto: sachkonto || null,
          buschluessel: bus || null,
          vatRate: vatRate ?? null,
          vatAmount: vatAmount ?? null,
        },
      });
    }

    if (
      paymentDueDate ||
      paymentTerms ||
      bankAccount ||
      bic ||
      accountName ||
      netDays != null ||
      discountPercentage != null ||
      discountDays != null ||
      discountedTotal != null
    ) {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          dueDate: paymentDueDate ?? null,
          paymentTerms: paymentTerms ?? null,
          bankAccount: bankAccount ?? null,
          bic: bic ?? null,
          accountName: accountName ?? null,
          netDays: netDays != null ? Math.trunc(netDays) : null,
          discountPercentage: discountPercentage ?? null,
          discountDays: discountDays != null ? Math.trunc(discountDays) : null,
          discountedTotal: discountedTotal ?? null,
        },
      });
    }

    process.stdout.write(`Imported document ${document.id} -> invoice ${invoice.id}\n`);
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
