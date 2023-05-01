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
  import { Add, CollapseAll, ExpandAll, TrashCan } from "carbon-icons-svelte";
  import Flex from "../flex/Flex.svelte";
  import { formatPercent } from "../util/format";
  import AddProgressModal from "./AddProgressModal.svelte";
  import RemoveProgressModal from "./RemoveProgressModal.svelte";
  import type {
    AddProgressArgs,
    Progress,
    ProgressTree,
    RemoveProgressArgs,
  } from "./progress";

  export let title: string;
  export let progress: Progress;

  let activeId: TreeNodeId;
  let treeview: TreeView;
  let showAddModal: boolean;
  let showRemoveModal: boolean;
  let showDescription: boolean;

  $: [children, mapping] = toTreeView(progress, showDescription);

  interface Accumulator {
    percent: number;
  }

  function toTreeView(
    progress: Progress,
    showDescription: boolean
  ): [TreeNode[], Map<TreeNodeId, ProgressTree>] {
    let counter = 0;
    let mapping = new Map<TreeNodeId, ProgressTree>();

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

    function dfs(tree: ProgressTree): {
      node: TreeNode;
      acc: Accumulator;
    } {
      const id = counter++;
      mapping.set(id, tree);

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
        const zipped = tree.children.map(dfs);

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

    const roots = progress.map(dfs).map(({ node, acc }) => node);
    return [roots, mapping];
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

  function detectSelectedParent(activeId: TreeNodeId) {
    return mapping.get(activeId)?.children ? mapping.get(activeId) : undefined;
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
    >{detectSelectedParent(activeId) !== undefined
      ? "Add item"
      : "Add top-level item"}</Button
  >
  <Button
    icon={TrashCan}
    kind="danger-tertiary"
    disabled={activeId === undefined || activeId === ""}
    on:click={() => (showRemoveModal = true)}>Remove item</Button
  >
</ButtonSet>

<AddProgressModal
  bind:open={showAddModal}
  parent={detectSelectedParent(activeId)}
  on:add={handleAdd}
/>
<RemoveProgressModal
  bind:open={showRemoveModal}
  progress={mapping.get(activeId)}
  on:remove={handleRemove}
/>
