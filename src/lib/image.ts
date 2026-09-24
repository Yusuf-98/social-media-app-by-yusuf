const OPTIMIZED_HOSTS = ["res.cloudinary.com"];

export function isOptimizableImage(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && OPTIMIZED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
