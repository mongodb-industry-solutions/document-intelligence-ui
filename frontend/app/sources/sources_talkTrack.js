export const sourceTalkTrack = [
    {
        heading: "Instructions and Talk Track",
        content: [
            {
                heading: "What is hierarchical multi-agent orchestration?",
                body: [
                    "Hierarchical multi-agent orchestration (often also called supervisor or “supervisor of supervisors”) is an architecture for coordinating multiple agents in a system. Rather than having a flat network of agents that all coordinate directly, you impose a hierarchy: teams of agents report to local supervisors, and those supervisors in turn report to a top-level supervisor. This lets you scale complexity, partition responsibilities, and delegate control flow in a more manageable way.",
                    "",
                    "In the context of document ingestion and relevance determination, hierarchical orchestration lets you route documents (or document chunks) through specialized agents (e.g. for parsing, summarization, classification), under the oversight of supervisors that can decide which agent(s) to invoke next and which documents are relevant.",
                ],
            },

            {
                heading: "How to Demo",
                body: [
                    "- Select a source from the ones available below",
                    "- Click the “Sync sources”",
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
                body: "",
            },
            {
                image: {
                    src: "./sources.png",
                    alt: "Architecture",
                },
            },
        ],
    },
    {
        heading: "Why MongoDB?",
        content: [
            {
                heading: "Flexible Schema & Document Model",
                body: `MongoDB’s document-based storage lets you naturally represent documents, chunks, metadata, agent states, and routing decisions in nested JSON-like structures. You can evolve the schema over time (e.g. add new fields for supervisor decisions, agent annotations) without rigid migrations.
<br><br>On top of this, MongoDB also stores vector representations (embeddings) directly alongside your data, making it an all-in-one database for both structured and semantic queries. With Atlas Vector Search, you can run semantic search over your ingested content, improving retrieval relevance and context awareness.
<br><br>We are leveraging the recently released Voyage-3-Context model, which generates embeddings that combine focused chunk-level details with global document context. This results in higher-quality matches and more accurate downstream responses.`,
                isHTML: true
            },
            {
                heading: "Efficient Querying & Indexing",
                body: "You can index on document attributes (e.g. relevance score, ingestion status, metadata) and do fast lookups and filtering. Supervisors and agents can quickly query which documents are pending, which need reprocessing, or which passed relevance thresholds. The system is also smart enough to detect documents that have already been processed, ensuring they aren’t reprocessed unnecessarily, saving both time and compute.",
            },
            {
                heading: "Scalability & Distributed Architecture",
                body: "MongoDB scales horizontally and supports high throughput. In a multi-agent system with many concurrent agents ingesting, updating, and routing documents, you need a database that can handle high write and read loads reliably.",
            },
            
        ],
    },
]