# Visual QA — FAQ background anchoring and Obsidian-like 3D graph

## FAQ / background
- Root cause identified: the global ambient field used `background-size: 100% 100%`, stretching the long SVG to the full page height. Opening a native `<details>` answer increases page height, so the artwork was rescaled.
- Background art now uses fixed authored heights per viewport asset: desktop 7200px, tablet 7900px, mobile 8500px. The page content can grow without changing the scale/position of the background artwork.
- FAQ list/items disable scroll anchoring to avoid browser viewport jumps during disclosure changes. Answers still expand naturally in document flow.

## 3D graph interactions
- The graph remains 3D, with a central sphere, peripheral sphere nodes and a network of links.
- Drag empty canvas with primary mouse button to rotate the graph.
- Hold Shift while dragging, or use right/middle drag, to pan the graph.
- Drag a node to reposition it; its connecting edges follow.
- Mouse wheel zooms in/out; on touch, one finger rotates and two fingers pinch-zoom.
- Hovering a node highlights that node and its direct connections while dimming unrelated nodes.
- Clicking a node only selects/highlights it. There is no Markdown navigation or document opening.
- Keyboard arrow keys rotate; +/- zoom; Shift accelerates rotation.
- Motion pauses outside the viewport and respects `prefers-reduced-motion`.
- Logo was not modified.

## Validation
- Run GitHub Actions structural validation and JS syntax for this commit.
- Confirm Vercel preview serves latest HTML, CSS and JS.
- Manual visual interaction test remains required for mouse, touch, wheel, node dragging, selection and FAQ expansion/collapse.

## Responsive/manual QA
Check 1440×900, 1024×768, 768×1024 and 390×844.
- FAQ open/close does not stretch or relocate the global background pattern.
- Scroll position remains stable when opening answers.
- Graph rotation, pan, zoom, node drag and hover relationships work inside the panel only.
- Clicking a graph node has no document/navigation side effect.
- Browser console has no WebGL, pointer, or resize errors.

No merge or production deployment in this revision.
