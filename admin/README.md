# ⚠️ DEPRECATED — Do Not Deploy

This `admin/` directory is a legacy standalone app from the original single-tenant codebase.

**All functionality has been migrated into `frontend/`** which is the single BookmyX application.

| Panel | URL | Handled by |
|---|---|---|
| Customer booking | `/{slug}` | `frontend/src/pages/ShopHome.jsx` |
| Vendor admin | `/{slug}/admin/*` | `frontend/src/pages/admin/*` |
| Stylist panel | `/{slug}/stylist/*` | `frontend/src/pages/stylist/*` |
| Super admin | `/super-admin/*` | `frontend/src/pages/superadmin/*` |

**Do not create a Vercel project for this directory.** The root `vercel.json` deploys `frontend/` as the only SPA.
