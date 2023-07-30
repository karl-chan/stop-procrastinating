<script lang="ts">
  import {
    Button,
    ButtonSet,
    Tab,
    TabContent,
    Tabs,
  } from "carbon-components-svelte";
  import { Add, TrashCan } from "carbon-icons-svelte";
  import RemoveWorkbookModal from "../../lib/decision/RemoveWorkbookModal.svelte";
  import { decisions } from "../../stores";

  let selected = 0;
  let showRemoveModal = false;

  $: activeWorkbook =
    $decisions.workbooks.length > selected
      ? $decisions.workbooks[selected]
      : null;

  function addWorkbook() {
    $decisions.workbooks.push({
      name: `Workbook ${$decisions.workbooks.length + 1}`,
      matrix: {
        rows: [],
        columns: [],
        cells: [[]],
      },
    });
    $decisions = $decisions;
  }

  function deleteWorkbook() {
    showRemoveModal = true;
  }
</script>

<ButtonSet>
  <Button icon={Add} on:click={addWorkbook}>New workbook</Button>
  {#if activeWorkbook}
    <Button icon={TrashCan} kind="danger" on:click={deleteWorkbook}
      >Delete workbook</Button
    >
  {/if}
</ButtonSet>

<Tabs bind:selected>
  {#each $decisions.workbooks as workbook}
    <Tab label={workbook.name} />
  {/each}
  <svelte:fragment slot="content">
    {#each $decisions.workbooks as workbook}
      <TabContent>Selected {selected}</TabContent>
    {/each}
  </svelte:fragment>
</Tabs>

{#if activeWorkbook}
  <RemoveWorkbookModal bind:open={showRemoveModal} workbook={activeWorkbook} />
{/if}
