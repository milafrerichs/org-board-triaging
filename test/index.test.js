const nock = require("nock");
// Requiring our app implementation
const myProbotApp = require("..");
const { Probot, ProbotOctokit } = require("probot");
// Requiring our fixtures
const payload = require("./fixtures/issues.opened");
const issueCreatedBody = { body: "Thanks for opening this issue!" };
const fs = require("fs");
const path = require("path");
const queries = require('../queries');
const mutations = require('../mutations');

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8"
);

describe("My Probot app", () => {
  let probot;

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({
      appId: 109789,
      githubToken: "test",
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    probot.load(myProbotApp);
  });

  test("triage issue to specified board column id", async () => {
    let data = { organization: { projects: { edges: [ { node: { columns: { edges: [ {node: { id: 1 }} ] } } } ] }}  }
    const variables = {owner: 'CivicVision', projectName: 'Test', column: 1}

    const mock = nock('https://api.github.com')
      .get('/repos/CivicVision/testing-triaging/contents/.github%2Ftriaging.yml')
      .reply(200, "")

      .post('/graphql', {query: queries.findProjectColumnByNumber, variables})
      .reply(200, { data  })

      .post('/graphql', {query: mutations.addProjectCard, variables: { issue: {  contentId: "1=", projectColumnId: 1 }}})
      .reply(200)

    const nockCalls = nock.recorder.play()
    // Receive a webhook event
    await probot.receive({ name: "issues", payload });

    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
