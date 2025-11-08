from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os, httpx, asyncpg, json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
DB_DSN = os.getenv("DATABASE_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class QueryIn(BaseModel):
    query: str
    max_rows: int = 200

# Database schema for context
DB_SCHEMA = """
Database Schema (PostgreSQL with Prisma):

Main Tables:
1. Invoice: id, invoiceIdText, invoiceDate, deliveryDate, subtotal, totalTax, invoiceTotal, currency, documentType, vendorId, customerId
2. Vendor: id, name, partyNumber, address, taxId
3. Customer: id, name, address, taxId
4. InvoiceLineItem: id, invoiceId, description, quantity, unitPrice, totalPrice, vatRate, vatAmount
5. Payment: id, invoiceId, dueDate, paymentTerms, bankAccount

Important Notes:
- Table names are PascalCase (Invoice, not invoices)
- Use invoiceTotal for total amount
- Use invoiceDate for date filtering
- Join Invoice with Vendor using vendorId
- All IDs are UUIDs (strings)
"""

async def generate_sql_with_groq(natural_language_query: str) -> str:
    """Use GROQ API to generate SQL from natural language"""
    
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable is not set. Please set it in your .env file.")
    
    prompt = f"""You are a SQL expert. Convert the following natural language question into a PostgreSQL SELECT query.

{DB_SCHEMA}

Rules:
1. Only generate SELECT queries
2. Table names are PascalCase: "Invoice", "Vendor", "Customer", etc.
3. Use double quotes for table/column names if needed
4. For total spend: SUM("invoiceTotal")
5. For vendor info: JOIN "Invoice" with "Vendor" on "vendorId"
6. Return ONLY the SQL query, no explanations
7. Do not use semicolons at the end
8. Use proper PostgreSQL syntax

Question: {natural_language_query}

SQL Query:"""

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a SQL expert that converts natural language to PostgreSQL queries. Return only the SQL query without any explanation or markdown formatting."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 500
            },
            timeout=30.0
        )
        
        if response.status_code != 200:
            error_text = response.text
            try:
                error_json = response.json()
                error_text = error_json.get("error", {}).get("message", error_text)
            except:
                pass
            raise HTTPException(
                status_code=500, 
                detail=f"GROQ API error (status {response.status_code}): {error_text}. Please check your GROQ_API_KEY."
            )
        
        try:
            result = response.json()
            if "choices" not in result or len(result["choices"]) == 0:
                raise HTTPException(status_code=500, detail="GROQ API returned invalid response format")
            
            sql = result["choices"][0]["message"]["content"].strip()
            
            # Clean up the SQL
            sql = sql.replace("```sql", "").replace("```", "").strip()
            if sql.endswith(";"):
                sql = sql[:-1]
            
            if not sql:
                raise HTTPException(status_code=500, detail="GROQ API returned empty SQL query")
            
            return sql
        except KeyError as e:
            raise HTTPException(status_code=500, detail=f"GROQ API response parsing error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing GROQ API response: {str(e)}")

@app.post("/nl-to-sql")
async def nl_to_sql(payload: QueryIn):
    nl = payload.query
    
    try:
        # Generate SQL using GROQ AI
        sql = await generate_sql_with_groq(nl)
        
        # Safety check
        sql_lower = sql.strip().lower()
        if not sql_lower.startswith("select"):
            raise HTTPException(status_code=400, detail="Only SELECT queries are allowed")
        
        if "drop" in sql_lower or "delete" in sql_lower or "update" in sql_lower or "insert" in sql_lower:
            raise HTTPException(status_code=400, detail="Unsafe SQL operation detected")
        
        # Execute the query
        # Handle DATABASE_URL - it might be in different formats
        if not DB_DSN:
            raise HTTPException(status_code=500, detail="DATABASE_URL environment variable is not set")
        
        db_url = DB_DSN.strip()
        
        # Fix common DATABASE_URL issues for docker-compose setups
        # If URL contains @host: or @host/ (docker service name), replace with localhost
        import re
        if '@host:' in db_url or '@host/' in db_url:
            db_url = re.sub(r'@host([:/])', r'@localhost\1', db_url)
        
        conn = None
        try:
            conn = await asyncpg.connect(dsn=db_url, timeout=10)
            rows = await conn.fetch(sql)
            columns = list(rows[0].keys()) if rows else []
            return {
                "sql": sql,
                "columns": columns,
                "rows": [dict(r) for r in rows[:payload.max_rows]],
                "total_rows": len(rows)
            }
        except asyncpg.exceptions.PostgresError as db_err:
            raise HTTPException(
                status_code=500, 
                detail=f"Database error: {str(db_err)}. SQL: {sql}"
            )
        except Exception as db_conn_err:
            raise HTTPException(
                status_code=500, 
                detail=f"Database connection error: {str(db_conn_err)}. Please check DATABASE_URL."
            )
        finally:
            if conn:
                await conn.close()
            
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in nl_to_sql: {error_trace}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing query: {str(e)}"
        )
