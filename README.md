# Document Intelligence UI

Document Intelligence UI is the graphical user interface for our demo document intelligence application.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           FSI DOCUMENT INTELLIGENCE SYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                              DOCUMENT SOURCES                                │  │
│  ├─────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                              │  │
│  │     📁 Local Files        ☁️ AWS S3 Bucket        📊 Google Drive           │  │
│  │       (PDF/DOC/DOCX)         (Cloud Storage)      (Public Folders)          │  │
│  │             ↓                       ↓                      ↓                 │  │
│  └─────────────┼───────────────────────┼──────────────────────┼────────────────┘  │
│                └───────────────┬───────┴──────────────────────┘                    │
│                                ↓                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    🤖 AGENTIC ORCHESTRATION LAYER (LangGraph)                │  │
│  ├─────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                              │  │
│  │    ┌──────────────────────────────────────────────────────────────────┐     │  │
│  │    │                    🧠 SUPERVISOR AGENT                           │     │  │
│  │    │                 (Workflow Orchestrator)                          │     │  │
│  │    └────────────────────────┬─────────────────────────────────────────┘     │  │
│  │                              ↓                                               │  │
│  │    ┌──────────────┬──────────────┬──────────────┬──────────────┐          │  │
│  │    ↓              ↓              ↓              ↓              ↓          │  │
│  │ 📂 Scanner    🔍 Evaluator   📸 Extractor   💾 Processor   🎯 QA Agent    │  │
│  │  (Discover)    (Relevance)    (Vision AI)    (Chunk/Embed)  (Answer)      │  │
│  │                                     ↓                ↓                      │  │
│  └─────────────────────────────────────┼────────────────┼──────────────────────┘  │
│                                        ↓                ↓                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                           🔧 CORE AI SERVICES                                │  │
│  ├─────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                              │  │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────┐   │  │
│  │  │  AWS Bedrock    │    │  VoyageAI       │    │  MongoDB Atlas       │   │  │
│  │  │                 │    │                 │    │                      │   │  │
│  │  │Claude 3.5 Sonnet v2│◄──┤ voyage-context-3│◄───┤  Vector Search      │   │  │
│  │  │ (Vision AI)     │    │ (Embeddings)    │    │  (HNSW Index)       │   │  │
│  │  │ NO OCR!         │    │ Context-Aware   │    │  Document Storage   │   │  │
│  │  └─────────────────┘    └─────────────────┘    └──────────────────────┘   │  │
│  │         ↑                        ↑                        ↑                 │  │
│  └─────────┼────────────────────────┼────────────────────────┼────────────────┘  │
│            └────────────────────────┼────────────────────────┘                    │
│                                     ↓                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                         🌐 API LAYER (FastAPI)                               │  │
│  ├─────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                              │  │
│  │   /api/ingestion/start     →  Start document processing workflow             │  │
│  │   /api/ingestion/status    →  Monitor agentic processing progress           │  │
│  │   /api/qa/query            →  Q&A with chunk-level references               │  │
│  │   /api/qa/documents        →  Multi-document context selection              │  │
│  │                                                                              │  │
│  └──────────────────────────────────┬───────────────────────────────────────────┘  │
│                                     ↓                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                         💻 FRONTEND (Next.js 15)                             │  │
│  ├─────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                              │  │
│  │   • React 19 Components      • LeafyGreen UI (MongoDB Design System)        │  │
│  │   • Document Upload UI        • Chunk-based Reference Display                │  │
│  │   • Q&A Interface            • Real-time Agent Progress Monitoring          │  │
│  │                                                                              │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

KEY FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Smart Ingestion: Context-aware assessment based on industry and topic
👁️ NO OCR: Pure vision-based understanding using Claude 3.5 Sonnet v2
🔍 Context-Aware: Each chunk knows the full document context (voyage-context-3)
📍 Visual Elements: Enhanced descriptions for charts, tables, and diagrams
🤖 Multi-Agent: Specialized agents for each task with LangGraph orchestration
🗄️ Multi-Source: Supports local files, AWS S3, and Google Drive with unified workflow
🔒 Deduplication: Intelligent caching prevents reprocessing
🏭 Industry-Specific: Configurable mappings for different industries
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📁 Project Structure

