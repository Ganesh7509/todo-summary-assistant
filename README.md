# ✅ Todo Summary Assistant

A smart productivity tool that integrates **Slack** and **OpenAI GPT** to generate real-time summaries of your to-do lists. This project helps teams stay updated and organized with automatic updates in Slack channels using AI-powered summarization.

---

## 🚀 Deliverables

- 🔗 **GitHub Repository**: [todo-summary-assistant](https://github.com/Ganesh7509/todo-summary-assistant)
- 📁 **Source Code Structure**:
  - **Frontend**: Root folder `todo-summary-assistant/` (React.js)
  - **Backend**: Inside `/Backend/` folder (Node.js + Express)
- ⚙️ **Environment File Template**:
  A `.env.example` file is included with the following variables:
  ```env
  OPENAI_API_KEY=your_openai_api_key_here
  SLACK_WEBHOOK_URL=your_slack_webhook_url_here
  DATABASE_URL=your_database_connection_string_here
  SLACK_BOT_TOKEN=your_slack_bot_token_here
  SLACK_SIGNING_SECRET=your_slack_signing_secret_here
🛠️ Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/Ganesh7509/todo-summary-assistant.git
cd todo-summary-assistant
2. Install Dependencies
🔹 Frontend
bash
Copy
Edit
npm install
🔹 Backend
bash
Copy
Edit
cd Backend
npm install
3. Setup Environment Variables
Copy .env.example to .env in both frontend and backend folders (if needed).

Fill in your API keys and credentials:

bash
Copy
Edit
cp .env.example .env
💬 Slack and LLM Setup
🔗 Slack Integration
This project integrates with Slack to send real-time AI-generated summaries directly into Slack channels using a custom Slack bot.

Slack App Setup: Created via the Slack API Console

Permissions/Scopes Configured:

chat:write

incoming-webhook

commands

Bot Authentication:

The bot uses SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET, stored securely in the .env file.

Features:

Instant message summaries of tasks

Supports slash commands (optional)

Helps teams collaborate efficiently

This enhances team productivity by offering real-time task visibility inside Slack.

🤖 Large Language Model (LLM)
The summarization is powered by OpenAI’s GPT model, which transforms raw to-do items into short, clear summaries.

Provider: OpenAI

Functionality:

Summarizes to-do tasks into natural language

Sends summaries to Slack via the backend service

Security:

OPENAI_API_KEY is stored securely in .env

All requests are made on the backend to keep credentials safe

A great example of real-world AI integration in productivity tools.

🧠 Design / Architecture Decisions
Layer	Tech Stack	Description
Frontend	React.js	UI layer to manage the user interface
Backend	Node.js + Express	Handles Slack & OpenAI API requests, logic, and data processing
Database	Supabase/PostgreSQL	Stores tasks and logs (optional)
Integration	Slack + OpenAI GPT	Slack bot posts AI-generated summaries
Communication	REST API	Frontend and backend interaction via HTTP
Security	.env file	Sensitive keys are kept out of codebase

Design ensures clear separation of concerns and scalable integration with external services.

🌍 Deployment
✅ Platforms
Frontend: Deployed via Vercel or Netlify

Backend: Can be deployed on Render, Railway, or Heroku



Project is ready for production deployment with build scripts configured.

👨‍💻 Author
Ganesh Kunde

🔗 GitHub

💼 LinkedIn

