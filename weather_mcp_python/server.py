#!/usr/bin/env python3

"""
Weather MCP Server - A model Context Protocol Server that provides weather information to clients.

This Server Implements:
- A weather tool that returns hardcoded weather tempreture data (45F)
- MCP prompt templates for weather-releated interactions
- STDIO transport for communication with Claude Desktop

Built using FastMCP (included in the official MCP Python SDK).
"""

import sys
from datetime import datetime

from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.prompts import base

mcp = FastMCP("Weather MCP Server")

@mcp.tool("get_weather")
def get_weather(city: str) -> str:
    """
    Get current weather information for a given city.
    Returns tempreature data for the requested city.

    Args:
        city (str): The name of the city to get weather information for.
    Returns:
        str: A string containing the current weather information for the specified city.
    """
    if not city or not city.strip():
        raise ValueError("City name is required.")
    
    city = city.strip()

    print(f"Received weather request for city: {city}", file=sys.stderr)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # create fromatted weather response

    weather_report = (
        f"Weather Report for {city} at {timestamp}:\n"
        f"------------------------------\n"
        f"Temperature: 45F\n"
        f"Condition: Clear\n"
        f"Humidity: 50%\n"
        f"Wind: 5 mph NW\n"
    )

    print(f"Generated weather report for {city}:\n{weather_report}", file=sys.stderr)

    return weather_report

@mcp.prompt()
def weather_inquiry(location: str) -> str:
    """
    Prompt template for inquiring about the weather in a specific location.

    Args:
        location (str): The location to inquire about the weather for.
    Returns:
        str: A formatted prompt string for the weather inquiry.
    """

    return f"What is the current weather in {location}?"


def main():

    """
    Main entry point for the Weather MCP Server.
    Sets up STDIO transport and registers the weather tool and prompts, then starts the server.
    """
    try:
        print("Starting Weather MCP Server...", file=sys.stderr)
        print("Server Ready to accept connections.", file=sys.stderr)

        # Run the server - FastMCP handles all transport details
        mcp.run()
    except Exception as e:
        print(f"Error starting MCP Server: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()