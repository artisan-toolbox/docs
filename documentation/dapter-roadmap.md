# Dapter roadmap

Read the architecture, delivery phases, and current progress in the [Dapter roadmap](https://atb.dev.br/docs/dapter/roadmap).
The first local Collection and SQLite offset listing slice is implemented. Remaining APIs are explicitly proposed. Run the [functional listing examples](https://atb.dev.br/docs/dapter/listing) for the delivered behavior. No stable release is available.

The [canonical roadmap source](../resources/js/pages/docs/dapter/Roadmap.vue) owns the delivery phases, task statuses, acceptance gates, and implementation baseline.
Detailed proposals live in the [proposed design guides](https://atb.dev.br/docs/dapter/design), with one page for declarations, drivers, operations, pagination and state, actions, and live updates.
Their [Vue sources](../resources/js/pages/docs/dapter/design) own the authored examples and stable section anchors. These guides explicitly distinguish proposed APIs from delivered preview behavior.
Independent adapters keep independent state even when they use the same source. Sharing requires an explicit client handle.
The registered documentation route is `docs.show`. The roadmap slug is `dapter/roadmap`, and the design group is `dapter/design`.

Phases form a collapsible list. Opening a phase reveals task cards with their acceptance details already visible.
Compact status badges sit beside phase and task titles. Direct task links open the owning phase, and progress counts only completed tasks.
