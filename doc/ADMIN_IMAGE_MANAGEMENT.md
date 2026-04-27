# Admin image management

This document describes the **image library** feature: admin UI, HTTP API, on-disk storage, and how the client references uploaded images. There is **no** SQL database for this feature; metadata is kept in memory on the server process plus a small JSON file for “default image” selections.

---

## Feature overview

| Item            | Description                                                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose         | Upload and manage images in two **categories** (`product`, `label`), and optionally set which file is the default selection per category.                 |
| Admin UI        | `/admin/images` — full library (tabs: Product / Label). A **public** variant exists for a reduced UI when routed as `public` (see `admin.routes.map.ts`). |
| Persistence     | Files on disk under the configured uploads `images` tree; selection state in `_settings.json` next to that tree.                                          |
| In-memory index | The server holds a list of known files in RAM and rescans on startup; uploads append to that list.                                                        |

---

## Server

### Relevant files

| Path                                               | Role                                                         |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `apps/server/src/routes/images/images.handlers.ts` | List, upload, delete, settings, and binary file serving.     |
| `apps/server/src/routes/images/images.routes.ts`   | OpenAPI route definitions.                                   |
| `apps/server/src/routes/images/index.ts`           | Hono router: wires validators to handlers.                   |
| `apps/server/src/app.ts`                           | Mounts the images router under the shared API base path.     |
| `apps/server/src/constants/paths.constants.ts`     | `UPLOAD_PATHS.IMAGES_DIR`, `CONFIG_PATHS.IMAGE_SETTINGS`.    |
| `apps/server/src/utils/mime.utils.ts`              | Serves `Content-Type` for stored files (e.g. `webp`, `gif`). |

### API base path

All routes below are **relative to** `envShared.API_BASE_PATH` (commonly `/api`). Full URLs look like: `https://<host>:<api-port>/api/images/...`.

### HTTP API (summary)

| Method   | Path                      | Description                                                     |
| -------- | ------------------------- | --------------------------------------------------------------- |
| `GET`    | `/images`                 | All image records (both categories), as JSON.                   |
| `GET`    | `/images/:type`           | `type` is `product` or `label` — files for that category only.  |
| `POST`   | `/images/:type/upload`    | Multipart form: field name **`files`** (repeat for multiple).   |
| `DELETE` | `/images/:id`             | Remove by file id (stem of stored filename).                    |
| `DELETE` | `/images/:type/:id`       | Remove a file in a specific category (preferred by the client). |
| `GET`    | `/images/settings`        | JSON: `{ "product": "<id> \| null", "label": "<id> \| null" }`. |
| `PUT`    | `/images/settings`        | Body: same shape; ids must refer to known files.                |
| `GET`    | `/images/files/:filename` | **Public GET** of raw bytes; used for `<img src>` and previews. |

### How files are saved on disk

1. **Root directory** — `UPLOAD_PATHS.IMAGES_DIR` from `apps/server/src/constants/paths.constants.ts` (resolved via `@workspace/config` `paths.uploads` — the exact absolute path depends on your deployment; often under a project `data/uploads`-style location).

2. **Per-category subfolders** — `product` and `label` under that root:
   - `.../images/product/`
   - `.../images/label/`

3. **Generated filename** — for each upload:

   `image-{slugifiedOriginalName}-{timestamp}-{shortHash}.{ext}`

   Example: `image-my-photo-1760000000000-a3b2.png`

4. **Identity** — `id` in API responses is the **filename without extension** (the full stem, including `image-` prefix and hash).

5. **Rules** — extensions allowed: `png`, `jpg`, `jpeg`, `webp`, `gif`, `svg`. Max size **10 MB** per file (see `MAX_IMAGE_BYTES` in the handler).

6. **Settings file** — `CONFIG_PATHS.IMAGE_SETTINGS` → `.../images/_settings.json` stores the chosen default `product` and `label` file ids. It is written when settings change or when invalid ids are cleared after a rescan.

