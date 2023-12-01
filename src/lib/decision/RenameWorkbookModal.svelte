<script lang="ts">
  import { Modal, TextInput } from "carbon-components-svelte";
  import { store } from "../../stores";
  import type { DecisionWorkbook } from "./decision";

  export let open = false;
  export let workbook: DecisionWorkbook;
  let inputName = "";
  let isValid = false;

  function validate() {
    const currentNames = $store.decisions.workbooks.map((w) => w.name);
    isValid =
      inputName.trim() !== "" && !currentNames.includes(inputName.trim());
  }

  function rename() {
    if (!isValid) {
      return;
    }
    workbook.name = inputName.trim();
    $store = $store;
    open = false;
  }
</script>

<Modal
  bind:open
  modalHeading="Rename workbook"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  selectorPrimaryFocus="#input-name"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit={rename}
>
  <p>Are you sure to rename {workbook.name} to something else?</p>
  <br />
  <TextInput
    id="input-name"
    placeholder="Enter new workbook name..."
    bind:value={inputName}
    on:input={validate}
    invalid={!isValid}
    invalidText="The workbook name {inputName} has already been taken. Please try another."
  />
</Modal>
