<script lang="ts">
  import {
    Button,
    ComposedModal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListRow,
    TextInput,
    Toggle,
  } from "carbon-components-svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import ArrowDown from "carbon-icons-svelte/lib/ArrowDown.svelte";
  import ArrowUp from "carbon-icons-svelte/lib/ArrowUp.svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import Close from "carbon-icons-svelte/lib/Close.svelte";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import type { Checklist, ChecklistItem } from "./checklist";

  export let open: boolean;
  export let checklist: Checklist;

  interface EditItem {
    active: boolean;
    error: boolean;
    item: ChecklistItem;
  }
  let editing: EditItem[] = resetEditItems();
  let reorderMode = false;

  function edit(i: number) {
    const copyItem = Object.assign({}, checklist[i]);
    editing[i] = {
      active: true,
      error: false,
      item: copyItem,
    };
  }

  function validate(i: number): boolean {
    if (editing[i].active && editing[i].item.text.trim().length == 0) {
      editing[i].error = true;
      return false;
    } else {
      editing[i].error = false;
      return true;
    }
  }

  function save(i: number) {
    if (!validate(i)) {
      return;
    }

    const frozen = Object.freeze(editing[i].item);
    if (i >= checklist.length) {
      checklist.push(frozen);
      checklist = checklist;
    } else {
      checklist[i] = frozen;
    }
    editing[i] = defaultEditItem();
  }

  function cancel(i: number) {
    if (i >= checklist.length) {
      editing.pop();
      editing = editing;
    } else {
      editing[i] = defaultEditItem();
    }
  }

  function remove(i: number) {
    checklist.splice(i, 1);
    checklist = checklist;

    editing.splice(i, 1);
    editing = editing;
  }

  function append() {
    editing.push(defaultEditItem({ active: true }));
    editing = editing;
  }

  function moveUp(i: number) {
    const swap = checklist[i - 1];
    checklist[i - 1] = checklist[i];
    checklist[i] = swap;
  }

  function moveDown(i: number) {
    const swap = checklist[i + 1];
    checklist[i + 1] = checklist[i];
    checklist[i] = swap;
  }

  function defaultEditItem(options = { active: false }): EditItem {
    return {
      active: options.active,
      error: false,
      item: {
        text: "",
        actionUrl: undefined,
      },
    };
  }

  function reset() {
    editing = resetEditItems();
  }

  function resetEditItems(): EditItem[] {
    return Array.from(checklist, (_) => defaultEditItem());
  }

  $: isLastItemBeingEdited =
    editing.length > 0 && editing[editing.length - 1].active;
</script>

<ComposedModal bind:open on:close={reset}>
  <ModalHeader title="Edit checklist" />
  <ModalBody>
    <StructuredList condensed>
      <StructuredListBody>
        {#each editing as editItem, i (i)}
          <StructuredListRow>
            {#if editItem.active}
              <StructuredListCell>
                <TextInput
                  bind:value={editItem.item.text}
                  bind:invalid={editItem.error}
                  labelText="Text"
                  required
                />
              </StructuredListCell>
              <StructuredListCell>
                <TextInput
                  bind:value={editItem.item.actionUrl}
                  labelText="URL"
                />
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  iconDescription="Save"
                  icon={Checkmark}
                  on:click={() => save(i)}
                />
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  iconDescription="Cancel"
                  icon={Close}
                  on:click={() => cancel(i)}
                />
              </StructuredListCell>
            {:else}
              <StructuredListCell>
                {checklist[i].text}</StructuredListCell
              >
              <StructuredListCell>{checklist[i].actionUrl}</StructuredListCell>
              {#if reorderMode}
                {#if i > 0}
                  <StructuredListCell>
                    <Button
                      iconDescription="Move up"
                      icon={ArrowUp}
                      on:click={() => moveUp(i)}
                    />
                  </StructuredListCell>
                {/if}
                {#if i < checklist.length - 1}
                  <StructuredListCell>
                    <Button
                      iconDescription="Move down"
                      icon={ArrowDown}
                      on:click={() => moveDown(i)}
                    />
                  </StructuredListCell>
                {/if}
              {:else}
                <StructuredListCell>
                  <Button
                    iconDescription="Edit"
                    icon={Edit}
                    on:click={() => edit(i)}
                  />
                </StructuredListCell>
                <StructuredListCell>
                  <Button
                    iconDescription="Delete"
                    icon={TrashCan}
                    on:click={() => remove(i)}
                  />
                </StructuredListCell>
              {/if}
            {/if}
          </StructuredListRow>
        {/each}
      </StructuredListBody>
    </StructuredList>
  </ModalBody>
  <ModalFooter>
    <Button icon={Add} on:click={append} bind:disabled={isLastItemBeingEdited}>
      Add new item
    </Button>
    <Toggle labelText="Reorder mode" bind:toggled={reorderMode} />
  </ModalFooter>
</ComposedModal>
