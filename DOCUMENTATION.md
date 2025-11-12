# 📸 Image Handling Pipeline Documentation

_Last updated: November 2025_

This document describes how images are processed, optimized, and displayed in the app — from the moment a user drops them to when they are shown in the gallery or session.

---

## 🧭 Overview

The image system is built around **simplicity**, **performance**, and **clarity**:

- **SOLID:** each module has one job (drop, preview, display, prefetch…)
- **DRY:** shared logic is extracted into small utilities/hooks
- **KISS:** minimal complexity, maximum clarity
- **A11y-friendly:** all user actions provide accessible feedback (toasts, labels, live regions)

---

## 🔄 Flow Summary

| Step                  | Component / File                           | Responsibility                                                 |
| --------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| 1️⃣ Drop / Select      | `ImageDrop.tsx`                            | Accept user input, validate, dedupe, show toasts, store images |
| 2️⃣ Preview Generation | `imagePreview.ts` + `Thumb.tsx`            | Downscale images for lightweight previews                      |
| 3️⃣ Grid Display       | `ImageGrid.tsx`                            | Display thumbnails, show counts, handle collapse/expand        |
| 4️⃣ Count Badge        | `CountBadge.tsx`                           | Reusable badge showing total & hidden counts                   |
| 5️⃣ Prefetch           | `imagePrefetch.ts` + `useImagePrefetch.ts` | Preload upcoming images in background                          |
| 6️⃣ Session (future)   | TBD                                        | Use full-quality images already cached by prefetch queue       |

---

## 🧱 1. Image Input — `ImageDrop.tsx`

Handles **drag & drop** or **file picker** uploads.

### Key steps

1. **De-duplication**
   - Uses `file.name + size + lastModified` as a unique signature.
   - Implemented in `/src/utils/fileDedup.ts` via `dedupeFiles(files)`
   - Shows a toast:
     ```
     2 duplicate files ignored
     ```

2. **Validation**
   - Checks accepted file types & max size.
   - Errors displayed as **individual toasts** (Squarespace style):
     - Clear, short, one per issue.
     - No inline stacking under the drop zone.

3. **Normalization**
   - Accepted files are transformed into `ImageItem` models (kept in store).
   - Each image keeps:
     - `url`: full-quality URL (from `File` or object URL)
     - `file`: optional original `File` (used for previews)

4. **State update**
   - Images are added to Zustand store:  
     `useStore((s) => s.addImages)`

---

## 🌄 2. Thumbnail Previews — `imagePreview.ts` + `Thumb.tsx`

### Why

Rendering 20+ full-quality images in a grid is slow.  
We generate **small, optimized previews** just for display.

### How it works

1. Each `Thumb`:
   - Calls `getPreviewURL()` with the original file or URL.
   - Downscales to `max 512px`, JPEG quality `0.6`.
   - Caches preview blob in memory.
   - Falls back to original if downscale fails.
2. On unmount, previews are revoked to free memory.

### Result

- **Grid loads instantly** with light JPEGs.
- **Session view** still uses original high-res images.
- **Memory safe**: URLs cleaned up automatically.

---

## 🖼️ 3. Image Grid — `ImageGrid.tsx`

Displays all uploaded images.

### Features

- Responsive grid (via `useResponsiveColumns()`).
- Collapsible layout:
  - Shows only the first row when collapsed.
  - Displays a `+X more` overlay on the last visible image.
  - "Hide" button collapses again.
- Includes a `ConfirmDialog` to clear all images safely.

### Count badges

Integrated using the reusable component below.

---

## 🔢 4. Count Badge — `CountBadge.tsx`

Simple UI wrapper around shadcn’s `<Badge>`.

### Usage

```tsx
<CountBadge count={total} variant="secondary" />
<CountBadge count={hidden} variant="outline" />
```

### Accessibility

- Uses aria-label like:
  `"Total images: 12" or "3 hidden thumbnails"`

* Only visible when count > 0.

## 🚀 5. Prefetch Queue — imagePrefetch.ts + useImagePrefetch.ts

### Goal

When the grid is collapsed, quietly prefetch the next unseen images.

### Implementation

- `ImagePrefetchQueue` manages a small concurrency-limited queue:
  - Default: `2` concurrent loads, up to `10` images.

  - Uses `new Image().src = url` with `requestIdleCallback` for efficiency.

  - Dedupes URLs automatically.

- `useImagePrefetch()` React hook wraps it.

### In `ImageGrid.tsx``

```tsx
const toPrefetch = images.slice(visibleWhenCollapsed, visibleWhenCollapsed + 10).map((i) => i.url);
useImagePrefetch(toPrefetch, { concurrency: 2, limit: 10 });
```

### Benefits

- Images appear instantly when expanding the gallery or entering a session.

- Controlled concurrency → no network flood.

- Works for both full-quality and preview URLs.

## 🧩 Utilities

| File                | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| fileDedup.ts        | Generate unique file signatures and filter duplicates |
| imagePreview.ts     | Downscale & cache preview images                      |
| imagePrefetch.ts    | Small prefetch queue for background loading           |
| useImagePrefetch.ts | React hook for the queue                              |

## ⚙️ Optional Future Enhancements

| Idea                        | Benefit                               |
| --------------------------- | ------------------------------------- |
| Persistent dedupe           | Skip already-added files across drops |
| Store-level preview cache   | Keep previews when navigating         |
| Blur-up placeholders (LQIP) | Better visual transition              |
| WebP previews               | Smaller previews (vs. JPEG)           |

## 📁 File Structure Summary

```src/
├─ components/
│  ├─ ImageDrop.tsx
│  ├─ ImageGrid.tsx
│  ├─ Thumb.tsx
│  ├─ CountBadge.tsx
│  └─ dialog/
│     └─ ConfirmDialog.tsx
├─ hooks/
│  └─ useImagePrefetch.ts
├─ utils/
│  ├─ fileDedup.ts
│  ├─ imagePreview.ts
│  └─ imagePrefetch.ts
└─ store/
   └─ index.ts (Zustand store)
```

## 💡 Quick Mental Model

```User drops files
   ↓
ImageDrop → dedupe → validate → store
   ↓
ImageGrid → shows lightweight previews
   ↓
Thumb → downscaled image (fast)
   ↓
Prefetch queue → prepares next images silently
   ↓
Session → instantly shows full-quality images
```

## 🧠 Key Takeaways

- **UX first**: fast, clear feedback and minimal waiting.

- **Efficient**: low network + memory footprint.

- **Modular**: each file does one thing well.

- **Future-proof**: easy to extend (e.g., persist previews, lazy-load sessions).
