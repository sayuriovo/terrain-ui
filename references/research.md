# Research notes

November 2026. Three sources: the styles and images of the game's official website, a 5.5-minute recording of the in-game interface (every interactive screen opened in turn), and hands-on use on a real website. Screenshots and recordings are third-party copyrighted material; they were used for research only and are not included in this skill.

Labels: **[measured]** a value read from a stylesheet, from pixels, or by counting frames; **[seen]** observed directly on screen; **[guessed]** an inference without direct evidence.

## 1. Official website

- [measured] The background contour lines are two static PNGs, placed top right (628×374) and bottom left (689×690). They do not animate.
- [measured] Line color `#1C1C1C`, with peak opacity of about 7% and 3.5%.
- [seen] The contours close into nested rings, with small rings at the peaks and tighter spacing on steep slopes. Every few lines, one is heavier.
- [guessed] The heavier lines match the index contours of topographic maps, where one line in five is heavier by convention. This skill uses five.
- [measured] Fonts on the site: HarmonyOS Sans for Chinese; Novecento Sans Wide, Gilroy and Space Grotesk for Latin text. This skill uses the open-source Saira and Noto Sans SC instead.

## 2. In-game interface

- [seen] Vertical lists: hover lightens the row; the selected row turns dark with white text and a yellow bar on the left. The shop, encyclopedia, tutorial log and inventory all follow this.
- [seen] Horizontal tabs: the selected tab fills solid yellow.
- [measured] Tab switch: the old yellow block shrinks to a vertical line and the new one opens sideways from its center, in about 3 to 4 frames (100 to 130 ms, from a 30 fps recording).
- [measured] List hover lightens in about 2 to 3 frames (70 to 100 ms).
- [seen] Each screen has a `//` path at the top left, for example `// Friends / Friend list`, and a close button fixed at the top right.
- [seen] Yellow appears only on the selected tab and the primary action (for example "Headhunt ×10", "Go to purchase", "Industrial plan").
- [seen] Primary actions are blocks. Secondary actions (for example "Craft", "Go", "Blocklist") are pills with a round icon at the right end.
- [seen] Tab bars show Q / E key hints on both sides.
- [seen] Many `current / total` counters: friends 9/100, equipment 43/2000, stamina 61/346.
- [seen] Dark screens and light grey screens coexist; both avoid pure black and pure white.
- [seen] Switching screens blurs the view first, then brings it into focus.
- [seen] Almost every entry point has a small orange diamond at its top right to mark new content.

## 3. What survived testing on a website

| Kept as a rule | Why |
| --- | --- |
| Separate selection styles for lists and tabs | Tried in the site navigation; the current page is clear at a glance |
| Tabs opening from the center, 90 ms hover | Crisper than the previous 160 ms, with no side effects |
| Button shape shows primary vs. secondary | The primary action is clear from shape alone |
| Key hints | The site already supported arrow keys; people only notice once the keys are shown |
| Closed contour lines | Matches the official site and stays faint enough not to disturb reading |

| Dropped | Why |
| --- | --- |
| Unseen markers (orange diamond, `NEW`) | Removed after trying it on the site. In the game it nudges players to collect rewards; portfolio visitors have no such reason |
| Frosted glass, glitch tearing | Overpowers the content on an ordinary web page |
| 3D carousel menus, character art, rarity color bars, currency bar | Specific to the game |

## 4. Where each component comes from

The recording covers the main screens but not every component. They are listed separately so that inferred components are not mistaken for observations.

| Component | Source |
| --- | --- |
| Vertical list, horizontal tabs, primary and secondary buttons, path title, field row, key hints | [seen] [measured] observed in game |
| Table | [seen] full-row records in the friend and equipment lists; header style inferred |
| Thin loading line | [seen] the thin progress line and `NOW LOADING` at the bottom of the loading screen |
| Dialog that sharpens in | [seen] the blur transition between screens, applied to dialogs |
| Input, error message, switch, toast, empty state | [inferred] no clear sample in the recording; derived from the eight rules. Check against in-game samples when available |

