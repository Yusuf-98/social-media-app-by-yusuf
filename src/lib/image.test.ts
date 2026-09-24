import { describe, expect, it } from "vitest";
import { isOptimizableImage } from "@/lib/image";

describe("isOptimizableImage", () => {
  it("accepts Cloudinary https urls", () => {
    expect(isOptimizableImage("https://res.cloudinary.com/demo/image/upload/a.png")).toBe(true);
  });

  it("rejects other hosts", () => {
    expect(isOptimizableImage("https://i.imgur.com/ybJZINQ.png")).toBe(false);
  });

  it("rejects non-https urls", () => {
    expect(isOptimizableImage("http://res.cloudinary.com/demo/a.png")).toBe(false);
  });

  it("rejects invalid urls", () => {
    expect(isOptimizableImage("not a url")).toBe(false);
    expect(isOptimizableImage("/local.png")).toBe(false);
  });
});
