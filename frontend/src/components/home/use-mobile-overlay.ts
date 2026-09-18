"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Route changes and the desktop breakpoint always dismiss mobile overlays. */
export function useMobileOverlay(desktopWidth = 768) {
  const pathname = usePathname();
  const [state, setState] = useState({ pathname, open: false });
  if (state.pathname !== pathname) {
    setState({ pathname, open: false });
  }
  const open = state.pathname === pathname && state.open;

  useEffect(() => {
    const desktop = window.matchMedia(`(min-width: ${desktopWidth}px)`);
    const close = () => setState((current) => ({ ...current, open: false }));
    const onResize = () => { if (desktop.matches) close(); };
    desktop.addEventListener("change", onResize);
    window.addEventListener("popstate", close);
    return () => {
      desktop.removeEventListener("change", onResize);
      window.removeEventListener("popstate", close);
    };
  }, [desktopWidth]);

  return { open, setOpen: (value: boolean) => setState({ pathname, open: value }) };
}
