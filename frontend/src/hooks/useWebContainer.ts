import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null; // <- GLOBAL singleton

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer>();

  useEffect(() => {
    async function boot() {
      if (!webcontainerInstance) {
        webcontainerInstance = await WebContainer.boot();
      }
      setWebcontainer(webcontainerInstance);
    }
    boot();
  }, []);

  return webcontainer;
}
