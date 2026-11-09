# Yatra Portal – setup guide for the new features

## 1. Upload to GitHub (same folder as before)
- `index.html` and `sw.js` (replace the old ones).
- `.github/workflows/supabase-keepalive.yml` (create the folders `.github/workflows` if they do not exist).

## 2. Keep Supabase from pausing
1. GitHub repo → Settings → Secrets and variables → Actions → New repository secret.
2. Add `SUPABASE_URL` (like `https://xxxx.supabase.co`) and `SUPABASE_ANON_KEY` (the anon key already used in the site).
3. Repo → Actions tab → "Keep Supabase awake" → Run workflow once to test (a green tick means it works).
It then runs every 3 days. GitHub stops scheduled runs if the repo has no activity for 60 days, so open Actions and press Run workflow now and then, or make any small edit.

## 3. Supabase SQL (once)
Supabase → SQL editor → paste `supabase-extra-setup.sql` → Run. This creates the two storage folders for AI voices and reminder pictures.

## 4. RailRadar key (live train status)
railradar.in → sign up → dashboard → API keys → Create key. Open the Map page as admin and paste it. Free plan: 100 requests a month, so set "Refresh gap" to 60 minutes.

## 5. YouTube key (optional)
console.cloud.google.com → new project → enable "YouTube Data API v3" → Credentials → Create API key → restrict to your GitHub Pages address → paste it in Videos as admin.

## 6. 15-minute reminders with a picture
The portal now adds a reminder 15 minutes before every train and stay for each person, with a ticket or hotel picture. The reminder travels through your existing `tick` Supabase function. In that function, where it builds the push message for an alarm, also pass the extra fields:

    body:  a.body,
    image: a.image,
    kind:  a.kind || 'alarm'

If you paste your `tick` function here, I will make this change for you. Pictures show on Android. iPhone shows the text but not the picture (Apple does not support it for web notifications).

## 7. AI story voice (ElevenLabs)
Later, when the story text is final: in a place story, as admin, tap "🎙 AI", paste the ElevenLabs key and voice ID, tap "Create voice for this place". Each chapter is made once and then plays on every phone. Until then the best voice installed on the phone is used.
