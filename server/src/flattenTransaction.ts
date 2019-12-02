export const flattenTransaction = (data: any) => {
  try {
    const { trx_id, created_at } = data;

    return {
      id: trx_id,
      createdAt: created_at
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};
