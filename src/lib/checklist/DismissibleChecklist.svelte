<script lang="ts">
  import {
    Button,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListRow,
    Tile,
  } from "carbon-components-svelte";
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import { createEventDispatcher } from "svelte";
  import Flex from "../flex/Flex.svelte";
  import ChecklistEditor from "./ChecklistEditor.svelte";
  import type { Checklist } from "./checklist";

  export let title: string;
  export let checklist: Checklist;
  export let editable: Boolean = true;
  export let dismissed: Boolean[] = new Array(checklist.length).fill(false);
  $: remainingCount = dismissed.filter((isDismissed) => !isDismissed).length;

  const dispatch = createEventDispatcher();

  let showEditor = false;
  let editor: ChecklistEditor;

  function dismiss(i: number) {
    const item = checklist[i];
    if (item.actionUrl.trim().length > 0) {
      window.open(item.actionUrl, "_blank")?.focus();
    }
    dismissed[i] = true;

    if (dismissed.every((isDismissed) => isDismissed)) {
      dispatch("dismissAll");
    }
  }
</script>

<Tile>
  <Flex justify="between">
    <h2>{title}</h2>
    <Flex direction="row">
      <slot name="icons" />
      {#if editable}
        <Button
          iconDescription="Edit"
          icon={Edit}
          on:click={() => (showEditor = true)}
        />
      {/if}
    </Flex>
  </Flex>
  {#if remainingCount > 0}
    <StructuredList condensed selection>
      <StructuredListBody>
        {#each checklist as item, i}
          {#if !dismissed[i]}
            <StructuredListRow on:click={() => dismiss(i)}>
              <StructuredListCell>
                {item.text}
              </StructuredListCell>
              <StructuredListCell>
                <CheckmarkFilled />
              </StructuredListCell>
            </StructuredListRow>
          {/if}
        {/each}
      </StructuredListBody>
    </StructuredList>
  {:else}
    You have no remaining items.
  {/if}
</Tile>

<ChecklistEditor bind:open={showEditor} bind:checklist />
