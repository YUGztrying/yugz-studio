**IDD Screening App** — an AI-powered integrity due diligence platform for investment and compliance teams.

**What it does:**

* **Screens individuals and entities** for integrity risks before/during investment decisions  
* **Automated research pipeline**: queries Perplexity for web research, then Claude analyses the results  
* **Two core outputs per subject:**  
  * **PEP check** — identifies Politically Exposed Person roles, formats them in IDD house style  
  * **IRF report** — generates Integrity Risk Flag write-ups (findings \+ assessment/mitigant) following professional IDD prose standards  
* **Case management** — organises subjects into cases (e.g. one case per deal), tracks risk levels (High / Medium / Low), supports bulk screening  
* **Export to Word** — produces formatted reports ready for client delivery  
* **Usage tracking** — monitors API consumption per user

**Tech stack:** Next.js frontend, Supabase (auth \+ DB), Deno edge functions, Perplexity API (research), Anthropic Claude API (analysis).

