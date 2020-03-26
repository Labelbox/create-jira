import * as core from "@actions/core";
import * as github from "@actions/github";
import { createNewJira } from "./jira";

async function run(): Promise<void> {
  try {
    const project = core.getInput("project");
    const storyPoints = core.getInput("story-points");
    const domain = core.getInput("host");

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

    // Make sure this is only for a pull request
    const pullRequest = github.context.payload.client_payload.pull_request;
    if (!pullRequest) {
      core.setFailed("Error: this action is only supported for a pull request");
    }

    console.log(
      `Starting action with project:${project} storyPoints:${storyPoints} host:${domain}`
    );
    console.log("Pull Request", pullRequest);

    // await createNewJira(project, parseInt(storyPoints));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
