export const assistantTalkTrack = [
    {
        heading: "Instructions and Talk Track",
        content: [
            {
                heading: "What is Agentic RAG?",
                body: "Agentic Retrieval-Augmented Generation with Self-Correction. Unlike traditional RAG that always retrieves documents, our system implements a retrieval agent that makes intelligent decisions about when to retrieve context from MongoDB Atlas Vector Search versus responding directly. The agent can grade retrieved documents for relevance, rewrite queries when results aren't sufficient, and self-correct through iterative improvement. This leads to more accurate and contextually appropriate answers for financial services use cases.",
            },
            {
                image: {
                    src: "/diagrams/5_part2_agentic_rag_pattern_explanation.png",
                    alt: "Agentic RAG Pattern Explanation",
                },
            },
            {
                heading: "How to Demo",
                body: [
                    "- Choose a question from the pre-canned questions below or type your own.",
                    "- After the assistant responds, review the sources it used to generate the answer.",
                    "- Start a New Chat Session to see how the assistant handles fresh interactions with conversation memory.",
                ],
            },
        ],
    },
    {
        heading: "Behind the Scenes",
        content: [
            {
                heading: "Data Flow",
                body: "The user's question enters the Retrieval Agent, which decides whether to retrieve documents or respond directly. If retrieval is needed, the system generates voyage-context-3 embeddings and performs semantic search against MongoDB's chunks collection. Retrieved documents are then graded for relevance through a Document Grader node. If documents are relevant, the Answer Generator synthesizes a response with citations. If not relevant, the Query Rewriter reformulates the question and loops back to retrieval for another attempt. All conversation state, grading decisions, and workflow steps persist in MongoDB checkpointing collections, enabling multi-turn dialogue with memory.",
            },
            {
                image: {
                    src: "./qa.png",
                    alt: "Q&A Agentic RAG Architecture",
                },
            },
            {
                heading: "Zooming-in on the Agentic RAG part",
                body: "",
            },
            {
                image: {
                    src: "/diagrams/4_part2_QandA_agentic_rag.png",
                    alt: "Agentic RAG Workflow",
                },
            },
        ],
    },
    {
        heading: "Why MongoDB?",
        content: [

            {
                heading: "Unified Data Platform & Vector Search",
                body: "MongoDB stores structured metadata, unstructured text chunks, and vector embeddings in a single database. Atlas Vector Search enables lightning-fast semantic search across millions of financial services documents using voyage-context-3 embeddings. This unified approach eliminates data silos and enables the retrieval agent to find relevant content based on meaning, not just keywords.",
            },
            {
                heading: "Conversation Memory & State Persistence",
                body: `MongoDB's checkpointing system (checkpoints_aio and checkpoint_writes_aio collections) enables sophisticated conversation persistence. Each dialogue has a unique thread_id for state isolation, with automatic restoration of conversation context across requests. This allows the agent to understand follow-up questions like "Why did it change?" by referencing previous context.
<br><br>The system also stores agent personas for each FSI use case (Credit Rating Analyst, Investment Research Analyst, etc.) in MongoDB, enabling use-case-specific configurations and prompts.`,
                isHTML: true
            },
            {
                heading: "Grading & Workflow Tracking",
                body: "MongoDB stores document relevance assessments in the gradings collection. This transparency allows you to analyze which documents were retrieved, which were deemed relevant, and how many query rewrites were needed. This audit trail is crucial for understanding agent decision-making and improving system performance over time.",
            },

        ],
    },
]