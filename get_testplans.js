const https = require('https');
const fs = require('fs');

const auth = process.env.AUTH;
const authToken = Buffer.from(auth).toString('base64');
const jira_baseUrl = process.env.JIRA_BASE_URL;
const searchQuery = `projectKey = "${process.env.PROJECT_KEY}"`;

function getTestPlans(url, authToken) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      };
      const req = https.request(url, options, (res) => {
        let response = '';
        res.on('data', (chunk) => {
          response += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(response));
          } else {
            reject(new Error(`Request failed. Status code: ${res.statusCode}\n${response}`));
          }
        });
      });
      req.on('error', (error) => {
        reject(error);
      });
      req.end();
    });
  }

async function generateTestRunKeysFile(projectKey) {
    try {
      const testPlanUrl = `${jira_baseUrl}/rest/atm/1.0/testplan/search?query=${encodeURIComponent(projectKey)}&maxResults=200`;
      const response = await getTestPlans(testPlanUrl, authToken);
      const testPlans = response.map((testPlan) => {
        const testRunKeys = testPlan.testRuns.map((testRun) => testRun.key);
        return {
          key: testPlan.key,
          name: testPlan.name,
          testRunKeys: testRunKeys
        };
      });

      const jsonData = JSON.stringify(testPlans, null, 2);
      fs.writeFile('get_test_plans.json', jsonData, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Test plans data written to get_test_plans.json file');
        }
      });


    } catch (error) {
      console.error('Error generating test plans file:', error.message);
    }
  }


generateTestRunKeysFile(searchQuery);

