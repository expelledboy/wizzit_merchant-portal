import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { SearchBar } from "./SearchBar";

storiesOf("SearchBar", module).add("Filter config", () => {
  const props = {
    onUpdate: action("onUpdate")
  };
  return <SearchBar {...props} />;
});
