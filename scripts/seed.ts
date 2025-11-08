import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const file = path.resolve("../../data/Analytics_Test_Data.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const docs = Array.isArray(raw) ? raw : (raw.documents ?? raw.items ?? raw);

  console.log(`📦 Processing ${docs.length} documents...`);

  for (const doc of docs) {
    try {
      // Extract LLM data
      const llmData = doc?.extractedData?.llmData;

      // Create document record
      const document = await prisma.document.create({
        data: {
          analyticsId: doc.analyticsId ?? null,
          fileName: doc.name ?? null,
          filePath: doc.filePath ?? null,
          fileSize: doc.fileSize?.$numberLong ? BigInt(doc.fileSize.$numberLong) : null,
          fileType: doc.fileType ?? null,
          status: doc.status ?? null,
          metadata: doc.metadata ?? null,
          rawJson: doc,
          processedAt: doc.processedAt?.$date ? new Date(doc.processedAt.$date) : null,
        },
      });

      console.log(`✅ Created document: ${document.fileName}`);

      // --- Vendor handling ---
      const vendorData = llmData?.vendor?.value;
      const vendorName = vendorData?.vendorName?.value;

      let vendorRec = null;
      if (vendorName) {
        vendorRec = await prisma.vendor.findFirst({ 
          where: { name: vendorName } 
        });
        
        if (!vendorRec) {
          vendorRec = await prisma.vendor.create({
            data: {
              name: vendorName,
              partyNumber: vendorData?.vendorPartyNumber?.value || null,
              address: vendorData?.vendorAddress?.value || null,
              taxId: vendorData?.vendorTaxId?.value || null,
            },
          });
          console.log(`   ✅ Created vendor: ${vendorName}`);
        } else {
          console.log(`   ℹ️  Using existing vendor: ${vendorName}`);
        }
      }

      // --- Customer handling ---
      const customerData = llmData?.customer?.value;
      const customerName = customerData?.customerName?.value;

      let customerRec = null;
      if (customerName) {
        customerRec = await prisma.customer.findFirst({
          where: { name: customerName },
        });
        
        if (!customerRec) {
          customerRec = await prisma.customer.create({
            data: {
              name: customerName,
              address: customerData?.customerAddress?.value || null,
            },
          });
          console.log(`   ✅ Created customer: ${customerName}`);
        } else {
          console.log(`   ℹ️  Using existing customer: ${customerName}`);
        }
      }

      // --- Invoice creation ---
      const invoiceData = llmData?.invoice?.value;
      const summaryData = llmData?.summary?.value;

      const invoice = await prisma.invoice.create({
        data: {
          analyticsDocumentId: document.id,
          invoiceIdText: invoiceData?.invoiceId?.value || null,
          invoiceDate: invoiceData?.invoiceDate?.value 
            ? new Date(invoiceData.invoiceDate.value) 
            : null,
          deliveryDate: invoiceData?.deliveryDate?.value 
            ? new Date(invoiceData.deliveryDate.value) 
            : null,
          subtotal: summaryData?.subTotal?.value 
            ? Number(summaryData.subTotal.value) 
            : null,
          totalTax: summaryData?.totalTax?.value 
            ? Number(summaryData.totalTax.value) 
            : null,
          invoiceTotal: summaryData?.invoiceTotal?.value 
            ? Number(summaryData.invoiceTotal.value) 
            : null,
          currency: summaryData?.currencySymbol?.value || null,
          documentType: summaryData?.documentType?.value || null,
          vendorId: vendorRec?.id ?? null,
          customerId: customerRec?.id ?? null,
        },
      });

      console.log(`   ✅ Created invoice: ${invoice.invoiceIdText}`);

      // --- Line items handling ---
      const lineItems = llmData?.lineItems?.value?.items?.value ?? [];
      
      for (const li of lineItems) {
        await prisma.invoiceLineItem.create({
          data: {
            invoiceId: invoice.id,
            srNo: li.srNo?.value ?? null,
            description: li.description?.value ?? null,
            quantity: li.quantity?.value ? Number(li.quantity.value) : null,
            unitPrice: li.unitPrice?.value ? Number(li.unitPrice.value) : null,
            totalPrice: li.totalPrice?.value ? Number(li.totalPrice.value) : null,
            sachkonto: li.Sachkonto?.value || null,
            buschluessel: li.BUSchluessel?.value || null,
          },
        });
      }

      if (lineItems.length > 0) {
        console.log(`   ✅ Created ${lineItems.length} line items`);
      }

      // --- Payment handling ---
      const paymentData = llmData?.payment?.value;
      
      if (paymentData) {
        const hasMeaningfulData = 
          paymentData.dueDate?.value ||
          paymentData.paymentTerms?.value ||
          paymentData.bankAccountNumber?.value ||
          paymentData.BIC?.value;

        if (hasMeaningfulData) {
          await prisma.payment.create({
            data: {
              invoiceId: invoice.id,
              dueDate: paymentData.dueDate?.value 
                ? new Date(paymentData.dueDate.value) 
                : null,
              paymentTerms: paymentData.paymentTerms?.value || null,
              bankAccount: paymentData.bankAccountNumber?.value || null,
              bic: paymentData.BIC?.value || null,
              accountName: paymentData.accountName?.value || null,
              netDays: paymentData.netDays?.value || null,
              discountPercentage: paymentData.discountPercentage?.value 
                ? Number(paymentData.discountPercentage.value) 
                : null,
              discountDays: paymentData.discountDays?.value || null,
              discountedTotal: paymentData.discountedTotal?.value 
                ? Number(paymentData.discountedTotal.value) 
                : null,
            },
          });
          console.log(`   ✅ Created payment record`);
        }
      }

      console.log(`\n`);

    } catch (error) {
      console.error(`❌ Error processing document ${doc.name}:`, error);
      // Continue with next document instead of failing completely
    }
  }

  console.log("✨ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });