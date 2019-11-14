import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { GraphQLRequest } from "apollo-link";

// NOTE: https://github.com/apollographql/react-apollo/blob/master/packages/testing/src/mocks/mockLink.ts
// NOTE: https://github.com/abhiaiyer91/apollo-storybook-decorator
// TODO: Create '@storybook/addon-apollo/register'

class MockBuilder {
  public mocks: MockedResponse[] = [];

  public on(query: any, variables: object) {
    const request: GraphQLRequest = {
      query,
      variables
    };

    const builder = this;

    return {
      respond(data: any) {
        const mock = {
          request,
          result: { data }
        };

        builder.mocks.push(mock);

        return builder;
      }
    };
  }

  public build() {
    return (story: () => any) => (
      <MockedProvider mocks={this.mocks} addTypename={false}>
        {story()}
      </MockedProvider>
    );
  }
}

export default MockBuilder;
