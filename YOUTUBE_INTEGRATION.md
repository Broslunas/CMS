# YouTube Integration Setup

To enable the "Add from YouTube" feature in the Clips Editor, follow these steps:

## 1. Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "Broslunas CMS").
3. Make sure to select or create a project.

## 2. Enable YouTube Data API

1. In the sidebar, go to **APIs & Services** > **Library**.
2. Search for "YouTube Data API v3".
3. Click on the result and then click **Enable**.

## 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** (unless you are in a Google Workspace organization and want it internal).
3. Fill in the required fields:
   - **App name**: Broslunas CMS
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue**.
5. In the **Scopes** step:
   - Click **Add or Remove Scopes**.
   - Search for and select:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `.../auth/youtube.readonly`
   - Click **Update**.
   - Click **Save and Continue**.
6. In the **Test Users** step:
   - Click **Add Users**.
   - Enter the email address of the Google account (YouTube channel) you want to use for testing.
   - Click **Save and Continue**.

## 4. Create Credentials

1. Go to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **OAuth client ID**.
3. **Application type**: Web application.
4. **Name**: Broslunas CMS Local.
5. **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - (Include your production domain if deploying)
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - (Include your production callback URL if deploying)
7. Click **Create**.
8. Copy the **Client ID** and **Client Secret**.

## 5. Add to .env

Add the following variables to your `.env` (and `.env.local`) file:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 6. Usage

1. Restart your development server (`npm run dev`).
2. Go to the Post Editor and open the Clips Editor section.
3. Click **Add from YouTube**.
4. If not connected, click **Connect YouTube Channel**. This will redirect you to Google to authorize the app.
5. After authorization, you will be redirected back.
6. Click **Add from YouTube** again to see and select your videos.
