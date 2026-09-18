"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Route changes and the desktop breakpoint always dismiss mobile overlays. */
export function useMobileOverlay() {
  const pathname = usePathname();
  const [state, setState] = useState({ pathname, open: false });
  if (state.pathname !== pathname) {
    setState({ pathname, open: false });
  }
  const open = state.pathname === pathname && state.open;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => setState((current) => ({ ...current, open: false }));
    const onResize = () => { if (desktop.matches) close(); };
    desktop.addEventListener("change", onResize);
    window.addEventListener("popstate", close);
    return () => {
      desktop.removeEventListener("change", onResize);
      window.removeEventListener("popstate", close);
    };
  }, []);

  return { open, setOpen: (value: boolean) => setState({ pathname, open: value }) };
}
