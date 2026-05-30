import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CmsContent } from "./cms-content";

// Mock @tanstack/react-query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

import { useQuery } from "@tanstack/react-query";

describe("CmsContent Component", () => {
  it("renders loading state skeleton when loading and no data is present", () => {
    // Arrange
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    // Act
    const { container } = render(
      <CmsContent identifier="test-block" fallback="Default Fallback Copy" />
    );

    // Assert
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
    expect(screen.queryByText("Default Fallback Copy")).not.toBeInTheDocument();
  });

  it("renders fallback content when loading completes with empty data", () => {
    // Arrange
    (useQuery as any).mockReturnValue({
      data: { data: null },
      isLoading: false,
    });

    // Act
    render(
      <CmsContent identifier="test-block" fallback="Default Fallback Copy" />
    );

    // Assert
    expect(screen.getByText("Default Fallback Copy")).toBeInTheDocument();
  });

  it("renders CMS content when query returns success", () => {
    // Arrange
    (useQuery as any).mockReturnValue({
      data: { data: { content: "Dynamic CMS Content Text" } },
      isLoading: false,
    });

    // Act
    render(
      <CmsContent identifier="test-block" fallback="Default Fallback Copy" />
    );

    // Assert
    expect(screen.getByText("Dynamic CMS Content Text")).toBeInTheDocument();
    expect(screen.queryByText("Default Fallback Copy")).not.toBeInTheDocument();
  });
});
