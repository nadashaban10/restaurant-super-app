/** Brief pause so sync cart actions show a polished loading state without delaying UX. */
export function briefActionDelay(ms = 280): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
