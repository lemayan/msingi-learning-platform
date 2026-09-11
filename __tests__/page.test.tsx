import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import Home from "@/app/page";

afterEach(cleanup);

describe("Home", () => {
  it("renders the primary navigation with local destinations", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Msingi" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Courses" }).getAttribute("href")).toBe("/courses");
    expect(screen.getByRole("link", { name: "My Learning" }).getAttribute("href")).toBe("/my-learning");
    expect(screen.getByRole("link", { name: /Explore Courses/i }).getAttribute("href")).toBe("/courses");
    expect(screen.getByRole("link", { name: /View all courses/i }).getAttribute("href")).toBe("/courses");
  });

  it("presents the homepage value proposition and an editable search field", () => {
    render(<Home />);

    expect(screen.getByText("Intelligent Learning")).toBeDefined();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /Search your learning\s*in plain English\./,
    );
    expect(
      screen.getByText(/finds the exact lessons across all your courses/i),
    ).toBeDefined();

    const searchInput = screen.getByPlaceholderText<HTMLInputElement>(
      "Ask anything about your learning...",
    );
    expect(searchInput.value).toBe("");

    fireEvent.change(searchInput, { target: { value: "How does caching work?" } });
    expect(searchInput.value).toBe("How does caching work?");
    expect(screen.getByText("⌘ K")).toBeDefined();
  });

  it.each([
    {
      title: "Next.js for Production",
      description: "Build scalable, high-performance web applications with Next.js.",
      level: "Intermediate",
      duration: "18h 24m",
      modules: "12 modules",
    },
    {
      title: "Docker Essentials",
      description: "Containerize applications and streamline your development workflow.",
      level: "Beginner",
      duration: "10h 12m",
      modules: "8 modules",
    },
    {
      title: "TypeScript Deep Dive",
      description: "Go beyond the basics and write safer, more expressive code.",
      level: "Intermediate",
      duration: "14h 36m",
      modules: "10 modules",
    },
  ])("renders complete catalog details for $title", ({ title, description, level, duration, modules }) => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 3, name: title });
    const card = heading.parentElement;

    expect(card).not.toBeNull();
    expect(within(card as HTMLElement).getByText(description)).toBeDefined();
    expect(within(card as HTMLElement).getByText(level)).toBeDefined();
    expect(within(card as HTMLElement).getByText(duration)).toBeDefined();
    expect(within(card as HTMLElement).getByText(modules)).toBeDefined();
  });

  it("keeps the catalog count, supporting imagery, and update message intact", () => {
    render(<Home />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getByRole("img", { name: "Docker" }).getAttribute("src")).toContain(
      "docker-original.svg",
    );
    expect(screen.getByRole("img", { name: "User" }).getAttribute("src")).toContain(
      "seed=Msingi",
    );
    expect(screen.getByText("New courses and lessons added every week.")).toBeDefined();
  });

  it("does not expose placeholder or external navigation links", () => {
    render(<Home />);

    const destinations = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(destinations).not.toContain(null);
    expect(destinations).not.toContain("");
    expect(destinations).not.toContain("#");
    expect(destinations.every((destination) => destination?.startsWith("/"))).toBe(true);
  });
});