7. **Startup** — the handler scans `product` and `label` directories for files whose names start with `image-` and rebuilds the in-memory list. Files starting with `_` or not matching the expected pattern are skipped from that scan as appropriate (see handler).

---

## Client

### Relevant files

| Area              | Path                                                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin page        | `apps/client/src/admin/pages/AdminImagesPage/AdminImagesPage.tsx`                                                                                                            |
| Public page       | `apps/client/src/admin/pages/AdminImagesPage/PublicImagesPage.tsx`                                                                                                           |
| Sections          | `.../components/SelectedImageSection.tsx` (default image + preview), `ImagesLibrarySection.tsx` (thumbnails, remove), `FileUploadSection.tsx` (file input + upload mutation) |
| Types             | `apps/client/src/types/images.types.ts` — `ImageCategory`, `ImageFile`, `ImageSettings`                                                                                      |
| API wrapper       | `apps/client/src/api/endpoints/images.endpoints.ts` — `ImagesEndpoints`                                                                                                      |
| Public URL helper | `apps/client/src/utils/imageUrls.ts` — `getImageFilePublicUrl`                                                                                                               |
| React Query       | `apps/client/src/queries/images/*` — `useGetImageFiles`, `useGetImageSettings`, `useUpdateImageSettings`, `useUploadImageFiles`, `useRemoveImageFile`                        |
| i18n              | `packages/i18n/translations/admin/{en-GB,es-ES,ca-ES}.json` — keys `admin.pages.images` and `admin.pages.images_public`                                                      |

The client’s shared `api` client prefixes requests with the configured API URL; uploads use `FormData` with `files` repeated, matching the server.

### How to fetch or display an image in the client

1. **List metadata (JSON)** — `ImagesEndpoints.getFiles(category?)` or the hooks above. Each `ImageFile` includes at least: `id`, `name`, `filePath` (server-side filename), `type` (MIME), `size`, `uploadedAt`, and `url` (a path-like string; the app also builds explicit browser URLs for images — see below).

2. **Binary URL for `<img>`, background, or `window.open`** — use the **filename** from `filePath` (or parse from `url`):

   ```ts
   import { getImageFilePublicUrl } from 'utils/imageUrls';

   const src = getImageFilePublicUrl(imageFile.filePath!);
   // => "/api/images/files/<encoded-filename>"
   ```

   In development, the Vite dev server typically **proxies** `/api` to the API (e.g. port 4040), so a **relative** URL works in the browser. In production, the app is often served from the same host as the API; adjust if your deploy splits origins (then you may need an absolute base URL from env).

3. **Credentials** — if your API uses cookie-based auth, `fetch` for JSON uses your existing `api` client; for plain `<img src="/api/...">`, the browser sends cookies for **same-origin** requests. If the image host differs from the page origin, you may need tokens or a public, unauthenticated GET for static files (current handler serves GET without special client headers beyond normal browsing).

4. **Default image id** — read `useGetImageSettings()` → `product` and `label` are **file id strings** (stems) or `null`. Match those ids to an entry from `useGetImageFiles` to resolve `filePath` for display.

---

## Operational notes

- **Backups** — back up the on-disk `images` folder and `_settings.json` with your other upload data.
- **Restart** — in-memory file list is rebuilt at server start from disk; after copying files manually, restart the API or use only the upload API so state stays consistent.
- **Parity with sounds** — the pattern matches `apps/server/src/routes/sounds/` (JSON settings + subfolders + serve route), but image uploads do not run audio conversion; validation is extension + size only.

---

## Quick reference: flow from upload to UI

1. User picks files in `FileUploadSection` → `POST /api/images/{product|label}/upload` with `FormData` field `files`.
2. Server writes under `images/{category}/` and returns `ImageFile[]`.
3. React Query invalidates list queries; library and configuration sections refresh.
4. Thumbnails and previews use `getImageFilePublicUrl(filePath)` → `GET /api/images/files/:filename` for bytes.

For questions about route registration or env, see `apps/server/src/app.ts` and `@workspace/config` for `paths` / `API_BASE_PATH`.
