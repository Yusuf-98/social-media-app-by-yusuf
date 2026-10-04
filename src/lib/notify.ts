type Sonner = typeof import("sonner");

let mountToaster: (() => Promise<void>) | null = null;
let ready: Promise<Sonner> | null = null;

export function registerToasterMount(mount: () => Promise<void>) {
  mountToaster = mount;
}

function load() {
  if (!ready) {
    ready = Promise.all([import("sonner"), mountToaster?.()]).then(([sonner]) => sonner);
  }
  return ready;
}

export const notify = {
  success: (message: string) => {
    void load().then(({ toast }) => toast.success(message));
  },
  error: (message: string) => {
    void load().then(({ toast }) => toast.error(message));
  },
};
