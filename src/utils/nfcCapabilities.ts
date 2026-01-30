export interface NfcCapabilities {
  supported: boolean;
  platform: "android-chrome" | "other";
  permissionState: PermissionState | "unknown";
}

function detectPlatform(): "android-chrome" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  const isAndroid = /Android/.test(ua);
  const isChrome = /Chrome\//.test(ua) && !/Edg\/|OPR\//.test(ua);
  return isAndroid && isChrome ? "android-chrome" : "other";
}

export async function detectNfcCapabilities(): Promise<NfcCapabilities> {
  const supported = typeof window !== "undefined" && "NDEFReader" in window;
  const platform = detectPlatform();

  let permissionState: PermissionState | "unknown" = "unknown";
  if (supported && "permissions" in navigator) {
    try {
      // @ts-expect-error "nfc" not yet in PermissionName union
      const status = await navigator.permissions.query({ name: "nfc" });
      permissionState = status.state;
    } catch {
      permissionState = "unknown";
    }
  }

  return { supported, platform, permissionState };
}
