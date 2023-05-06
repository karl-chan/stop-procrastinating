<script lang="ts">
  import { Form, Modal, TextInput } from "carbon-components-svelte";
  import type { TreeNodeId } from "carbon-components-svelte/types/TreeView/TreeView.svelte";
  import { createEventDispatcher } from "svelte";
  import type { EditProgressArgs, ProgressTree } from "./progress";

  export let open: boolean;
  export let activeId: TreeNodeId;
  export let progress: ProgressTree | undefined;

  let isItem = false;
  let name: string = "";
  let description: string = "";
  let current: number = NaN;
  let total: number = NaN;

  $: {
    initialiseFields(progress);
  }

  const dispatch = createEventDispatcher<{ edit: EditProgressArgs }>();

  function initialiseFields(progress: ProgressTree | undefined) {
    if (progress !== undefined) {
      ({ name, description } = progress);

      if (progress.leaf !== undefined) {
        isItem = true;
        ({ current, total } = progress.leaf);
      } else {
        isItem = false;
        current = total = NaN;
      }
    }
  }

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

  function edit() {
    if (!validate()) {
      return;
    }

    dispatch("edit", {
      id: activeId,
      name,
      description,
      current,
      total,
    });
    open = false;
  }
</script>

<Modal
  bind:open
  modalHeading="Edit item"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  hasForm={true}
  on:click:button--secondary={() => (open = false)}
  on:submit={edit}
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

    {#if isItem}
      <TextInput
        bind:value={current}
        invalid={Number.isInteger(current)}
        labelText="Current value"
        type="number"
        required
        placeholder="0"
      />
      <TextInput
        bind:value={total}
        invalid={Number.isInteger(total)}
        labelText="Total"
        type="number"
        required
        placeholder="100"
      />
    {/if}
  </Form>
</Modal>
