<script lang="ts">
  import { Button } from "carbon-components-svelte";
  import type { TreeNodeId } from "carbon-components-svelte/types/TreeView/TreeView.svelte";
  import {
    Add,
    ArrowDown,
    ArrowUp,
    Clean,
    Edit,
    TrashCan,
  } from "carbon-icons-svelte";
  import Flex from "../flex/Flex.svelte";
  import AddProgressModal from "./AddProgressModal.svelte";
  import EditProgressModal from "./EditProgressModal.svelte";
  import ProgressTreeView from "./ProgressTreeView.svelte";
  import RemoveProgressModal from "./RemoveProgressModal.svelte";
  import type {
    AddProgressArgs,
    EditProgressArgs,
    Progress,
    ProgressTree,
    ProgressTreeMappingChangeArgs,
    RemoveProgressArgs,
  } from "./progress";

  export let title: string;
  export let progress: Progress;

  let activeId: TreeNodeId | undefined;
  let showAddModal: boolean;
  let showEditModal: boolean;
  let showRemoveModal: boolean;
  let addItemButtonMessage: string;

  let mapping: Map<TreeNodeId, ProgressTree>;
  let parentMapping: Map<TreeNodeId, TreeNodeId>;

  $: addItemButtonMessage = renderAddItemButtomMessage(activeId);
  $: hasSelection = activeId !== undefined && activeId !== "";

  interface SelectionInfo {
    isFirstOfParent: boolean;
    isLastOfParent: boolean;
  }
  $: selectionInfo = updateSelectionInfo(activeId);

  function handleAdd(event: CustomEvent<AddProgressArgs>) {
    const { progress: toAdd, parent } = event.detail;

    if (parent !== undefined) {
      parent.children?.push(toAdd);
    } else {
      progress.push(toAdd);
    }
    progress = progress;
  }

  function handleEdit(event: CustomEvent<EditProgressArgs>) {
    const { id: editId, description, name, current, total } = event.detail;

    const editProgress = mapping.get(editId)!;
    editProgress.description = description;
    editProgress.name = name;
    if (editProgress.leaf !== undefined) {
      editProgress.leaf = { current, total };
    }

    progress = progress;
  }

  function handleRemove(event: CustomEvent<RemoveProgressArgs>) {
    const { progress: toRemove } = event.detail;

    function dfs(tree: ProgressTree, parent?: ProgressTree) {
      if (tree === toRemove) {
        if (parent === undefined) {
          progress = progress.filter((root) => root !== toRemove);
        } else {
          parent.children = parent.children?.filter((c) => c !== toRemove);
        }
        return;
      }

      if (tree.children) {
        for (const child of tree.children) {
          dfs(child, tree);
        }
      }
    }

    for (const root of progress) {
      dfs(root, undefined);
    }
    progress = progress;
  }

  function handleMappingChange(
    event: CustomEvent<ProgressTreeMappingChangeArgs>
  ) {
    ({ mapping, parentMapping } = event.detail);
  }

  function getNearestFolder(
    activeId: TreeNodeId | undefined
  ): ProgressTree | undefined {
    if (!hasSelection) {
      return undefined;
    }
    const selected = mapping.get(activeId!);
    if (selected?.children) {
      // Selection is a folder
      return selected;
    } else {
      // Selection is an item
      const parentId = parentMapping.get(activeId!);
      return parentId !== undefined ? mapping.get(parentId) : undefined;
    }
  }

  function renderAddItemButtomMessage(
    activeId: TreeNodeId | undefined
  ): string {
    if (!hasSelection) {
      return "Add top-level item";
    }
    const selected = mapping.get(activeId!);
    if (selected?.leaf !== undefined) {
      return "Add sibling item";
    } else {
      return "Add child item";
    }
  }

  function updateSelectionInfo(
    activeId: TreeNodeId | undefined
  ): SelectionInfo {
    if (!hasSelection) {
      return {
        isFirstOfParent: false,
        isLastOfParent: false,
      };
    }
    const selected = mapping.get(activeId!);
    const parentId = parentMapping.get(activeId!);
    if (parentId === undefined) {
      return {
        isFirstOfParent: progress[0] === selected,
        isLastOfParent: progress[progress.length - 1] === selected,
      };
    } else {
      const siblings = mapping.get(parentId)?.children!;
      return {
        isFirstOfParent: siblings[0] === selected,
        isLastOfParent: siblings[siblings.length - 1] === selected,
      };
    }
  }

  function moveUp() {
    move({ isUp: true });
  }

  function moveDown() {
    move({ isDown: true });
  }

  function move(direction: { isUp?: boolean; isDown?: boolean }) {
    const selected = mapping.get(activeId!)!;
    const parentId = parentMapping.get(activeId!);
    if (parentId === undefined) {
      const index = progress.indexOf(selected);
      if (direction.isUp) {
        progress = [
          ...progress.slice(0, index - 1),
          selected,
          progress[index - 1],
          ...progress.slice(index + 1),
        ];
      } else if (direction.isDown) {
        progress = [
          ...progress.slice(0, index),
          progress[index + 1],
          selected,
          ...progress.slice(index + 2),
        ];
      }
    } else {
      const parent = mapping.get(parentId)!;
      const siblings = parent.children!;
      const index = siblings.indexOf(selected);
      if (direction.isUp) {
        parent.children = [
          ...siblings.slice(0, index - 1),
          selected,
          siblings[index - 1],
          ...siblings.slice(index + 1),
        ];
      } else if (direction.isDown) {
        parent.children = [
          ...siblings.slice(0, index),
          siblings[index + 1],
          selected,
          ...siblings.slice(index + 2),
        ];
      }
      progress = progress;
    }
    activeId = undefined;
  }
</script>

<ProgressTreeView
  bind:title
  bind:progress
  bind:activeId
  on:mappingChange={handleMappingChange}
/>

<Flex direction="row" justify="start">
  <Button icon={Add} kind="tertiary" on:click={() => (showAddModal = true)}
    >{addItemButtonMessage}</Button
  >
  {#if hasSelection}
    <Button icon={Edit} kind="secondary" on:click={() => (showEditModal = true)}
      >Edit item</Button
    >
    <Button
      icon={TrashCan}
      kind="danger-tertiary"
      on:click={() => (showRemoveModal = true)}>Remove item</Button
    >
    <Button icon={Clean} kind="primary" on:click={() => (activeId = undefined)}
      >Deselect item
    </Button>
    <Button
      icon={ArrowUp}
      iconDescription="Move up"
      kind="secondary"
      bind:disabled={selectionInfo.isFirstOfParent}
      on:click={moveUp}
    />
    <Button
      icon={ArrowDown}
      iconDescription="Move down"
      kind="secondary"
      bind:disabled={selectionInfo.isLastOfParent}
      on:click={moveDown}
    />
  {/if}
</Flex>

{#if showAddModal}
  <AddProgressModal
    bind:open={showAddModal}
    parent={getNearestFolder(activeId)}
    on:add={handleAdd}
  />
{/if}

{#if showEditModal && activeId !== undefined}
  <EditProgressModal
    bind:open={showEditModal}
    bind:activeId
    progress={mapping.get(activeId)}
    on:edit={handleEdit}
  />
{/if}

{#if showRemoveModal && activeId !== undefined}
  <RemoveProgressModal
    bind:open={showRemoveModal}
    progress={mapping.get(activeId)}
    on:remove={handleRemove}
  />
{/if}
