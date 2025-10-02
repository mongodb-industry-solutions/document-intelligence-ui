export const assistantTalkTrack = [
    {
        heading: "Instructions and Talk Track",
        content: [
            {
                heading: "Why Agentic RAG?",
                body: "Agentic RAG enhances a standard Retrieval-Augmented Generation (RAG) system by embedding decision-making agents into the retrieval & generation loop. The agents can grade retrieved documents, decide whether they’re relevant, and if needed rewrite the query or invoke alternate retrieval paths. This leads to more accurate and contextually appropriate answers.  ",
            },

            {
                heading: "How to Demo",
                body: [
                    "- Choose a question from the ones below or type your own.",
                    "- After the assistant responds, review the sources it used to generate the answer.",
                    "-Start a New Chat Session to see how the assistant handles fresh interactions. (For demo purposes, each new session begins with a clean slate, though long-term memory is supported under the hood.)",
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
                    src: "./qa.png",
                    alt: "Architecture",
                },
            },
        ],
    },
    {
        heading: "Why MongoDB?",
        content: [

            {
                heading: "Rich Document Storage & Metadata",
                body: "You can store retrieved document chunks, agent evaluations, query rewrites, and state metadata in flexible JSON documents. MongoDB’s document model makes it easy to evolve these schemas as the agent logic grows.",
            },
            {
                heading: "Scalability & High Throughput",
                body: `An Agentic RAG system may perform many retrievals, rewrites, updates, and state transitions in parallel. MongoDB’s capacity to scale horizontally (sharding) ensures it can support many agents working concurrently.
<br><br>Beyond performance, MongoDB also persists agents’ long-term memory in dedicated checkpointer collections, ensuring continuity across interactions. This persistence is what enables agents to build on prior context rather than starting from scratch.
<br><br>In the demo, this concept is illustrated through the New Chat Session flow. For simplicity, each new session starts with a fresh memory. However, under the hood, MongoDB and the LangGraph framework make it possible to enable true long-term memory, allowing agents to accumulate knowledge and context over time.
`,
                isHTML: true
            },

        ],
    },
]