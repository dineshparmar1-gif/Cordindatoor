# Dashboard: Apps Script (data) + Vercel (website). No service account needed.

## Step 1 - Apps Script (folder 1-apps-script)
1. script.google.com -> New project. Paste Code.gs. Project Settings -> show appsscript.json -> paste it.
2. Project Settings -> Script Properties -> add ADMIN_PIN = your secret PIN (only for saving targets).
3. Run `installTrigger` once and authorize (adds the form-submit sync).
4. Deploy -> New deployment -> Web app -> Execute as: Me, Who has access: Anyone -> Deploy.
5. Copy the Web app URL (ends with /exec). Test it in a browser: you should see JSON with your headers/rows.
   (If you edit Code.gs later: Deploy -> Manage deployments -> edit -> New version.)

## Step 2 - Vercel (folder 2-vercel)
1. Open 2-vercel/config.js and paste the URL from step 1.
2. Push the CONTENTS of 2-vercel (index.html, config.js) to the ROOT of a GitHub repo.
3. Vercel -> Add New Project -> import repo -> Framework Preset: Other -> Deploy.
4. Open the Vercel URL: the dashboard loads directly, no login.

## Notes
- The sheet is not public; only your script reads it (read-only).
- The Apps Script URL is unguessable but open to anyone who has it. Don't share it publicly.
- Saving targets needs the ADMIN_PIN.
