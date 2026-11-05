---
title: Buttons and button groups
description: Render Web Awesome buttons and button groups with typed Vue wrappers.
---

After [configuring Web Awesome](../web-awesome/), import `Button` from `@artisan-toolbox/front-awesome/components` in a Vue page. The default slot becomes the button content.

```vue
<template>
  <Button variant="brand" type="submit">Save changes</Button>
</template>

<script setup lang="ts">
import { Button } from "@artisan-toolbox/front-awesome/components";
</script>
```

The wrapper passes attributes such as `variant`, `type`, and `disabled` to `<wa-button>`. It registers the custom element when the Vue component mounts in the browser. The button follows the application's Web Awesome theme.

For supported attributes, see the [Web Awesome button reference](https://webawesome.com/docs/components/button/).

## Group related buttons

Use `ButtonGroup.vue` to group buttons. Give the group a `label` so assistive technologies can identify it. The default slot contains the buttons. Set `orientation` to `vertical` to stack them.

```vue
<template>
  <ButtonGroup v-bind="group">
    <Button v-bind="save">Save changes</Button>
    <Button type="button">Cancel</Button>
  </ButtonGroup>
</template>

<script setup lang="ts">
import {
  Button,
  ButtonGroup,
  type ButtonGroupProps,
  type ButtonProps,
} from "@artisan-toolbox/front-awesome/components";

const group = {
  label: "Form actions",
  orientation: "vertical",
} satisfies ButtonGroupProps;
const save = { variant: "brand", type: "submit" } satisfies ButtonProps;
</script>
```

The wrappers combine Vue's HTML attributes with Web Awesome's TypeScript declarations for template completion and option checking. All wrapper attributes are optional. If you omit `orientation`, the group uses Web Awesome's horizontal default. Use `ButtonProps` or `ButtonGroupProps` to check an object before passing it with `v-bind`. Vue forwards the attributes and listeners to the Web Awesome element. The group registers `wa-button-group` when it mounts in the browser.

See the [Web Awesome button group reference](https://webawesome.com/docs/components/button-group/) for group behavior and attributes.
