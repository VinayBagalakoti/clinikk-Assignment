import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse(
    await readFile(new URL('./clinikk-b434d-firebase-adminsdk-fbsvc-389f28bd13.json', import.meta.url))
  );

export default serviceAccount;