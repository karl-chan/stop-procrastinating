<script lang="ts">
  import {
    Button,
    ButtonSet,
    Tab,
    TabContent,
    Tabs,
    Toggle,
  } from "carbon-components-svelte";
  import { Add, Edit, TrashCan } from "carbon-icons-svelte";
  import { store } from "../../stores";
  import Flex from "../flex/Flex.svelte";
  import RemoveWorkbookModal from "./RemoveWorkbookModal.svelte";
  import RenameWorkbookModal from "./RenameWorkbookModal.svelte";
  import WorkbookEditor from "./WorkbookEditor.svelte";

  let showWeights = true;
  let selected = 0;
  let showRemoveModal = false;
  let showRenameModal = false;

  $: activeWorkbook =
    $store.decisions.workbooks.length > selected
      ? $store.decisions.workbooks[selected]
      : null;

  function addWorkbook() {
    $store.decisions.workbooks.push({
      name: generateNewWorkbookName(),
      matrix: {
        rows: [],
        columns: [],
        cells: [],
        rowWeights: [],
      },
    });
    $store = $store;
  }

  function generateNewWorkbookName() {
    const numbers = $store.decisions.workbooks.map((w) => {
      const matches = w.name.match(/^Workbook ([0-9]+)$/);
      return matches ? +matches[1] : 0;
    });
    const largest = Math.max(0, ...numbers);
    return `Workbook ${largest + 1}`;
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
      <Button
        kind="secondary"
        icon={Edit}
        on:click={() => (showRenameModal = true)}>Rename workbook</Button
      >
    {/if}
  </ButtonSet>
  <div>
    <Toggle labelText="Show weights" bind:toggled={showWeights} />
  </div>
</Flex>

{#key $store.decisions.workbooks.length}
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
{/key}

{#if activeWorkbook}
  <RemoveWorkbookModal bind:open={showRemoveModal} workbook={activeWorkbook} />
  <RenameWorkbookModal bind:open={showRenameModal} workbook={activeWorkbook} />
{/if}
