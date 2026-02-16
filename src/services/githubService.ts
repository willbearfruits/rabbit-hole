import { exportDatabase } from './mockDb';

const GITHUB_API_BASE = 'https://api.github.com';

// You need to fill these in or pass them as arguments. 
// Ideally, we extract them from the current window URL or config, 
// but for your specific repo we can default them:
const OWNER = 'willbearfruits';
const REPO = 'rabbit-hole';
const FILE_PATH = 'public/database.json';

export const syncToGithub = async (token: string) => {
  if (!token) throw new Error("No GitHub Token provided");

  // 1. Get current file SHA (needed to update it)
  const getRes = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  let sha = '';
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  }

  // 2. Prepare new content (base64 encoded)
  const content = exportDatabase();
  // Safe base64 encoding for UTF-8 strings
  const base64Content = btoa(unescape(encodeURIComponent(content)));

  // 3. Commit the update
  const putRes = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: `content: auto-update database.json from admin panel`,
      content: base64Content,
      sha: sha || undefined, // If no SHA, it creates a new file
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(err.message || 'Failed to sync to GitHub');
  }

  return true;
};
