const images = import.meta.glob("../assets/*/*-{icon,light,dark}.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

/**
 * @param {string} id
 * @param {"icon" | "light" | "dark"} variant
 */
export function packageBrand(id, variant) {
  const image = images[`../assets/${id}/${id}-${variant}.svg`];

  if (typeof image !== "string") {
    throw new Error(`Missing ${variant} brand asset for ${id}`);
  }

  return image;
}
