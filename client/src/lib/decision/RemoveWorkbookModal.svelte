<script lang="ts">
  import { Modal } from "carbon-components-svelte";
  import { store } from "../../stores";
  import type { DecisionWorkbook } from "./decision";

  export let open: boolean;
  export let workbook: DecisionWorkbook;

  function remove() {
    $store.decisions.workbooks = $store.decisions.workbooks.filter(
      (w) => w !== workbook,
    );
    open = false;
  }
</script>

<Modal
  bind:open
  danger
  modalHeading="Delete workbook"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:submit={remove}
>
  <p>This will delete {workbook.name}. Are you sure?</p>
  <br />
  <p class="warning">Warning: This action cannot be undone!</p>
</Modal>

<style lang="scss">
  .warning {
    color: red;
    font-weight: bold;
  }
</style>
