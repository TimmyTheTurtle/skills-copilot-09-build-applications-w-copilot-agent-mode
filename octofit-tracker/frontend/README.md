# OctoFit Tracker Frontend

This frontend talks to the OctoFit Tracker backend through the GitHub Codespaces API URL pattern.

## Environment setup

Define a Vite environment variable before running the app:

```bash
cp .env.example .env.local
```

Set a valid value in `.env.local`:

```env
VITE_CODESPACE_NAME=your-codespace-name
```

The frontend will then use the API URL format:

```text
https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

If `VITE_CODESPACE_NAME` is not defined, the app falls back to `http://localhost:8000` so it does not generate `https://undefined-8000...` requests.
