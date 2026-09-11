import React from "react";
import { describe, expect, it, vi } from "vitest";

const fontFactories = vi.hoisted(() => ({
  inter: vi.fn(() => ({ variable: "font-inter" })),
  playfairDisplay: vi.fn(() => ({ variable: "font-playfair" })),
  nunito: vi.fn(() => ({ variable: "font-nunito" })),
}));

vi.mock("next/font/google", () => ({
  Inter: fontFactories.inter,
  Playfair_Display: fontFactories.playfairDisplay,
  Nunito: fontFactories.nunito,
}));

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("exports Msingi branding metadata", () => {
    expect(metadata).toEqual({
      title: "Msingi",
      description:
        "A unified design language for the Msingi learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.",
    });
  });

  it("configures each brand font for latin text with swap display", () => {
    const expectedOptions = {
      subsets: ["latin"],
      display: "swap",
    };

    expect(fontFactories.inter).toHaveBeenCalledWith({
      ...expectedOptions,
      variable: "--font-inter",
    });
    expect(fontFactories.playfairDisplay).toHaveBeenCalledWith({
      ...expectedOptions,
      variable: "--font-playfair",
    });
    expect(fontFactories.nunito).toHaveBeenCalledWith({
      ...expectedOptions,
      variable: "--font-nunito",
    });
  });

  it("applies all font variables and preserves the page content", () => {
    const content = React.createElement("main", null, "Test content");
    const layout = RootLayout({
      children: content,
      params: Promise.resolve({}),
    });
    const body = layout.props.children;

    expect(layout.type).toBe("html");
    expect(layout.props.lang).toBe("en");
    expect(layout.props.className).toBe(
      "font-inter font-playfair font-nunito antialiased",
    );
    expect(body.type).toBe("body");
    expect(body.props.className).toBe("min-h-full flex flex-col");
    expect(body.props.children).toBe(content);
  });
});
