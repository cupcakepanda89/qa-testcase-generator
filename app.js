const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const path = require('path');
const { getTestCasePrompt } = require('./promptTemplates');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000;

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to generate test cases
app.post('/generate-testcases', async (req, res) => {
    try {
        const { requirement } = req.body;
        if (!requirement)
            return res.status(400).json({ error: 'Requirement is required' });

        // Call GPT
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful QA engineer.' },
                { role: 'user', content: getTestCasePrompt(requirement) },
            ],
            temperature: 0.2,
        });

        // Parse GPT output
        const raw = completion.choices[0].message.content;
        let testCases = [];
        try {
            const cleaned = raw.replace(/```json|```/g, '').trim();
            testCases = JSON.parse(cleaned);
        } catch (err) {
            return res
                .status(500)
                .json({ error: 'Failed to parse GPT output', raw });
        }

        // Write CSV with BOM for Excel-friendly bullets
        const csvPath = path.join(__dirname, 'testcases.csv');

        const csvWriter = createObjectCsvWriter({
            path: csvPath,
            header: [
                { id: 'type', title: 'Type' },
                { id: 'name', title: 'Name' },
                { id: 'steps', title: 'Steps' },
                { id: 'expected_result', title: 'Expected Result' },
            ],
            encoding: 'utf8',
            append: false, // write headers every time
        });

        // Insert BOM manually before writing (Excel-friendly)
        fs.writeFileSync(csvPath, '\uFEFF', { flag: 'w' });

        const csvData = testCases.map((tc) => ({
            type: tc.type,
            name: tc.name,
            steps: tc.steps.join(' - '),
            expected_result: tc.expected_result,
        }));

        await csvWriter.writeRecords(csvData);

        res.json({
            testCases,
            csvPath,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add this endpoint at the bottom, after /generate-testcases
app.get('/download-csv', (req, res) => {
    const csvPath = path.join(__dirname, 'testcases.csv');
    res.download(csvPath, 'testcases.csv', (err) => {
        if (err) console.error('CSV download error:', err);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(
        `Personal Custom GPT QA generator running on http://localhost:${PORT}`,
    );
});
