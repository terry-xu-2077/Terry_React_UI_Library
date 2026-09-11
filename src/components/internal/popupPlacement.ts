export type PopupPlacement = "down" | "up";

const CLIPPING_OVERFLOW = new Set(["auto", "scroll", "hidden", "clip"]);

function clipsVertically(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  return CLIPPING_OVERFLOW.has(style.overflowY);
}

export function measurePopupPlacement(host: HTMLElement, desiredHeight: number, gap = 8) {
  const hostRect = host.getBoundingClientRect();
  let visibleTop = 0;
  let visibleBottom = window.innerHeight;

  for (let parent = host.parentElement; parent; parent = parent.parentElement) {
    if (!clipsVertically(parent)) continue;
    const rect = parent.getBoundingClientRect();
    visibleTop = Math.max(visibleTop, rect.top);
    visibleBottom = Math.min(visibleBottom, rect.bottom);
  }

  const above = Math.max(0, hostRect.top - visibleTop - gap);
  const below = Math.max(0, visibleBottom - hostRect.bottom - gap);

  let placement: PopupPlacement = "down";
  if (below >= desiredHeight) placement = "down";
  else if (above >= desiredHeight) placement = "up";
  else placement = above > below ? "up" : "down";

  return {
    placement,
    available: placement === "up" ? above : below,
    above,
    below,
  };
}
