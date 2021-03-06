import * as core from "@actions/core";

import JiraClient from "jira-connector";

const IssueClient = require("jira-connector/api/issue");
const BoardClient = require("jira-connector/api/board");

const jiraEmail = process.env.JIRA_EMAIL;
const jiraToken = process.env.JIRA_TOKEN;

export const createNewJira = async (
  host: string,
  project: string,
  storyPoints: number,
  PRTitle: string,
  PRUrl: string
): Promise<string | undefined> => {
  core.debug(
    `Creating new jira for project:${project} and story points:${storyPoints}`
  );

  const jiraClient = new JiraClient({
    host,
    basic_auth: {
      email: jiraEmail,
      api_token: jiraToken
    }
  });

  try {
    const currentSprint = await getCurrentSprint(project, jiraClient);
    const issueClient = new IssueClient(jiraClient);
    const createIssueResult = await issueClient.createIssue({
      fields: {
        project: {
          key: project.toUpperCase()
        },
        summary: PRTitle,
        description: `This Jira is tracking the work from the following PR:\n${PRUrl}`,
        issuetype: {
          name: "Story"
        },
        customfield_10014: storyPoints, // Story points
        customfield_10010: currentSprint // Sprint
      }
    });

    const key = createIssueResult.key;
    if (key) {
      core.debug("Create Jira was successful");
      return key;
    } else {
      core.setFailed(
        `Unable to create Jira. Status: ${createIssueResult.status}`
      );
    }
  } catch (e) {
    core.setFailed(`Unable to create Jira. Error: ${e}`);
  }
};

const getCurrentSprint = async (project: string, jiraClient: JiraClient) => {
  const boardClient = new BoardClient(jiraClient);

  // First get the current board
  const allBoardResults = await boardClient.getAllBoards({
    projectKeyOrId: project.toUpperCase()
  });

  // Now find the active sprint for the board
  if (allBoardResults.values && allBoardResults.values[0]) {
    const boardId = allBoardResults.values[0].id;
    const allSprintResults = await boardClient.getAllSprints({
      boardId,
      state: "active"
    });

    if (allSprintResults.values && allSprintResults.values[0]) {
      return parseInt(allSprintResults.values[0].id);
    }
  }

  return null;
};
