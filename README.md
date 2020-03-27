# create-jira

This Github action takes a Jira host, project key, and story points as inputs, generates a Jira in the current sprint of that project's main board, and outputs the URL of that issue. 

```
inputs:
  host:
    description: 'The Jira host'
    required: true
  project:
    description: 'The project where the issue should be created'
    required: true
  story-points:
    description: 'The number of story points the issue should have'
    required: true
outputs:
  url:
    description: 'The url of the Jira that was created'
```

## Building

This action is set up to be built using a Dockerfile in the root directory. Github will automatically build an image and run this action inside that container.
