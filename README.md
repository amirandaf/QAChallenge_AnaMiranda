## Prerequisites

1. **Node.js**: Ensure you have Node.js installed (>=16.x).
2. **Playwright**: This project uses Playwright for browser automation. All necessary dependencies will be installed with the `npm install` command.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/amirandaf/QAChallenge_AnaMiranda.git
   cd QAChallenge_AnaMiranda
2. Install dependencies
	 ```bash
	 npm install
	 npx playwright install
	  ```
3. Execute the tests and show report
   ```bash
	 npx playwright test --project=chromium --workers=2 (all test)
	 npx playwright test --ui (interactive and visual interface)
	 npx playwright show-report
	 ```
	 
## Proyect structure
- **/data-test**: is the folder where the data for the tests are stored.
- **/pages**: is the folder with the objects representing the different pages
- **/test**:is the folder containing the tests
- **QAChalenge_UseCases_bugs.xlsx**: contains the use cases, test cases, and bugs. The use cases are on the first sheet, the test cases are on the second sheet, and the bugs are on the third sheet.

A “Page Object Model” was used, where the login, To Do and folder pages were modeled. Each object has the necessary locators for testing and the actions to iterate each test case.
In addition, a KISS design pattern has been used, where some objects have similar functions that could be refactored but it has been decided to keep them separately for future scalability.	  
