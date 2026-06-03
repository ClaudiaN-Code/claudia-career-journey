# Skill: Add Images to the Site

Use this skill any time Claudia wants to add screenshots or images to a personal project card on her career journey site.

## When to use
- Adding screenshots to a Builds & Projects personal project card
- Updating existing image carousels on project cards

## Steps

### 1. Copy image files to the public folder
Images must be in the `public/` folder to be served by Vercel.

```bash
cp "/path/to/source-image.png" "/Users/claudia/Downloads/Build Beautifully - Course Event-1-v1/my-landing/public/descriptive-name.png"
```

Use clean, descriptive kebab-case filenames (e.g. `tres-hearts-home.png`, `project-dashboard.png`).

### 2. Update data/builds.json
Add the image paths to the `imageUrls` array of the matching personal project card.
The paths should start with `/` (served from public root).

```python
import json
with open('data/builds.json') as f:
    data = json.load(f)
for p in data['personalProjects']:
    if p['id'] == 'YOUR-PROJECT-ID':
        p['imageUrls'] = [
            '/image-1.png',
            '/image-2.png',
            # add more as needed
        ]
with open('data/builds.json', 'w') as f:
    json.dump(data, f, indent=2)
```

### 3. Commit and push
```bash
cd "/Users/claudia/Downloads/Build Beautifully - Course Event-1-v1/my-landing"
git add public/your-image.png data/builds.json
git commit -m "Add screenshots to [project name] card"
git pull --rebase origin main && git push origin main
```

## Notes
- Images render as a carousel on the card — arrows and dots appear automatically when there are 2+ images
- Clicking any image opens it in a full-screen lightbox (dismiss with click or Escape)
- Supported formats: PNG, JPG, WEBP
- Screenshots from macOS Desktop are typically at `/Users/claudia/Desktop/Screenshot YYYY-MM-DD at H.MM.SS XM.png`
- The admin panel (Admin → Builds & Projects → Personal Projects → Edit) also supports adding hosted image URLs directly
