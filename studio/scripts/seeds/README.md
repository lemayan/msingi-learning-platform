# Seed Scripts

This folder contains scripts to author, resolve, build, and import sample content into the Sanity dataset.

## Usage

You can run these scripts using the "npm run" commands added to the studio "package.json":

1. **Resolve Videos**: Fetches real YouTube videos and caches them in "videos.json"
   ```bash
   npm run seed:videos
   ```
2. **Build NDJSON**: Compiles "content.mjs" and "videos.json" into "seed.ndjson"
   ```bash
   npm run seed:build
   ```
3. **Import to Sanity**: Pushes "seed.ndjson" to the production dataset using the Sanity CLI
   ```bash
   npm run seed:import
   ```

## Files
- "content.mjs": The handwritten source-of-truth curriculum.
- "resolve-videos.mjs": Fetches real YouTube data.
- "build-ndjson.mjs": Runs validations and outputs the final ".ndjson".
- "videos.json": Local cache of video data to save API requests.
- "seed.ndjson": The final compiled dataset ready for import.
