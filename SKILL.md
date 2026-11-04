---
name: terrain-ui
description: Build web UI in a quiet industrial style distilled from game-menu conventions (paper and ink, one accent for "current" and "primary", selection that reads at a glance, pill secondary buttons, `//` path titles, faint closed contour lines). Use when asked for a page, portfolio, dashboard or component in this style, or in an "industrial", "terminal-like", "Endfield-inspired" or 终末地风格 look.
---

# Terrain UI

These rules were distilled from the interface of an industrial-themed game, keeping only what proved useful on ordinary web pages. The skill contains no game assets and does not try to recreate the game.

Read this whole file before you start. Open `assets/terrain.css` for colors and component markup, use `assets/contours.js` for the contour background, and see `references/research.md` for where each rule came from and why some things were left out.

## Eight rules

1. **One accent color, two meanings**: the current location and the primary action. Default `#FEEC00`, sampled from the selected tab in game. Use it only as a fill, with ink-colored text on top; in the light theme never use it for lines or text. The same applies to hover: only the primary button wipes in the accent on hover. Links, pill buttons and list rows just lighten or get a thicker underline.
2. **Selection depends on direction**:
   - Vertical lists: hover lightens the row; the selected row turns dark with light text, and an accent bar drops in on the left.
   - Horizontal tabs: the selected tab fills solid with the accent. On switch, the old block collapses and the new one opens sideways from its center.
3. **Button shape shows priority**: the primary action is a block with its bottom-right corner cut; secondary actions are pills with a round icon at the right end. At most one primary action per button group.
4. **Put a path at the top left of every page**: `// Work / About me`. Levels you can go back to are links.
5. **Numbers are decoration, and they must be true**: set IDs, dates and `current / total` counters in wide tabular figures. Never invent data or add fake technical text. The same holds for copy: describe a product (features, supported scope, installation) only from what the user gave or the project's own docs, and keep their scope. Where there is no source, write a placeholder such as `[TODO: ...]` instead of filling it in.
6. **Show key caps for shortcuts**: for example `←` `→` next to page buttons. Show them only on devices with a fine pointer.
7. **Background: closed contour lines**: one patch in each of two corners, 6% to 9% opacity, every fifth line heavier, not animated.
8. **Short, firm motion**: hover 90 ms, selection 110 to 120 ms, curve `cubic-bezier(.2,0,0,1)`. Turn everything off when the system asks to reduce motion.

## Pick a page type first

Decide which kind of page you are building before you start. All three share the same colors and components; they differ in how bold they get. When unsure, choose Reading.

| Type | Used for | How | In-game equivalent |
| --- | --- | --- | --- |
| Reading | Articles, project details, settings, help | One text column, about 65 Latin or 38 CJK characters wide; accent only on the current nav item and the primary button; contours optional | Encyclopedia, archives |
| Showcase | Home pages, portfolios, landing pages | Large wide headings, outline type allowed; large numbers as background; contours on; content may fade in block by block | Main menu, shop |
| Workbench | Admin pages, dashboards, tools, extension settings | Vertical list nav on the left, tabs on top; mostly tables, numbers and forms; no large headings; motion only in response to actions | Inventory, equipment, friend list |

## Components

All live in `assets/terrain.css` with the `tu-` prefix. `examples/demo.html` shows each one.

