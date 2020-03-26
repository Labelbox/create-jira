import { createNewJira } from '../src/jira';

test('Test Jira', async () => {
  await createNewJira('eng', 5);
});