## 5. How colors and the curve were chosen

Colors were sampled from recording frames and from the official site's computed styles. Video compression makes one color vary by 1 to 3 units; the table lists the most frequent value.

| Token | Value | Source |
| --- | --- | --- |
| Accent | `#FEEC00` | [measured] selected tabs in game (Action Manual, Friends); the official site uses a cooler `#FFFA00` |
| Light paper | `#E8E6E4` | [measured] light in-game backgrounds: encyclopedia `#E1DFDD`, friends `#E9E7E8` |
| Light panel | `#FAFAFA` | [measured] raised blocks on the official site |
| Light gray block | `#D8D6D4` | [measured] light list cards in game `#DFDFDC`, one step darker to separate from paper |
| Ink | `#191919` | [measured] body text on the official site. In-game text measured `#353535` to `#3E3E3E`, but it is small and compressed, so the site value is used for body text |
| Secondary text | `#5E5E5E` | [measured] official site `#6E6E6E` reaches only 4.1:1 on paper; darkened to 5.2:1 |
| Dark paper | `#1B1B1B` | [measured] in-game shop top bar |
| Dark panel | `#2D2D2D` | [measured] in-game Action Manual tab bar background |
| Dark gray block | `#353535` | [measured] in-game friend list rows |
| Dark text | `#EEEEEE` | [measured] text on selected dark rows in game |

Every text and label pairing passes WCAG 4.5:1. Ink on the accent is 14.4:1.

Motion curve: the recording is 30 fps, and a tab switch spans only 3 to 4 frames. That is enough to measure duration but not the shape of the curve. Durations follow the measurements; the curve is a common decelerating curve, `cubic-bezier(.2,0,0,1)`.

Letter spacing: the official site's wide labels (Novecento Sans Wide) compute to `letter-spacing: normal`; their width comes from the typeface itself. This skill stretches Saira to 125% to approximate that width and keeps only 0.06em of tracking.

## 6. Test log

| Round | Test | Finding | Change |
| --- | --- | --- | --- |
| 1 | Codex builds a project detail page, with and without the page-type rule | Without the rule it produced a showcase-style page; with it, it correctly chose a reading page | Kept "pick a page type first" |
| 1 | Same | Pill buttons and path links turned yellow on hover, breaking rule 1; Codex wrote its own overrides | Fixed the defaults in `terrain.css`; rule 1 now covers hover |
| 1 | Same | A literal `</script>` in a `contours.js` comment cut the script short when inlined | Rewrote the comment; added the "Delivering a single HTML file" section |
| 1 | Same | The page included facts from the project README that the prompt did not give. They matched the README, but the support scope was stated more firmly than the README does | Extended rule 5 to text: use only given information or project docs, keep their scope, and use a placeholder when there is no source |
| 1 | Same | The footer separated fields with a middle dot `·` | Not changed; the rules already say to use a vertical bar. Watching for a repeat |
| 2 | A Chrome extension's Status, History and Settings page, a Workbench page, built by Claude | Page type, list selection, tabs, pill buttons, table, form, switch, dialog and toast all applied without overrides | None needed |
| 2 | Same | `<button>` elements did not take the uppercase label style, because browsers reset `text-transform` on buttons; links styled as buttons did | Added a zero-specificity rule so buttons inherit the label style |
| 2 | Same | In the dialog footer, a pill button had the same gray as the footer and read as plain text | Pill buttons in the dialog footer use the panel color with a thin outline |
| 2 | Same | No middle dots this round | Footer issue from round 1 did not repeat |

## 7. How this differs from a similar skill

A community skill on the same subject already exists (hhikr/endfield-ui-skill), researched from the official website. This skill copies none of its files and reaches different conclusions in three places:

- It says a cut corner means "clickable". In game, list rows, tabs and pill buttons are all clickable without cut corners, so this skill uses shape to show primary vs. secondary instead.
- It rules out pill buttons. In game, secondary actions are exactly that.
- Its contour lines are deliberately open. On the official site and in game they are closed.
