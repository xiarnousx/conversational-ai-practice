import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Weather MCP Node.js",
  version: "1.0.0",
});

server.registerTool(
    "get_weather", 
    {
        title: "Get Weather",
        description: "Fetches the current weather for a specified city.",
        inputSchema: {
            city: z.string().describe("The city to get the weather for"),
        },
        outputSchema: {
            city: z.string(),
            tempreature: z.string(),
            condition: z.string(),
            humidity: z.string(),
            windSpeed: z.string(),
            timestampt: z.string(),
        }

    }, async ({city}) => {
        if (!city || !city.trim()) {
            throw new Error("City name is required and cannot be empty.");
        }
        console.error(`Received get_weather request for city: ${city}`);

        const cleanCity = city.trim().toLowerCase();

        console.error(`Cleaned city name: ${cleanCity}`);

        const timestamp = new Date().toISOString();

        const weatherData = {
            city: cleanCity,
            tempreature: "25°C",
            condition: "Sunny",
            humidity: "40%",
            windSpeed: "10 km/h",
            timestampt: timestamp,
        }

        const weatherReport = `Weather report for ${weatherData.city} at ${weatherData.timestampt}:
            - Temperature: ${weatherData.tempreature}
            - Condition: ${weatherData.condition}
            - Humidity: ${weatherData.humidity}
            - Wind Speed: ${weatherData.windSpeed}
        `;  

        console.error(`Generated weather report: ${weatherReport}`);

        return { content: [{type: "text", text: weatherReport}], structuredContent: weatherData };
    }
);

server.registerPrompt(
    "weather_inquiry",
    {
        title: "Weather Inquiry",
        description: "Template for asking about weather conditions in a specific location.",
        argsSchema: {
            location: z.string().optional(),
        }
    },
    async ({ location } = {}) => {
        const cleanLocation = (location ?? "").trim().toLowerCase() || "{location}";
        return {
            messages: [
                {
                    role: "user",
                    content: { type: "text", text: `What is the weather like in ${cleanLocation}?` }
                }
            ]
        };
    }
);

async function main() {

    try {
        console.error("Starting Weather MCP Node.js server...");
        console.error("Waiting for MCP client to connect...");

        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("MCP client connected successfully!");

    } catch (error) {
        console.error("Error in main function:", error);
        if (error instanceof Error) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

await main();

process.on("SIGINT", () => {
    console.error("Received SIGINT signal. Exiting...");
    process.exit(0);
});

