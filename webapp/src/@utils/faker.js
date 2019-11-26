function generateUnique(count, generator, by) {
  const items = [];
  const keys = [];

  while (items.length < count + 1) {
    const item = generator();
    const key = by(item);

    if (keys.includes(key)) {
      continue;
    }

    keys.push(key);
    items.push(item);
  }

  return items;
}

module.exports = { generateUnique };
