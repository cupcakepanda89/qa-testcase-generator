function getTestCasePrompt(requirement) {
    return `
You are a QA engineer. Generate test cases for the following requirement:
"${requirement}"

Output a JSON array like this:
[
  {
    "type": "positive|negative|regression",
    "name": "Test case name",
    "steps": ["Step 1", "Step 2"],
    "expected_result": "Expected result"
  }
]

Use plain steps, short names, and include regression cases where appropriate.
`;
}

module.exports = { getTestCasePrompt };
