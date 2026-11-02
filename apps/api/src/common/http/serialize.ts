export function withId<T extends Record<string, unknown> & { _id?: unknown }>(doc: T) {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id,
  };
}

export function withIds<T extends Record<string, unknown> & { _id?: unknown }>(docs: T[]) {
  return docs.map((doc) => withId(doc));
}
