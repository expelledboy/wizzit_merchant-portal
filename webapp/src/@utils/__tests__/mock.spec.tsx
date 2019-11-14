import MockBuilder from "../mock";

describe("MockBuilder", () => {
  it("provided an api to construct mocks", () => {
    const mocks = new MockBuilder();

    mocks.on("query { one }", { one: "test" }).respond({ one: true });
    expect(mocks.mocks).toEqual([
      {
        request: { query: "query { one }", variables: { one: "test" } },
        response: { data: { one: true } }
      }
    ]);

    mocks.on("query { two }", { two: "test" }).respond({ two: true });
    expect(mocks.mocks).toEqual([
      {
        request: { query: "query { one }", variables: { one: "test" } },
        response: { data: { one: true } }
      },
      {
        request: { query: "query { two }", variables: { two: "test" } },
        response: { data: { two: true } }
      }
    ]);
  });
});
