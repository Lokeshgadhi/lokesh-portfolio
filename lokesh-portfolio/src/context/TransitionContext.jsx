// Re-export from ScrollContext for full backwards compatibility.
// Nothing should import directly from here; prefer ScrollContext.
export {
  ScrollProvider  as TransitionProvider,
  useSectionTransition,
  SECTIONS,
} from './ScrollContext';
