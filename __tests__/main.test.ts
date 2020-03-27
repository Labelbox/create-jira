import { createNewJira } from '../src/jira';

test('Test Jira', async () => {
  await createNewJira('labelbox.atlassian.net', 'eng', 5, "Test Title", "Test URL");
});
