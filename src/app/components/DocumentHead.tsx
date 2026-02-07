import { useEffect } from "react";

export function DocumentHead() {
  useEffect(() => {
    // Set page title
    document.title = "EAST - Embryology Across Space and Time | ASD Education";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Interactive educational platform teaching atrial septal defect embryology, hemodynamics, and clinical presentation for medical students."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Interactive educational platform teaching atrial septal defect embryology, hemodynamics, and clinical presentation for medical students.";
      document.head.appendChild(meta);
    }

    // Set theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", "#0F172A");
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#0F172A";
      document.head.appendChild(meta);
    }

    // Set favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (!existingFavicon) {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❤️</text></svg>";
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