```
├── frontend/                    # Next.js Frontend
│   ├── app/                   # Next.js 15 App Router
│   │   ├── use-case/         # Use case selection page
│   │   │   └── page.js      
│   │   ├── sources/          # Data sources selection page
│   │   │   └── page.js      
│   │   ├── document-intelligence/ # Main document Q&A page
│   │   │   └── page.js      
│   │   ├── globals.css       # Global styles
│   │   ├── layout.js        # Root layout with SelectionProvider
│   │   ├── page.js          # Landing page (redirects to /use-case)
│   │   └── page.module.css  # Page-specific styles
│   ├── components/           # React Components
│   │   ├── assistant/       # Document assistant components
│   │   │   ├── DocumentAssistant.jsx
│   │   │   └── DocumentAssistant.module.css
│   │   ├── common/          # Common reusable components
│   │   │   └── Typewriter.jsx
│   │   ├── documents/       # Document management components
│   │   │   ├── DocumentSidebar.jsx
│   │   │   └── DocumentSidebar.module.css
│   │   ├── layout/          # Layout components
│   │   │   ├── AppHeader.jsx
│   │   │   └── AppHeader.module.css
│   │   ├── modals/          # Modal components
│   │   │   ├── UploadModal.jsx
│   │   │   └── UploadModal.module.css
│   │   ├── progress/        # Progress indicator
│   │   │   ├── ProgressIndicator.jsx
│   │   │   └── ProgressIndicator.module.css
│   │   ├── sources/         # Data sources components
│   │   │   ├── DataSources.jsx
│   │   │   └── DataSources.module.css
│   │   └── use-case/        # Use case selection components
│   │       ├── UseCaseSelection.jsx
│   │       └── UseCaseSelection.module.css
│   ├── contexts/             # React Context providers
│   │   └── SelectionContext.js # Global state for selections
│   ├── utils/               # Utilities
│   │   └── api/            # API client services
│   │       ├── documents/  
│   │       │   └── api-client.js
│   │       └── upload/     
│   │           └── api-client.js
│   ├── public/              # Static assets
│   │   ├── PDF_file_icon.png    # PDF file icon
│   │   └── DOC_or_DOCX_file_icon.png # DOC/DOCX file icon
│   ├── ui_prototype/        # UI design references
│   ├── playwright.config.js # Playwright configuration
│   ├── jsconfig.json        # JavaScript configuration
│   ├── next.config.mjs      # Next.js configuration
│   ├── package.json         # Node.js dependencies
│   ├── README.md            # Frontend documentation
│   └── PLAYWRIGHT.md        # Testing documentation
│
├── docker-compose.yml          # Docker services definition
├── Dockerfile.frontend        # Frontend container definition
└── makefile                  # Build and run commands
```

## 🔧 Environment Setup

