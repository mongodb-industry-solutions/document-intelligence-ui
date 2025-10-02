export const docTalkTrack = [
    {
        heading: "Instructions and Talk Track",
        content: [
            {
                heading: "What are scheduled reports?",
                body: "Scheduled reports let you automatically run specific reporting tasks (e.g. aggregations, exporting, emailing) at set intervals (daily, hourly, etc.). The schedule library offers a human-friendly way to define and trigger these periodic jobs in your system.",
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
                    src: "./reports.png",
                    alt: "Architecture",
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