export const docTalkTrack = [
    {
        heading: "Instructions and Talk Track",
        content: [
            {
                heading: "What are scheduled reports?",
                body: "Automated Report Generation with Section-Specific Semantic Search. The reporting system generates weekly financial services reports by leveraging MongoDB's semantic search capabilities to gather relevant content for each report section. The scheduler runs automated jobs that create professional PDF reports for different FSI use cases such as Credit Rating Analysis, Investment Research Insights, KYC Onboarding Summaries, and Loan Origination Reviews.",
            },
        ],
    },
    {
        heading: "Behind the Scenes",
        content: [
            {
                heading: "Data Flow",
                body: "Report templates stored in MongoDB define the structure and section-specific prompts for each financial services use case. When a scheduled job runs, the system generates voyage-context-3 embeddings for each section's semantic query, performs targeted vector search against the chunks collection, and accumulates context across sections for consistency. The LLM then generates content for each section based on retrieved chunks, and ReportLab creates a professional PDF. Report metadata (file paths, generation history) persists in the scheduled_reports collection, with automatic cleanup keeping only the last 7 reports.",
            },
            {
                image: {
                    src: "/diagrams/6_part3_scheduled_reports.png",
                    alt: "Scheduled Reports Architecture",
                },
            },
        ],
    },
    {
        heading: "Why MongoDB?",
        content: [
            {
                heading: "Persistent Report States & Metadata",
                body:"You can store report definitions, last run timestamps, status (success/failure), and output metadata in document records. This makes it easy to track what’s been run, when, and whether to retry."
            },
            {
                heading: "Atlas Vector Search",
                body: "For generating the scheduled reports, we leverage Atlas Vector Search to run semantic searches over the relevant chunks of ingested documents. Combined with a lightweight definition of the report’s structure and sections, this enables AI-based report generation that is always grounded in the ingested source documents.",
            },
            {
                heading: "Scalability & Concurrency",
                body: "As your number of scheduled reports grows, MongoDB handles many simultaneous reads and writes (e.g. multiple reports executing at once, writing results). Its sharding and scaling capabilities let you support heavy throughput.",
            },
           
        ],
    },
]