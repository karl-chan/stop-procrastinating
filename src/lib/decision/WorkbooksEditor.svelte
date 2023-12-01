<script lang="ts">
  import {
    Button,
    ButtonSet,
    Tab,
    TabContent,
    Tabs,
    Toggle,
  } from "carbon-components-svelte";
  import { Add, TrashCan } from "carbon-icons-svelte";
  import { store } from "../../stores";
  import Flex from "../flex/Flex.svelte";
  import RemoveWorkbookModal from "./RemoveWorkbookModal.svelte";
  import WorkbookEditor from "./WorkbookEditor.svelte";

  let showWeights = false;
  let selected = 0;
  let showRemoveModal = false;

  $: activeWorkbook =
    $store.decisions.workbooks.length > selected
      ? $store.decisions.workbooks[selected]
      : null;

  function addWorkbook() {
    $store.decisions.workbooks.push({
      name: `Workbook ${$store.decisions.workbooks.length + 1}`,
      matrix: {
        rows: [],
        columns: [],
        cells: [],
        rowWeights: [],
      },
    });
    $store = $store;
  }

  function deleteWorkbook() {
    showRemoveModal = true;
  }
</script>

<Flex direction="row" justify="between">
  <ButtonSet>
    <Button icon={Add} on:click={addWorkbook}>New workbook</Button>
    {#if activeWorkbook}
      <Button icon={TrashCan} kind="danger" on:click={deleteWorkbook}
        >Delete workbook</Button
      >
    {/if}
  </ButtonSet>
  <div>
    <Toggle labelText="Show weights" bind:toggled={showWeights} />
  </div>
</Flex>

<Tabs bind:selected>
  {#each $store.decisions.workbooks as workbook}
    <Tab label={workbook.name} />
  {/each}
  <svelte:fragment slot="content">
    {#each $store.decisions.workbooks as workbook}
      <TabContent>
        <WorkbookEditor bind:showWeights bind:workbook />
      </TabContent>
    {/each}
  </svelte:fragment>
</Tabs>

{#if activeWorkbook}
  <RemoveWorkbookModal bind:open={showRemoveModal} workbook={activeWorkbook} />
{/if}
