<script lang="ts">
  import {
    Button,
    ButtonSet,
    Toggle,
    TreeView,
  } from "carbon-components-svelte";
  import type {
    TreeNode,
    TreeNodeId,
  } from "carbon-components-svelte/types/TreeView/TreeView.svelte";
  import {
    Add,
    Clean,
    CollapseAll,
    Edit,
    ExpandAll,
    TrashCan,
  } from "carbon-icons-svelte";
  import Flex from "../flex/Flex.svelte";
  import { formatPercent } from "../util/format";
  import AddProgressModal from "./AddProgressModal.svelte";
  import EditProgressModal from "./EditProgressModal.svelte";
  import RemoveProgressModal from "./RemoveProgressModal.svelte";
  import type {
    AddProgressArgs,
    EditProgressArgs,
    Progress,
    ProgressTree,
    RemoveProgressArgs,
  } from "./progress";

  export let title: string;
  export let progress: Progress;

  let activeId: TreeNodeId | undefined;
  let treeview: TreeView;
  let showAddModal: boolean;
  let showEditModal: boolean;
  let showRemoveModal: boolean;
  let showDescription: boolean;
  let addItemButtonMessage: string;

  $: [children, mapping, parentMapping] = toTreeView(progress, showDescription);
  $: addItemButtonMessage = renderAddItemButtomMessage(activeId);

  interface Accumulator {
    percent: number;
  }

  function toTreeView(
    progress: Progress,
    showDescription: boolean
  ): [TreeNode[], Map<TreeNodeId, ProgressTree>, Map<TreeNodeId, TreeNodeId>] {
    let counter = 0;
    let mapping = new Map<TreeNodeId, ProgressTree>();
    let parentMapping = new Map<TreeNodeId, TreeNodeId>(); // Child id to parent id

    function formatRow(
      name: string,
      description: string,
      percent: number,
      showDescription: boolean
    ): string {
      return showDescription
        ? `${name} (${formatPercent(percent)}) - ${description}`
        : `${name} (${formatPercent(percent)})`;
    }

    function dfs(
      tree: ProgressTree,
      parentId: number | undefined
    ): {
      node: TreeNode;
      acc: Accumulator;
    } {
      const id = counter++;
      mapping.set(id, tree);
      if (parentId !== undefined) {
        parentMapping.set(id, parentId);
      }

      if (tree.leaf) {
        const percent = tree.leaf.current / tree.leaf.total;
        return {
          node: {
            id,
            text: formatRow(
              tree.name,
              tree.description,
              percent,
              showDescription
            ),
          },
          acc: { percent },
        };
      } else if (tree.children) {
        const zipped = tree.children.map((child) => dfs(child, id));

        // Average of child percentages
        const percent =
          zipped.reduce((acc, curr) => acc + curr.acc.percent, 0) /
          zipped.length;

        return {
          node: {
            id,
            text: formatRow(
              tree.name,
              tree.description,
              percent,
              showDescription
            ),
            children: zipped.map((z) => z.node),
          },
          acc: { percent },
        };
      } else {
        throw new Error(
          `Progress tree has neither leaf nor children: ${JSON.stringify(
            tree
          )}!`
        );
      }
    }

    const roots = progress
      .map((root) => dfs(root, undefined))
      .map(({ node, acc }) => node);
    return [roots, mapping, parentMapping];
  }

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

  function getNearestFolder(
    activeId: TreeNodeId | undefined
  ): ProgressTree | undefined {
    if (activeId === undefined || activeId === "") {
      return undefined;
    }
    const selected = mapping.get(activeId);
    if (selected?.children) {
      // Selection is a folder
      return selected;
    } else {
      // Selection is an item
      const parentId = parentMapping.get(activeId);
      return parentId !== undefined ? mapping.get(parentId) : undefined;
    }
  }

  function renderAddItemButtomMessage(
    activeId: TreeNodeId | undefined
  ): string {
    if (activeId === undefined || activeId === "") {
      return "Add top-level item";
    }
    const selected = mapping.get(activeId);
    if (selected?.leaf !== undefined) {
      return "Add sibling item";
    } else {
      return "Add child item";
    }
  }
</script>

<Flex direction="row" justify="between">
  <h2>{title}</h2>
  <Flex direction="row">
    <Toggle labelText="Show description" bind:toggled={showDescription} />

    <!-- Add 20px margin between toggle and buttons -->
    <div style:width="20px" />

    <Button
      icon={ExpandAll}
      iconDescription="Expand All"
      on:click={treeview?.expandAll}
    />
    <Button
      icon={CollapseAll}
      iconDescription="Collapse All"
      kind="secondary"
      on:click={treeview?.collapseAll}
    />
  </Flex>
</Flex>

<TreeView bind:this={treeview} bind:activeId {children} />

<ButtonSet>
  <Button icon={Add} kind="tertiary" on:click={() => (showAddModal = true)}
    >{addItemButtonMessage}</Button
  >
  {#if activeId !== undefined && activeId !== ""}
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
  {/if}
</ButtonSet>

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
