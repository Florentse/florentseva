// Header is fixed, so a plain scrollIntoView() tucks the section title right
// underneath it — offset by the header's actual rendered height instead.
// Negative so the section lands flush against the header (1px tucked under
// it) rather than leaving a visible gap.
const EXTRA_GAP = -1;

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector("header");
  const headerOffset = header ? header.getBoundingClientRect().bottom : 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: targetTop - headerOffset - EXTRA_GAP,
    behavior: "smooth",
  });
}
