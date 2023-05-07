<script lang="ts">
  import { Form, Modal, TextInput, Toggle } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import type { AddProgressArgs, ProgressTree } from "./progress";

  export let open: boolean;
  export let parent: ProgressTree | undefined;

  $: heading =
    parent !== undefined
      ? `Add ${isItemText} under ${parent.name}`
      : `Add ${isItemText}`;

  let name: string = "";
  let description: string = "";
  let current: number = NaN;
  let total: number = NaN;

  let isItem = false;
  $: isItemText = isItem ? "item" : "category";

  const dispatch = createEventDispatcher<{ add: AddProgressArgs }>();

  function validate(): boolean {
    if (isItem) {
      return (
        name.trim().length !== 0 &&
        Number.isInteger(current) &&
        Number.isInteger(total) &&
        0 <= current &&
        current <= total
      );
    } else {
      return name.trim().length !== 0;
    }
  }

  function add() {
    if (!validate()) {
      return;
    }

    const progress: ProgressTree = isItem
      ? {
          name,
          description,
          leaf: {
            current,
            total,
          },
        }
      : {
          name,
          description,
          children: [],
        };

    dispatch("add", {
      progress,
      parent,
    });
    open = false;
  }
</script>

<Modal
  bind:open
  modalHeading={heading}
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  hasForm={true}
  on:click:button--secondary={() => (open = false)}
  on:submit={add}
>
  <Form>
    <TextInput
      bind:value={name}
      invalid={name.trim().length === 0}
      labelText="Name"
      required
      placeholder="My progress item"
    />
    <TextInput
      bind:value={description}
      labelText="Description"
      placeholder="My description (optional)"
    />
    <Toggle
      labelText="Type"
      bind:toggled={isItem}
      labelA="Category"
      labelB="Item"
    />

    {#if isItem}
      <TextInput
        bind:value={current}
        invalid={!Number.isInteger(current) || current > total}
        labelText="Current value"
        type="number"
        required
        placeholder="0"
      />
      <TextInput
        bind:value={total}
        invalid={!Number.isInteger(total)}
        labelText="Total"
        type="number"
        required
        placeholder="100"
      />
    {/if}
  </Form>
</Modal>
