# Document Intelligence Frontend

This is the frontend application for the FSI Document Intelligence system, built with Next.js 15 and MongoDB's LeafyGreen UI components. It features a multi-step workflow for selecting use cases and data sources before accessing the document intelligence interface.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── use-case/                # Use case selection page
│   │   └── page.js             
│   ├── sources/                 # Data sources selection page
│   │   └── page.js             
│   ├── document-intelligence/   # Main document Q&A page
│   │   └── page.js             
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout with SelectionProvider
│   ├── page.js                 # Landing page (redirects to /use-case)
│   └── page.module.css         # Page-specific styles
├── components/                  # Reusable React components
│   ├── assistant/              # Document assistant components
│   │   ├── DocumentAssistant.jsx
│   │   └── DocumentAssistant.module.css
│   ├── common/                 # Common reusable components
│   │   └── Typewriter.jsx      # Typing animation effect
│   ├── documents/              # Document management components
│   │   ├── DocumentSidebar.jsx
│   │   └── DocumentSidebar.module.css
│   ├── layout/                 # Layout components
│   │   ├── AppHeader.jsx       # App header with progress
│   │   └── AppHeader.module.css
│   ├── modals/                 # Modal components
│   │   ├── UploadModal.jsx     # File upload modal
│   │   └── UploadModal.module.css
│   ├── progress/               # Progress indicator
│   │   ├── ProgressIndicator.jsx
│   │   └── ProgressIndicator.module.css
│   ├── sources/                # Data sources components
│   │   ├── DataSources.jsx
│   │   └── DataSources.module.css
│   └── use-case/               # Use case selection components
│       ├── UseCaseSelection.jsx
│       └── UseCaseSelection.module.css
├── contexts/                    # React Context providers
│   └── SelectionContext.js     # Global state management
├── utils/                      # Utilities and configurations
│   └── api/                    # API client services
│       ├── documents/          # Document-related APIs
│       │   └── api-client.js
│       └── upload/             # Upload-related APIs
│           └── api-client.js
├── public/                     # Static assets
│   ├── PDF_file_icon.png      # PDF file type icon
│   └── DOC_or_DOCX_file_icon.png # DOC/DOCX file type icon
└── ui_prototype/               # UI design references
```

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```bash
# Backend API Configuration (Client-side - requires NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Optional: Additional configuration can be added here
NEXT_PUBLIC_LOG_POLL_INTERVAL=2000
# NEXT_PUBLIC_FEATURE_FLAG=true
```

### Important Notes:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Variables without this prefix are only available server-side
- Never commit `.env.local` to version control

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your configuration

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Navigation Flow

The application enforces a strict three-step workflow:

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────────┐
│  Use Case   │ --> │   Sources   │ --> │ Document Intelligence│
│ Selection   │     │ Selection   │     │    (Main App)        │
└─────────────┘     └─────────────┘     └──────────────────────┘
```

- **Step 1**: Select a use case (required)
- **Step 2**: Select data sources (at least one required)
- **Step 3**: Access document intelligence features

Users cannot skip steps or access the main interface without completing the selection flow.
Returning to the root URL (`/`) resets the flow for a fresh start.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Playwright tests
- `npm run test:ui` - Open Playwright test UI
- `npm run test:debug` - Debug tests step by step
- `npm run test:headed` - Run tests with visible browser
- `npm run automate` - Run browser automation script
- `npm run playwright:install` - Install Playwright browsers

## Key Features

### Multi-Step Workflow
1. **Use Case Selection**: Choose from 5 FSI use cases:
   - Credit Rating
   - Payment Exception
   - Investment Research
   - Client Onboarding (KYC)
   - Loan Origination

2. **Data Sources**: Select one or more sources:
   - Local files (uploaded documents)
   - AWS S3 buckets
   - Google Drive folders

3. **Document Intelligence**: Access the main interface with:
   - Document sidebar with filtering
   - AI assistant with chat interface
   - Suggested actions and questions
   - Real-time document analysis

### Core Functionality
- **Smart Navigation**: Enforced workflow prevents skipping steps
- **State Persistence**: Selections saved across sessions
- **Document Management**: Filter by use case and sources
- **AI Assistant**: Context-aware chat with typewriter effect
- **File Upload**: Industry and use case categorization
- **Visual Indicators**: Progress tracking and document counts

## Technology Stack

- **Next.js 15.5** - React framework with App Router
- **React 19.1** - UI library with Context API for state management
- **LeafyGreen UI** - MongoDB's design system components
- **CSS Modules** - Component-scoped styling
- **localStorage** - Client-side state persistence
- **Playwright** - Browser automation and testing
- **lucide-react** - Icon library for UI elements
- **Backend API** - FastAPI backend on port 8080

## Component Pattern

All components follow a consistent structure:
- `.jsx` file for component logic
- `.module.css` file for component styles
- Each component is self-contained in its own folder

Example:
```
components/
  upload/
    DocumentUpload.jsx
    DocumentUpload.module.css
```

## Testing & Automation

The project includes Playwright for browser automation and testing:

- **Test files**: Located in `tests/` directory
- **Automation scripts**: Located in `scripts/` directory
- **Screenshots**: Saved to `screenshots/` directory
- **Configuration**: `playwright.config.js`

See `PLAYWRIGHT.md` for detailed testing documentation.

## UI Components

### Page Components:
- **UseCaseSelection** - Card grid for selecting FSI use cases
- **DataSources** - Multi-select interface for data sources
- **DocumentIntelligence** - Main document Q&A interface

### Core Components:
- **AppHeader** - Application header with progress indicator
- **DocumentAssistant** - AI chat interface with suggestions
- **DocumentSidebar** - Document list with filtering and actions
- **ProgressIndicator** - Visual workflow progress tracker
- **UploadModal** - File upload with industry/use case selection
- **Typewriter** - Animated text effect for AI responses

### Context & State:
- **SelectionContext** - Global state management for:
  - Selected use case
  - Selected data sources
  - Navigation flow control
  - localStorage persistence

### Design System:
- **Light Theme** - Modern, clean interface
- **LeafyGreen Components** - MongoDB's design system
- **Custom Icons** - PDF and DOC/DOCX file type icons
- **Consistent Styling** - Unified button sizes and colors
- **Accessibility** - ARIA labels and keyboard navigation
