<script lang="ts">
  import { Button, Toggle, TreeView } from "carbon-components-svelte";
  import type {
    TreeNode,
    TreeNodeId,
  } from "carbon-components-svelte/types/TreeView/TreeView.svelte";
  import { CollapseAll, ExpandAll } from "carbon-icons-svelte";
  import { createEventDispatcher } from "svelte";
  import Flex from "../flex/Flex.svelte";
  import { formatPercent } from "../util/format";
  import type {
    Progress,
    ProgressTree,
    ProgressTreeMappingChangeArgs,
  } from "./progress";

  const dispatch = createEventDispatcher<{
    mappingChange: ProgressTreeMappingChangeArgs;
  }>();

  export let title: string;
  export let progress: Progress;
  export let activeId: TreeNodeId | undefined;

  let treeview: TreeView;
  let showDescription: boolean;

  $: children = toTreeView(progress, showDescription);

  interface Accumulator {
    percent: number;
  }

  function toTreeView(
    progress: Progress,
    showDescription: boolean
  ): TreeNode[] {
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

    dispatch("mappingChange", {
      mapping,
      parentMapping,
    });

    return roots;
  }
</script>

<Flex direction="row" justify="between">
  <h2>{title}</h2>
  <Flex direction="row">
    <Toggle labelText="Show description" bind:toggled={showDescription} />

    <!-- Add 20px margin between toggle and buttons -->
    <div style:width="20px" />

    <Button
      icon={CollapseAll}
      iconDescription="Collapse All"
      kind="secondary"
      on:click={treeview?.collapseAll}
    />
    <Button
      icon={ExpandAll}
      iconDescription="Expand All"
      on:click={treeview?.expandAll}
    />
  </Flex>
</Flex>

<TreeView bind:this={treeview} bind:activeId {children} />
