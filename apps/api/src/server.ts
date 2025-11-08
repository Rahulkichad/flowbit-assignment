import express from 'express';
import cors from 'cors';
import statsRouter from './routes/stats';
import invoicesRouter from './routes/invoices';
import chatRouter from './routes/chat-with-data';
import invoiceTrendsRouter from './routes/invoice-trends';
import vendorsRouter from './routes/vendors';
import categorySpendRouter from './routes/category-spend';
import cashOutflowRouter from './routes/cash-outflow';

const app = express();
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL ?? '*' }));
app.use(express.json());

app.use('/stats', statsRouter);
app.use('/invoices', invoicesRouter);
app.use('/chat-with-data', chatRouter);
app.use('/invoice-trends', invoiceTrendsRouter);
app.use('/vendors', vendorsRouter);
app.use('/category-spend', categorySpendRouter);
app.use('/cash-outflow', cashOutflowRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
