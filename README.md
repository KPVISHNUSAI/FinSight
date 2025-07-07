# FinSight

FinSight is a modern, AI-powered financial analysis platform designed to provide key insights, detect anomalies, and forecast financial trends. Built with Next.js and Genkit, it offers a suite of tools for intelligent financial management, inspired by the professional aesthetic of Relanto.

## Features

-   **Interactive Dashboard:** A central hub for viewing key performance indicators (KPIs), revenue trends, and expense breakdowns.
-   **AI Report Generation:** Create custom financial reports from natural language prompts. The output is rendered in Markdown for clear, structured results.
-   **Anomaly Detection:** Upload financial data (JSON, CSV, Excel) to have an AI identify suspicious transactions, security risks, and other irregularities.
-   **Financial Forecasting:** Generate a 6-month financial forecast based on historical data, complete with visualizations.
-   **Conversational AI Assistant:** Chat with "Insight," an AI assistant knowledgeable about the platform's features, to get help and analysis.
-   **Responsive Design:** A clean, modern interface that works seamlessly across desktops, tablets, and mobile devices.

##  Why It’s Useful for a Company:

-  Saves time by automating reports.

-  Reduces errors and catches weird transactions.

-  Makes it easy for non-finance people to understand financial data.

-  Helps in making smart decisions quickly.

-  Looks sleek and works anywhere — even on the go.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **AI:** [Google Genkit](https://firebase.google.com/docs/genkit), [Gemini API](https://ai.google.dev/)
-   **Charts:** [Recharts](https://recharts.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Setup

This project uses the Google Gemini API for its AI capabilities. You will need an API key to run the application.

1.  Create a new file named `.env` in the root of the project directory.

2.  Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  Add the key to your `.env` file:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Development Server

Once the dependencies are installed and the environment is configured, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Project Structure

-   `src/app/`: Contains all the pages and routes for the application. The main application is nested under the `/dashboard` route group.
-   `src/components/`: Shared, UI, and page-specific React components.
-   `src/ai/flows/`: All Genkit AI flows that power the application's intelligent features.
-   `src/lib/actions.ts`: Server Actions that connect the frontend components to the backend AI flows.
-   `src/app/globals.css`: Contains the global styles and theme variables (CSS Custom Properties) for the application.

## AI Flows

The core AI functionality is defined in Genkit flows located in `src/ai/flows/`.

-   `detect-financial-anomalies.ts`: Analyzes financial data logs for various types of anomalies (transactional, access, security, etc.).
-   `generate-report-from-prompt.ts`: Generates a text-based financial report in Markdown format from a user's natural language description.
-   `forecast-financials.ts`: Predicts future revenue and expenses based on historical data.
-   `conversational-assistant.ts`: Powers the "Insight" chatbot, maintaining conversation history and providing helpful, context-aware responses.
