# Personal QA Test Case Generator (Custom GPT)

This is a **Node.js app** that acts as a personal “Custom GPT” for generating QA test cases.  

- Input a requirement  
- Output **JSON** test cases  
- Export **CSV** for Excel with proper bullet points (`•`)  

---

## Features

- Reusable **prompt templates** for QA logic  
- JSON + CSV output for test cases  
- Excel-friendly bullet points for steps  
- Fully local and personal use  
- Easily customizable prompt instructions  

---

## Project Structure
```
- qa-testcase-generator
    - app.js # Main server
    - promptTemplates.js # Reusable GPT prompts
    - package.json
    - .env # OpenAI API key
    - public # Optional browser UI
        - index.html
```
---

## Setup

1. **Clone the repo**

- git clone https://github.com/cupcakepanda89/qa-testcase-generator.git
- cd qa-testcase-generator

2. Install dependencies

- `npm install`

3. Create or update .env file with your OpenAI API key

- `OPENAI_API_KEY=your-openapi-key-here`

4. Run the server

- `node app.js`
- Server starts on http://localhost:3000
- If you encounter SSL/TLS error when run `node app.js`, here is workaround
- `export NODE_TLS_REJECT_UNAUTHORIZED=0`
- `node app.js`

5. Test the server from Terminal

- open a new terminal after run the server
- run the following curl command
```
curl -X POST http://localhost:3000/generate-testcases \
-H "Content-Type: application/json" \
-d '{"requirement":"User can log in with email and password"}'
```

6. Test the app from browser UI

- Open http://localhost:3000 in a browser
- Enter requirement and click Generate Test Cases
- View JSON output
- Click Download CSV to get Excel-ready CSV