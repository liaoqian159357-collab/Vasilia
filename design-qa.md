# Vasilia Design QA

- Source visual truth: `D:\我的文档\网站\design-reference\control-tower-concept.png`
- Implementation: `http://127.0.0.1:4173/`
- Intended comparison viewport: desktop 1440 x 900; mobile 390 x 844
- State: Chinese default content, desktop homepage and mobile navigation open

**Full-view comparison evidence**

The source visual was opened and inspected. The implementation rendered successfully in the in-app browser, but every browser screenshot request timed out, including viewport, clipped, desktop, and mobile captures. A valid side-by-side image comparison could therefore not be produced.

**Focused region comparison evidence**

Blocked by the same screenshot failure. DOM and computed-layout checks confirmed the hero, control tower, metric strip, section grids, mobile breakpoint, hidden/expanded mobile navigation, and zero horizontal overflow at 390 px. These checks are functional evidence, not a substitute for visual comparison.

**Verified behavior**

- All six routes render their expected localized page heading.
- Legacy `/network` and `/warehouse` routes resolve to Technology and Services content.
- Chinese/English switching updates the document language and persists through local storage.
- Industry tabs, valid/invalid tracking results, inquiry required/email validation, successful inquiry submission, city selection, and mobile navigation work.
- Browser console reports no application errors.
- TypeScript and production build pass.

**Findings**

- [P2] Visual parity cannot be certified.
  Location: all screens.
  Evidence: source image is available, but the in-app browser could not capture the rendered implementation.
  Impact: typography, crop, fine spacing, color, and image fidelity cannot receive the required side-by-side approval.
  Fix: repeat desktop and mobile screenshot capture when the browser capture channel is available, combine each with the source reference, and review all five fidelity surfaces.

**Fidelity surfaces**

- Fonts and typography: Roboto is applied globally; exact rendered comparison blocked.
- Spacing and layout rhythm: responsive grid and overflow checks pass; visual comparison blocked.
- Colors and tokens: navy/cyan/white palette follows the reference; exact sampled comparison blocked.
- Image quality: existing real logistics assets are used with responsive crops; visual comparison blocked.
- Copy and content: six-page Chinese and English content matches the approved document structure.

**Patches made since previous QA**

- Rebuilt the site around the approved six-page structure.
- Replaced corrupted localization resources with complete Chinese and English content.
- Added tracking, tabs, forms, validation, office filtering, redirects, and responsive navigation.

**Implementation checklist**

- Retry in-app browser screenshots at desktop and mobile viewports.
- Create combined source/implementation comparisons.
- Fix any resulting P0/P1/P2 visual differences, then change the final result to passed.

final result: blocked