### Frontend (.env.local)
Required environment variables:
```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Note: Frontend connects to the FastAPI backend, not directly to MongoDB.

## 📄 MongoDB Collections

The system uses the following MongoDB collections:

1. **workflows**: Tracks ingestion workflow execution
   - `workflow_id`: Unique identifier for the workflow
   - `source_paths`: Array of source paths being processed
   - `triggered_at`: Timestamp when workflow started

2. **assessments**: Document evaluation results
   - `document_id`: Unique document identifier
   - `document_path`: Full path with source prefix (e.g., `@s3@bucket/path/file.pdf`)
   - `workflow_id`: Links assessment to the workflow that created it
   - `assessment`: Contains relevance score, topics, and processing decision

3. **documents**: Processed document metadata
   - `document_id`: Unique identifier
   - `document_path`: Full path with source prefix
   - `source_type`: Type of source (local/s3/gdrive)
   - `chunk_count`: Number of chunks created
   - `status`: Processing status

4. **chunks**: Document chunks with embeddings
   - `document_id`: Links to parent document
   - `chunk_text`: Extracted text content
   - `embedding`: voyage-context-3 vector (1024 dimensions)
   - `has_visual_elements`: Boolean flag for visual content

5. **buckets**: S3 bucket configurations
6. **gdrive**: Google Drive folder configurations
7. **industry_mappings**: Industry and topic classifications

## 📦 Dependencies

### Frontend
```json
{
  "dependencies": {
    "@leafygreen-ui/button": "^25.0.3",
    "@leafygreen-ui/card": "^13.0.4",
    "@leafygreen-ui/checkbox": "^18.0.2",
    "@leafygreen-ui/icon": "^14.4.1",
    "@leafygreen-ui/icon-button": "^24.0.0",
    "@leafygreen-ui/text-input": "^16.0.2",
    "@leafygreen-ui/typography": "^22.1.1",
    "geist": "^1.3.1",
    "marked": "^16.2.1",
    "next": "^15.5.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@playwright/mcp": "^0.0.36",
    "playwright": "^1.50.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

## 📂 Document Sources

The system supports ingesting documents from multiple sources:

### 1. Local Files (Docker Volume)
Documents can be uploaded via API and stored in the Docker volume:
```bash
# Upload documents
curl -X POST http://localhost:8080/api/upload/documents \
  -F "files=@document.pdf" \
  -F "industry=fsi" \
  -F "use_case=credit_rating"

# Available use cases: credit_rating, payment_exception, investment_research, kyc_onboarding, loan_origination

# List uploaded documents in an industry/use_case
curl "http://localhost:8080/api/upload/documents/fsi?use_case=credit_rating"

# Delete specific document in an industry/use_case
curl -X DELETE "http://localhost:8080/api/upload/documents/fsi/document.pdf?use_case=credit_rating"

# Delete all documents in an industry/use_case folder
curl -X DELETE "http://localhost:8080/api/upload/documents/fsi?use_case=credit_rating"

# Ingest from local storage
curl -X POST http://localhost:8080/api/ingestion/start \
  -H "Content-Type: application/json" \
  -d '{
    "source_paths": ["@local@/docs/fsi/credit_rating"],
    "workflow_id": "local_fsi_ingestion"
  }'
```

#### Google Drive Structure:
```
📁 FSI Document Intelligence Demo/
├── 📁 fsi/
│   ├── 📁 credit_rating/
│   ├── 📁 risk_assessment/
│   └── 📁 compliance/
├── 📁 healthcare/
│   └── 📁 patient_records/
├── 📁 insurance/
│   └── 📁 policies/
├── 📁 manufacturing/
│   └── 📁 quality_control/
├── 📁 media/
│   └── 📁 articles/
└── 📁 retail/
    └── 📁 general/
```

#### Google Drive Usage:
```bash
# Ingest from Google Drive FSI folder
curl -X POST http://localhost:8080/api/ingestion/start \
  -H "Content-Type: application/json" \
  -d '{
    "source_paths": ["@gdrive@fsi/credit_rating"],
    "workflow_id": "gdrive_fsi_ingestion"
  }'
```

#### S3 Document Sources by Industry:
Configure your own S3 bucket structure following this pattern:
- **FSI**: `s3://YOUR-BUCKET/your-path/fsi/`
- **Healthcare**: `s3://YOUR-BUCKET/your-path/healthcare/`
- **Insurance**: `s3://YOUR-BUCKET/your-path/insurance/`
- **Manufacturing**: `s3://YOUR-BUCKET/your-path/manufacturing/`
- **Media**: `s3://YOUR-BUCKET/your-path/media/`
- **Retail**: `s3://YOUR-BUCKET/your-path/retail/`

#### S3 Usage Examples
```bash
# Ingest from S3 FSI folder
curl -X POST http://localhost:8080/api/ingestion/start \
  -H "Content-Type: application/json" \
  -d '{
    "source_paths": ["@s3@fsi"],
    "workflow_id": "s3_fsi_ingestion"
  }'

# Ingest from specific S3 subfolder with use case
curl -X POST http://localhost:8080/api/ingestion/start \
  -H "Content-Type: application/json" \
  -d '{
    "source_paths": ["@s3@fsi/credit_rating"],
    "workflow_id": "s3_fsi_credit_rating"
  }'

# Mix local and S3 sources in one workflow
curl -X POST http://localhost:8080/api/ingestion/start \
  -H "Content-Type: application/json" \
  -d '{
    "source_paths": [
      "@local@/docs/fsi/credit_rating",
      "@s3@fsi/reports"
    ],
    "workflow_id": "mixed_sources_ingestion"
  }'
```

#### AWS Authentication for S3
The system uses AWS SSO for authentication. No access keys required:
1. Configure AWS SSO: `aws configure sso`
2. Login: `aws sso login --profile your-profile`
3. Set environment variable: `export AWS_PROFILE=your-profile`

### Source Path Format
All source types use a consistent prefix pattern for clarity:
- **Local files**: `@local@/docs/{industry}/{use_case}`
- **S3 files**: `@s3@{industry}` or `@s3@{industry}/{subfolder}`
- **Google Drive**: `@gdrive@{industry}/{use_case}`
- All three sources can be mixed in the same ingestion workflow

Document paths stored in MongoDB include full source information:
- Local: `@local@/path/to/file.pdf`
- S3: `@s3@bucket-name/path/to/file.pdf`
- Google Drive: `@gdrive@industry/use_case/file.pdf`

#### Mixed Source Example:
```bash
curl -X POST http://localhost:8080/api/ingestion/start \
  -H "Content-Type: application/json" \
  -d '{
    "source_paths": [
      "@local@/docs/fsi/credit_rating",
      "@s3@fsi/reports",
      "@gdrive@fsi/compliance"
    ],
    "workflow_id": "mixed_all_sources"
  }'
```

## 🎯 Context-Aware Document Assessment

The system evaluates documents based on their industry and topic context extracted from the source path:

### How It Works
1. **Path Analysis**: Extracts industry and topic from source paths
   - Example: `@s3@fsi/credit_rating` → Industry: "financial services", Topic: "credit rating"
   
2. **Relevance Scoring**: Documents are evaluated against:
   - Industry relevance (e.g., is this a financial services document?)
   - Topic relevance (e.g., is this about credit ratings?)
   - Documents matching EITHER criteria are accepted

3. **Strict Filtering**: Automatically rejects:
   - Food receipts, personal documents, entertainment content
   - Documents with no business relevance to the context
   - Test or sample documents

### Supported Industries
- **fsi**: Financial Services
- **healthcare**: Healthcare
- **insurance**: Insurance
- **manufacturing**: Manufacturing
- **media**: Media and Entertainment
- **retail**: Retail

### Configuration
Industry and topic mappings are stored in MongoDB and can be updated without code changes.

## 🛠️ Development Commands

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Docker
```bash
# Build and run all services
docker-compose up --build

# Run frontend only
docker-compose up document-intelligence-frontend
```
