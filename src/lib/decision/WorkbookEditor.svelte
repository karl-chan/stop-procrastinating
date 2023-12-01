<script lang="ts">
  import { Button, DataTable } from "carbon-components-svelte";
  import { Add, TrashCan } from "carbon-icons-svelte";
  import Flex from "../flex/Flex.svelte";
  import WorkbookNumberCell from "./WorkbookNumberCell.svelte";
  import WorkbookStringCell from "./WorkbookStringCell.svelte";
  import type { DecisionWorkbook } from "./decision";

  export let workbook: DecisionWorkbook;
  export let showWeights: boolean;
  let defaultWeight = 10;

  $: headers = [
    { key: "first_column", value: "" },
    ...workbook.matrix.columns.map((col, i) => {
      return {
        key: i.toString(),
        value: col,
      };
    }),
    { key: "last_column", value: "" },
  ];

  $: rows = [
    ...workbook.matrix.rows.map((name, i) => {
      return Object.fromEntries([
        ["id", i.toString()],
        ["first_column", name],
        ...workbook.matrix.cells[i].map((cell, j) => [j, cell]),
        ["last_column", ""],
      ]);
    }),

    Object.fromEntries([
      ["id", "last_row"],
      ["first_column", ""],
      ...workbook.matrix.columns.map((col, i) => [i.toString(), ""]),
      ["last_column", ""],
    ]),
  ];

  function addColumn() {
    workbook.matrix.columns.push(
      `Column ${workbook.matrix.columns.length + 1}`,
    );
    workbook.matrix.cells.forEach((row) => row.push(defaultWeight));
    workbook = workbook;
  }

  function addRow() {
    workbook.matrix.rows.push(`Row ${workbook.matrix.rows.length + 1}`);
    workbook.matrix.cells.push(
      new Array(workbook.matrix.columns.length).fill(0),
    );
    workbook.matrix.rowWeights.push(0);
    workbook = workbook;
  }

  function deleteColumn(columnIndex: number) {
    workbook.matrix.columns.splice(columnIndex, 1);
    for (let rowIndex = 0; rowIndex < workbook.matrix.rows.length; rowIndex++) {
      workbook.matrix.cells[rowIndex].splice(columnIndex, 1);
    }
    workbook = workbook;
  }

  function deleteRow(rowIndex: number) {
    workbook.matrix.rows.splice(rowIndex, 1);
    workbook.matrix.cells.splice(rowIndex, 1);
    workbook.matrix.rowWeights.splice(rowIndex, 1);
    workbook = workbook;
  }

  function calculateTotal(columnIndex: number) {
    let total = 0;
    for (let rowIndex = 0; rowIndex < workbook.matrix.rows.length; rowIndex++) {
      total +=
        workbook.matrix.cells[rowIndex][columnIndex] *
        workbook.matrix.rowWeights[rowIndex];
    }
    return total;
  }

  function updateHeader(columnIndex: number, value: string) {
    workbook.matrix.columns[columnIndex] = value;
    workbook = workbook;
  }

  function updateAttribute(rowIndex: number, value: string) {
    workbook.matrix.rows[rowIndex] = value;
    workbook = workbook;
  }

  function updateRowWeight(rowIndex: number, value: number) {
    workbook.matrix.rowWeights[rowIndex] = value;
    workbook = workbook;
  }

  function updateCell(rowIndex: number, columnIndex: number, value: number) {
    workbook.matrix.cells[rowIndex][columnIndex] = value;
    workbook = workbook;
  }

  function numberCellFormatter(value: number, rowIndex: number): string {
    if (showWeights) {
      return `${value} (${value * workbook.matrix.rowWeights[rowIndex]})`;
    } else {
      return value.toString();
    }
  }
</script>

<DataTable bind:headers bind:rows>
  <svelte:fragment slot="cell-header" let:header>
    {#if header.key === "first_column"}
      {#if showWeights}
        <div>Attribute (weight)</div>
      {:else}
        <div>Attribute</div>
      {/if}
    {:else if header.key === "last_column"}
      <Button icon={Add} on:click={addColumn}>Add new column</Button>
    {:else}
      <Flex direction="row">
        <WorkbookStringCell
          value={header.value}
          on:change={(event) => updateHeader(+header.key, event.detail)}
        />
        <Button
          icon={TrashCan}
          iconDescription="Delete column"
          kind="danger"
          on:click={() => deleteColumn(+header.key)}
        />
      </Flex>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="cell" let:row let:cell>
    {#if row.id === "last_row"}
      <!-- Total Row -->
      {#if cell.key === "first_column"}
        <Flex direction="row" justify="start" align="center">
          <div class="bold">Total</div>
          <span style="width:20px" />
          <Button icon={Add} on:click={addRow}>Add new row</Button>
        </Flex>
      {:else if cell.key === "last_column"}
        <!-- Leave empty -->
      {:else}
        <Flex direction="row">
          <div class="bold">{calculateTotal(+cell.key)}</div>
        </Flex>
      {/if}
    {:else if cell.key === "first_column"}
      <Flex direction="row" justify="start">
        <WorkbookStringCell
          bold={true}
          value={cell.value}
          on:change={(event) => updateAttribute(+row.id, event.detail)}
        />
        {#if showWeights}
          <WorkbookNumberCell
            bold={true}
            value={workbook.matrix.rowWeights[+row.id]}
            formatter={(v) => `(${v})`}
            on:change={(event) => updateRowWeight(+row.id, event.detail)}
          />
        {/if}
        <Button
          icon={TrashCan}
          iconDescription="Delete row"
          kind="danger"
          on:click={() => deleteRow(+row.id)}
        />
      </Flex>
    {:else if cell.key === "last_column"}
      <!-- Leave empty -->
    {:else}
      <WorkbookNumberCell
        value={cell.value}
        formatter={(v) => numberCellFormatter(v, +row.id)}
        on:change={(event) => updateCell(+row.id, +cell.key, event.detail)}
      />
    {/if}
  </svelte:fragment>
</DataTable>

<style lang="scss">
  .bold {
    font-weight: bold;
  }
</style>
