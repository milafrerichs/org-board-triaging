const mutation = require('./mutations');
const queries = require('./queries');

module.exports = (app) => {
  app.on("issues.opened", async (context) => {
    const config = await context.config('triaging.yml', {
      owner: context.payload.organization.login || context.payload.sender.login || '',
      projectName: "Test",
      column: 1
    });
    try {
      const data = await context.octokit.graphql(queries.findProjectColumnByNumber, {
        "owner": config.owner,
        "projectName": config.projectName,
        "column": config.column
      });
      const { organization: { projects: { edges: boards } } } = data;
      const board = boards[0]
      const { node: { columns: { edges: nodes } } } = board;
      const column = nodes[0]
      const { node: { id: projectColumnId } } = column;
      context.octokit.graphql(mutation.addProjectCard, {
        issue: {
          contentId: context.payload.issue.node_id,
          projectColumnId
        }
      });
    } catch (error) {
      app.log.debug(error.errors, "Error");
    }
  });
};