| Component | Classes | Notes |
| --- | --- | --- |
| Path title | `tu-crumb` | Rule 4 |
| Vertical list | `tu-list` | Mark the current item with `aria-current` |
| Horizontal tabs | `tu-tabs` `tu-tab` | Mark the current tab with `aria-selected="true"` or `aria-current` |
| Primary / secondary button | `tu-btn` / `tu-btn--pill` + `tu-btn__icon` | Rule 3 |
| Key hint | `tu-kbd` | Rule 6 |
| Field row | `tu-fields` `tu-sep` | Separate metadata with a vertical bar `│` |
| Panel | `tu-panel` | A flat block: no radius, shadow or border |
| Table | `tu-table-wrap` `tu-table` | Small wide header labels; right-align numeric columns with `tu-right`; scrolls sideways on narrow screens |
| Input | `tu-field` `tu-input` `tu-hint` | On focus the underline thickens and an accent bar appears on the left |
| Error | `tu-error`, plus `aria-invalid="true"` on the input | A small accent square and one sentence on how to fix it; no red text |
| Switch | `tu-switch` | "On" is a current state, so the track fills with the accent |
| Dialog | `<dialog class="tu-dialog">` | Buttons sit in a footer bar: one primary, cancel as a pill; it sharpens in from a blur |
| Toast | `tu-toast` | A dark bar with an accent bar on the left; slides in from the left and leaves after 2 seconds |
| Empty state | `tu-empty` | A dashed box with one sentence on what will appear here, optionally one primary button |
| Loading | `tu-progress`, plus `tu-progress--busy` while waiting | A 2 px line; when progress is known, set `--tu-value` and show the percentage |

No red. Warnings, failures and pending states use the small accent square with ink text. Put irreversible actions such as delete behind a confirmation dialog.

For anything not in this table, derive it from the eight rules: whether it is "current" or "primary" decides if it may use the accent; whether it is primary or secondary decides block or pill; whether it can be clicked decides if it lightens on hover.

## Motion

| Action | Duration | How |
| --- | --- | --- |
| Hover lighten | 90 ms | Background color transition |
| List selection bar drops in | 110 ms | `scaleY(0 → 1)` |
| Tab switch | 120 ms | Accent block `scaleX(0 → 1)`, opening from the center |
| Primary button hover | 280 ms | Accent wipes in from the left |
| Page change | Out 320 ms, in 480 ms | Old page blurs and fades out; new page fades in block by block, 100 ms apart |

## Don't

- Unseen markers (red dots, `NEW` badges): in the game they push players to collect rewards; on a portfolio or ordinary site they feel like nagging.
- Frosted glass, glitch tearing, scan lines, glow, large accent fills, rounded cards with shadows.
- Game-only elements such as 3D carousel menus, character art and rarity color bars.
- Any official game assets: screenshots, logos, icons, character art, copy, or the official font files.

## Type

- Latin text and numbers: Saira (open source, SIL OFL). Labels stretched to 125%, all caps, 0.06em tracking. The official site adds no tracking to its wide labels; a little is kept here for small sizes.
- Chinese: Noto Sans SC or the system sans. No serif or brush faces for body text.
- All numbers tabular (`font-variant-numeric: tabular-nums`).

## Delivering a single HTML file

- Use the `terrain.css` classes as they are; do not add page-level overrides that change their colors. If a change is needed, the component has a problem and should be reported back to the skill.
- Put `terrain.css` in a `<style>` element and `contours.js` in a `<script>` element. Before inlining any script, make sure it contains no literal `</script>`; if it does, write it as `<\/script>`.
- If the page must work offline, embed Saira as a woff2 data URI in `@font-face`; otherwise link Google Fonts and keep the fallback fonts.

## Checklist before delivery

- [ ] A page type was chosen, and heading sizes from different types are not mixed on one page.
- [ ] The accent appears only on the current location and primary actions; there is no red on the page.
- [ ] Each button group has at most one block primary button; the rest are pills.
- [ ] Vertical lists and horizontal tabs use their own selection styles.
- [ ] Every page has a `//` path title.
- [ ] All numbers are real data; every product statement has a source and does not overstate its scope.
- [ ] Both light and dark themes were checked; nothing scrolls sideways at phone width (about 400 px).
- [ ] Keyboard focus is visible; everything is still with reduced motion on.
- [ ] No official game assets are used.

## Files

| File | Contents |
| --- | --- |
| `assets/terrain.css` | Color tokens (light and dark) and all components |
| `assets/contours.js` | Contour background, one line to set up: `TerrainContours.mount(canvas)` |
| `examples/demo.html` | Every component on one page, ready to open |
| `examples/screenshots/` | The component page in light, dark, phone width, and the dialog |
| `references/research.md` | Research notes: what was observed, what was kept, what was left out |
