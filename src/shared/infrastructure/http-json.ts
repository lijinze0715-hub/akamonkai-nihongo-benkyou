export type JsonReader = (path: string) => Promise<unknown>;
export const readJson: JsonReader = async path => {
  const response = await fetch(path.replace(/^\/+/, ""));
  if (!response.ok) throw new Error("Content could not be loaded");
  return response.json();
};
