export const sourceTalkTrack = [
    {
        heading: "Instructions and Talk Track",
        content: [
            {
                heading: "What is Supervisor Multi-Agent Architecture?",
                body: [
                    "A supervisor multi-agent architecture is a type of multi-agent system in which multiple specialized agents operate under the coordination of a central supervisor agent that manages their interactions and orchestrates the overall control flow of the application.",
                    "In our document ingestion pipeline, the supervisor agent coordinates four specialized worker agents: Scanner (discovers documents), Evaluator (assesses relevance), Extractor (vision-based content extraction), and Processor (chunks and generates embeddings). Rather than building one agent that handles all tasks, we create focused specialists coordinated by a supervisor who understands the complete workflow.",
                    "",
                ],
            },
            {
                image: {
                    src: "./sources.png",
                    alt: "Supervisor Multi-Agent Architecture High Level",
                },
            },

            {
                heading: "How to Demo",
                body: [
                    "- Select a source from the ones available below",
                    "- Click the 'Sync sources' button",
                    "- Check the console to see the ingestion process in action",
                    "- Once the ingestion is complete, click continue",
                ],
            },
        ],
    },
    {
        heading: "Behind the Scenes",
        content: [
            {
                heading: "Data Flow",
                body: "The supervisor agent receives documents from multiple sources (Local files, AWS S3, Google Drive) and routes them sequentially through specialized agents. Each agent reports back to the supervisor, which decides the next action. The workflow progresses through four stages: (1) Scanner discovers files, (2) Evaluator assesses document relevance based on financial services context, (3) Extractor uses Claude 3.5 Sonnet v2 vision AI to convert documents to markdown, and (4) Processor splits content into chunks and generates voyage-context-3 embeddings. All workflow state, assessments, and processed documents persist in MongoDB Atlas.",
            },
            {
                image: {
                    src: "/diagrams/2_part1_ingestion_multiagent_supervisor.png",
                    alt: "Ingestion Workflow - Supervisor Multi-Agent Architecture",
                },
            },
            {
                image: {
                    src: "/diagrams/3_part1_multiagent_supervisor_pattern_explanation.png",
                    alt: "Supervisor Pattern Explanation",
                },
            },
        ],
    },
    {
        heading: "Why MongoDB?",
        content: [
            {
                heading: "Unified Data Platform",
                body: `MongoDB's document-based storage lets you naturally represent documents, chunks, metadata, agent states, and routing decisions in nested JSON-like structures. You can evolve the schema over time (e.g. add new fields for supervisor decisions, agent annotations) without rigid migrations.
                On top of this, MongoDB stores vector representations (embeddings) directly alongside your data, making it an all-in-one database for both structured and semantic queries. With Atlas Vector Search, you can run semantic search over your ingested content, improving retrieval relevance and context awareness.
                We leverage Voyage-context-3 embeddings, which combine focused chunk-level details with global document context, resulting in higher-quality matches and more accurate downstream responses.`,
                isHTML: true
            },
            {
                heading: "Workflow Tracking & Deduplication",
                body: "MongoDB enables real-time workflow state persistence across all agents. You can index on document attributes (relevance score, ingestion status, metadata) for fast lookups and filtering. The supervisor and agents can quickly query which documents are pending, which need reprocessing, or which passed relevance thresholds. The system automatically detects previously processed documents, preventing unnecessary reprocessing and saving compute resources.",
            },
            {
                heading: "Scalability & High Throughput",
                body: "MongoDB scales horizontally and supports high throughput. In a multi-agent system with concurrent agents ingesting, updating, and routing documents across multiple sources, you need a database that can handle high write and read loads reliably. MongoDB Atlas provides the scalability needed for enterprise-scale document processing.",
            },
            
        ],
    },
]