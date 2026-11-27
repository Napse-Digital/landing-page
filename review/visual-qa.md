# Visual QA — Napse Landing

> **Status:** browser checks passed at the listed viewport widths. The final full-page screenshot capture was not retained in the last run because the capture process exited with EPIPE; this report does not mark the screenshot itself as delivered evidence.

## Target viewports

| Viewport | Purpose | Structural/rendering gate |
|---|---|---|
| 1440 × 900 | Desktop | PASS |
| 1024 × 768 | Notebook / compact desktop | PASS |
| 768 × 1024 | Tablet portrait | PASS |
| 390 × 844 | Mobile | PASS |
| 320 × 740 | Small mobile / narrow fallback | PASS |

The five viewport runs reported:
- no horizontal overflow;
- no browser JavaScript errors;
- local images loaded;
- page-wide global background mapping present;
- section wrappers remained transparent;
- all internal anchor destinations existed;
- every conversion action used the exact approved WhatsApp destination;
- primary CTA foreground/background contrast: 10.72:1;
- skip link was the first keyboard focus target;
- responsive navigation opened, moved focus into the menu, closed on Escape, and restored focus to the trigger;
- FAQ details expanded;
- reduced-motion preference was honored.

## Static validation

`python tools/validate-site.py` checks language, one H1, homepage section count, WhatsApp destination consistency, anchor targets, local assets, responsive breakpoints, three global-background variants, brand color allowlist, reduced-motion, visible focus and skip navigation.

## Known validation limits

- Google Fonts requests are remote and were not relied upon for offline success; CSS system fallbacks remain.
- The production domain is not confirmed. No canonical URL or absolute Open Graph image URL is invented.
- This check is design/implementation QA in the local Chromium session, not a public-browser test against a deployed domain.
- A final full-page screenshot capture timed out; the viewport and interaction checks above did complete successfully.

## Review priorities after deployment

1. Confirm the production origin and set canonical/Open Graph absolute URLs.
2. Test the published page and all assets on the production origin.
3. Review the rendered full-page composition and all section boundaries in an ordinary browser.
4. Review the copy v2 editorially before treating it as final.
