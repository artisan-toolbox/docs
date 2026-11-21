# DataView layout study

Open [the offline study](index.html) and use **Study layout** to compare two ways to filter the same print shop support queue. Both use twelve fictional tickets, a page size of six, the same order, the same views and the same colors. The study stores changes in memory for the current visit.

## Layout decision

Use the integrated toolbar as the default. At 390 × 844, the first ticket title starts 282 pixels below the top of the viewport with the filter disclosure closed. The sidebar version places its status choices above the results, moving that title down to 408 pixels. At 1366 × 900, both titles start at 370 pixels. The sidebar and its gap consume 220 pixels of result width. The sidebar makes every status available in one click and may suit a dedicated filtering workspace.

| Viewport            | Integrated controls            | Always-visible filters                       |
| ------------------- | ------------------------------ | -------------------------------------------- |
| Desktop, 1366 × 900 | [Table](wide-integrated.png)   | [Table with sidebar](wide-split.png)         |
| Phone, 390 × 844    | [List](compact-integrated.png) | [List below filter panel](compact-split.png) |

The table aligns clients and deadlines for comparison. The list adds the support note so an operator can read the request. The grid puts the assignee and deadline together on each ticket for a shift handoff. The phone starts in list view. An explicit choice of table keeps the table available through horizontal scrolling inside its own region. [List example](wide-list.png) · [Grid example](wide-grid.png)

## Verified interactions

- Filter by **Waiting**. Four of twelve tickets match. The footer shows the range and both counts. A single page hides the navigation buttons. Changing the study layout preserves the filter. [Filtered table](wide-filtered.png)
- Use **Next** to reach tickets 7 through 12. Search for **Solstice** to return to the first page with two matches. Enter an unmatched query to reach the empty state, then clear the criteria to restore all twelve.
- Sort with **Client** or **Reply due** in the table header. A second activation reverses the direction. The header retains focus and the toolbar selector follows the same order. **Due last** places _Review cropped sleeve artwork_ first in all three views.
- Open the filter disclosure with the keyboard. Escape closes it and returns focus to **Filters**. Reaching a pagination boundary moves focus to the available navigation button.
- Chromium rendered both layouts at the listed viewports. At 320 pixels, switching among table, list and grid preserved the document width.

This throwaway HTML uses native controls and in-memory records. The print shop branding, names and deadlines belong to the example. It exercises interaction and placement with a known total. The production Vue wrappers, Dapter responses, server paging and Web Awesome theme inheritance require separate integration checks.
