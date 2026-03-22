**FinSpreading** is an internal IFC analyst tool that automates the ingestion, standardization, and analysis of financial statements from African banks and microfinance institutions.

---

**Core workflow:**

1. **Upload** — analyst drops a PDF or Excel file; Claude extracts line items and periods automatically  
2. **Spread** — four interactive statement views (Assets, Liabilities, Income Statement, Off-Balance Sheet) with editable tables and multi-period support  
3. **Normalize** — line items are mapped to a standardized chart of accounts (BCEAO/OHADA for banks, MIX Market for MFIs)  
4. **CAMELS** — computed ratios feed a 5-component scoring engine; Claude generates the written analysis narrative  
5. **Export** — IRP-compliant CSV for submission to the Investment Risk Platform, or Excel bulk export

---

**Stack:** Next.js 15 · Supabase (auth \+ RLS \+ storage) · Anthropic Claude API · ExcelJS · Tailwind \+ shadcn/ui

**Institution types supported:** `banque` and `microfinance` — separate normalization trees, separate field mappings, same UI.

**Key engineering facts:**

* All financial data is user-isolated via Supabase RLS  
* Normalization is deterministic (code-based mappings, not AI); AI is only used for extraction and CAMELS narrative generation  
* Multi-period alignment is user-confirmed before CAMELS runs

