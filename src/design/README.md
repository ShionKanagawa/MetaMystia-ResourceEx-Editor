# `src/design/`

This directory is **vendored** from the upstream project
[`touhou-mystia-izakaya-assistant`](https://github.com/Pikatchii/touhou-mystia-izakaya-assistant)
(`app/design/`), with the following local adaptations:

- `globalStore` / `@/stores` dependencies removed; the editor does not
  carry per-user persistence.
- The `isHighAppearance` flag (which was driven by user settings in the
  upstream project) is **always disabled** here. Components that originally
  branched on it have been simplified to the `false` branch:
    - `ui/components/button.tsx`, `dropdown.tsx`, `modal.tsx`,
      `popover.tsx`, `tooltip.tsx`
    - `ui/hooks/useMotionProps.ts` always returns the empty motion preset.
- `useMounted` no longer waits for a `userId` from the persistence store.
- `lodash` is not used; `memoize.ts` does the `WeakMap` key check inline.

When syncing fixes from upstream, prefer cherry-picking individual files and
re-applying the deltas above. If `isHighAppearance` ever needs to come back,
restore the upstream branches and wire it to a real store.
