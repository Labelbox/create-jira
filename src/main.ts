import * as core from "@actions/core";
import * as github from "@actions/github";
import { createNewJira } from "./jira";

async function run(): Promise<void> {
  try {
    const project = core.getInput("project");
    const storyPoints = core.getInput("story-points");
    const host = core.getInput("host");

    // Make sure we have inputs
    if (
      !project ||
      project.length === 0 ||
      !storyPoints ||
      storyPoints.length === 0
    ) {
      core.setFailed(
        "Error: project and story-points are both required inputs and must not be empty"
      );
      return;
    }

    const numericStoryPoints = parseInt(storyPoints);
    if (isNaN(numericStoryPoints)) {
      core.setFailed("Error: story-points must be a number");
      return;
    }

    // Make sure this is only for a pull request
    const pullRequest = github.context.payload.client_payload.pull_request;
    if (!pullRequest) {
      core.setFailed("Error: this action is only supported for a pull request");
      return;
    }

    const PRTitle = pullRequest.title;
    const PRUrl = pullRequest.html_url;

    console.log(
      `Starting action with project:${project} storyPoints:${storyPoints} host:${host}`
    );

    const key = await createNewJira(
      host,
      project,
      numericStoryPoints,
      PRTitle,
      PRUrl
    );

    if (key) {
      const url = `https://${host}/browse/${key}`;
      core.setOutput("url", url);
    } else {
      core.setFailed("Did not generate a Jira URL");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
