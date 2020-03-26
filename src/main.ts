import * as core from "@actions/core";
import * as github from "@actions/github";
import { createNewJira } from "./jira";

async function run(): Promise<void> {
  try {
    const project = core.getInput("project");
    const storyPoints = core.getInput("story-points");
    const domain = core.getInput("host");

    if (project.length === 0 || storyPoints.length === 0) {
      core.setFailed(
        "Error: project and story-points are both required inputs and must not be empty"
      );
    }

    console.log(
      `Starting action with project:${project} storyPoints:${storyPoints} host:${domain}`
    );
    console.log("Github context", github.context);

    // await createNewJira(project, parseInt(storyPoints));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
