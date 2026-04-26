# EduBridge Connect (Mobile Chat UI)

A lightweight two-user chat web app with an iPhone-like mobile UI and WhatsApp-inspired green accents.

## Fixed users

- `muskan` / `muskan@112`
- `shariff` / `shariff@112`

## Permission model

- `shariff` has admin access:
  - Delete individual messages
  - Clear all messages
  - Export chat transcript
- `muskan` can send and read messages, without delete controls.

## Run locally

```bash
python3 -m http.server 5173
```

Then open: <http://localhost:5173>

## Deploy (quickest free option: Netlify Drop)

1. Zip this folder.
2. Go to <https://app.netlify.com/drop>
3. Drag and drop the zip.
4. Netlify returns a live URL and shareable download artifacts for your deployment snapshot.

## Notes

- Messages are stored in browser `localStorage`.
- This is a front-end demo app (no backend/database).
