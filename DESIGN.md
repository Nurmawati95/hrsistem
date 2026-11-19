# DESIGN.md

# Visual System: Loket Pelayanan Terpadu HR (Civil-Service Desk)

<!-- impeccable:world signals-instruments-split-flap-concourse/loket-kantor-pos -->

## Core Philosophy

Every HR module operates as a numbered service window ("Loket Layanan"). The system projects the authority, clarity, and accountability of an institutional public service counter, refusing startup frivolity and decorative clutter.

## Palette & Surface Colors

- **Shell & Navigation:** Deep Navy (`#0f274a`, `#16325c`, `#1b3a6b`)
- **Accent & Active State:** Amber / Gold (`#f59e0b`, `#f0a500`)
- **Work Area Background:** Clean Slate Light (`#f8fafc`) / Pure White (`#ffffff`)
- **Text:** Slate 900 (`#0f172a`), Muted Slate (`#64748b`)
- **Status Ticket Badges:**
    - **Hadir / Disetujui / Normal:** Emerald Green (`#059669`, `#10b981`, bg `#ecfdf5`)
    - **Terlambat / Pending / Peringatan:** Amber (`#d97706`, bg `#fffbeb`)
    - **Alfa / Ditolak / Kritis:** Red (`#dc2626`, bg `#fef2f2`)
    - **Tetap / Kontrak / Master Data:** Navy / Sky (`#0284c7`, bg `#f0f9ff`)

## Typography

- **UI & Prose:** Clean Sans (`Instrument Sans`, system fallback `ui-sans-serif`)
- **Tabular Data, IDs, Dates & Counters:** Monospace (`ui-monospace`, `monospace`)
- **Numbers:** Always tabular, high legibility

## Component Rules

- **Numbered Service Counters:** Sidebar and cards feature explicit two-digit identifiers (`01`, `02`, `03`...)
- **Status Badges:** Shaped like queue ticket stubs with borders and high-contrast status text
- **Tables:** Compact data density, sticky headers, subtle row hover highlighting
- **Logo:** Bespoke geometric shield with interlocking H & R and employee connectivity node (not default Laravel cube)
