import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse(
    await readFile(new URL('./clinikk-b434d-firebase-adminsdk-fbsvc-cd0a2eb10b.json', import.meta.url))
  );

export default serviceAccount;