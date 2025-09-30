export const assistantTalkTrack = [
    {
        heading: "Instructions and Talk Track",
        content: [
            {
                heading: "What is Open Finance?",
                body: "Open Finance refers to the concept of allowing customers to securely share their financial data with third parties, beyond traditional banking services, to enable a broader range of financial products and services. It builds upon the principles of Open Banking, which focuses primarily on bank accounts, but extends the scope to include other financial products such as investments, insurance, pensions, and loans.",
            },
          
            {
                heading: "How to Demo (option 2)",
                body: [
                    "Click on the “Connect Bank” button",
                    "Select a fictional bank you would like to connect from the dropdown",
                    "Allow the modal to go through the different steps",
                    "Once the connection is completed you should see the new accounts or products displayed alongside your Leafy Bank accounts, with a blue badge indicating the name of the new bank.",
                    "Your “Global Position” will also be updated accordingly following these changes.",
                    "If you wish to remove a specific account/product from your list, click on the disconnect icon on the card. This card will disappear from your view, and the amount will be discounted from the global position totals."
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
                    src: "./OF_info.png",
                    alt: "Architecture",
                },
            },
        ],
    },
    {
        heading: "Why MongoDB?",
        content: [
            {
                heading: "Flexible Data Model",
                body: `<div>MongoDB's <a href="https://www.mongodb.com/resources/basics/databases/document-databases" target="_blank">document-oriented architecture</a> allows you to store varied data 
                (such as <i>timeseries logs, agent profiles, and recommendation outputs</i>) 
                in a <strong>single unified format</strong>. This flexibility means you don’t have to redesign your database <mark>schema</mark> every time your data requirements evolve.</div>`,
                isHTML:true
            },
            {
                heading: "Scalability and Performance",
                body: "MongoDB is designed to scale horizontally, making it capable of handling large volumes of real-time data. This is essential when multiple data sources send timeseries data simultaneously, ensuring high performance under heavy load.",
            },
            {
                heading: "Real-Time Analytics",
                body: "With powerful aggregation frameworks and change streams, MongoDB supports real-time data analysis and anomaly detection. This enables the system to process incoming timeseries data on the fly and quickly surface critical insights.",
            },
            {
                heading: "Seamless Integration",
                body: "MongoDB is seamlessly integrated with LangGraph, making it a powerful memory provider.",
            },
            {
                heading: "Vector Search",
                body: "MongoDB Atlas supports native vector search, enabling fast and efficient similarity searches on embedding vectors. This is critical for matching current queries with historical data, thereby enhancing diagnostic accuracy and providing more relevant recommendations.",
            },
        ],
    },
]