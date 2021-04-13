module.exports = `
  query FindProjectColumnByNumber($owner: String!, $projectName: String!, $column: Int!) {
    organization(login: $owner) {
      projects(first: 1, search: $projectName) {
        edges {
          node {
            columns(first: $column) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`
