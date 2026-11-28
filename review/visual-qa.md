# Visual QA — FAQ background, interactive graph and diagram typography

## FAQ / background
- Global background art has fixed authored heights for desktop (7200px), tablet (7900px) and mobile (8500px); expanding native FAQ details does not rescale the artwork.
- FAQ list/items disable scroll anchoring to avoid viewport jumps. Answers expand naturally in document flow.

## 3D architecture graphic
- Removed all visible interaction instructions from the diagram. It is presented as a visual representation, not an instruction panel.
- Accessible label describes only the represented architecture: process and context, agent and orchestration, tools and systems.
- Retained visual 3D manipulation for users who discover it, without exposing gesture guidance.
- The three conceptual labels use consistent compact typography, a 3-column grid, centered alignment, and internal padding inside a restrained inset label surface.
- Padding and font sizing are reduced on mobile so labels remain inside the diagram frame.
- The click interaction remains selection/highlighting only; no Markdown or document is opened.
- Logo not modified.

## Validation
- Run GitHub Actions structural validation and JavaScript syntax on this commit.
- Confirm the Vercel Preview serves the updated HTML, CSS and JS.
- Manual visual check remains required for label wrapping/alignment at desktop, tablet and mobile.

## Responsive/manual QA
Check 1440×900, 1024×768, 768×1024 and 390×844:
- No visible gesture or control instructions in the architecture panel.
- Three labels remain centered and fully inside the panel, with consistent inner padding.
- Mobile labels wrap cleanly and do not collide with the SVG/3D scene.
- FAQ expansion does not stretch the global background.
- 3D graph remains decorative and can still be manipulated without click-to-document navigation.

No merge or production deployment in this revision.
