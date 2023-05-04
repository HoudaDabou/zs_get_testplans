# zs_get_testplans
Node script based on Zephyr Scale Server REST API:https://support.smartbear.com/zephyr-scale-server/api-docs/v1

It search for test plans in a given project and returns a json file that maps each test plan and its corresponding test runs.

#### Requirements
NodeJs 14.x

## How to use

#### Install dependencies with:

```
npm install
```

#### Run the script with:

```
AUTH=username:password JIRA_BASE_URL=<source_jira_url> PROJECT_KEY=<your_project_key> node get_testplans.js 
```
The script returns this json output: ```get_test_plans.json```
