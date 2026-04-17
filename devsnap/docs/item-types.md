# Item Types

DevSnap supports 7 built-in item types. Each maps to a row in the `ItemType` table with a name, icon, and color.

---

## Types

| Type    | Icon (Lucide)  | DB Hex    | Tailwind (UI)      | Content Class |
|---------|---------------|-----------|---------------------|---------------|
| Snippet | `Code`        | `#3b82f6` | `text-violet-400`  | Text          |
| Prompt  | `Sparkles`    | `#8b5cf6` | `text-blue-400`    | Text          |
| Command | `Terminal`    | `#f97316` | `text-emerald-400` | Text          |
| Note    | `StickyNote`  | `#fde047` | `text-yellow-400`  | Text          |
| File    | `File`        | `#6b7280` | `text-red-400`     | File (Pro)    |
| Image   | `ImageIcon`   | `#ec4899` | `text-orange-400`  | File (Pro)    |
| Link    | `Link`        | `#10b981` | `text-sky-400`     | URL           |

---

## Per-Type Details

### Snippet
- **Purpose**: Reusable code blocks with syntax highlighting
- **Key fields**: `content`, `language`
- **`contentType`**: `"text"`

### Prompt
- **Purpose**: AI prompt templates and workflow instructions
- **Key fields**: `content`
- **`contentType`**: `"text"`

### Command
- **Purpose**: Shell commands and terminal operations
- **Key fields**: `content`
- **`contentType`**: `"text"`

### Note
- **Purpose**: Free-form text notes and documentation
- **Key fields**: `content`, `description`
- **`contentType`**: `"text"`

### File
- **Purpose**: Attached documents and templates (Pro only)
- **Key fields**: `fileUrl`, `fileName`, `fileSize`
- **`contentType`**: `"text"` (file URL stored separately)

### Image
- **Purpose**: Visual assets stored in Cloudflare R2 (Pro only)
- **Key fields**: `fileUrl`, `fileName`, `fileSize`
- **`contentType`**: `"text"` (file URL stored separately)

### Link
- **Purpose**: External URLs and web resource references
- **Key fields**: `url`, `description`
- **`contentType`**: `"text"`

---

## Shared Properties

All items share: `id`, `title`, `description`, `isFavorite`, `isPinned`, `userId`, `typeId`, `collectionId`, `tags`, `createdAt`, `updatedAt`.

---

## Content Classification

| Class | Types                        | Primary field(s)           |
|-------|------------------------------|----------------------------|
| Text  | Snippet, Prompt, Command, Note | `content` (+ `language` for Snippet) |
| File  | File, Image                  | `fileUrl`, `fileName`, `fileSize` |
| URL   | Link                         | `url`                      |

---

## Display Differences

- **Snippets**: render with syntax highlighting using `language` field
- **Files / Images**: show download/preview link from `fileUrl`
- **Links**: render `url` as a clickable anchor; show `description` as subtitle
- **All text types**: render `content` as plain text or markdown (Note)
- **Left border & badge color**: driven by the `color` hex stored on `ItemType` in the database
- **Sidebar icons**: icon name stored as PascalCase string (e.g. `"StickyNote"`) and mapped to Lucide components via `iconMap` in `Sidebar.tsx`
- **Pro badge**: File and Image types display a PRO badge in the sidebar nav

---

## Notes

- Icon names in DB use PascalCase (`"Code"`, `"Sparkles"`, etc.) and are lowercased for Lucide icon lookup in components.
- DB hex colors are used for item card left borders and type badges; Tailwind color classes are used in icon display within lists.
- `contentType` field on `Item` currently always holds `"text"` regardless of the actual content class — the actual content class is inferred from which fields (`content` vs `fileUrl` vs `url`) are populated.
