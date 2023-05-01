<script lang="ts">
  import { Modal } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import type { ProgressTree, RemoveProgressArgs } from "./progress";

  export let open: boolean;
  export let progress: ProgressTree | undefined;

  $: childrenCount = countChildren(progress);

  const dispatch = createEventDispatcher<{ remove: RemoveProgressArgs }>();
  function remove() {
    if (progress !== undefined) {
      dispatch("remove", { progress });
    }
    open = false;
  }

  function countChildren(progress: ProgressTree | undefined): number {
    if (progress?.children) {
      return (
        progress.children.length +
        progress.children.map(countChildren).reduce((a, b) => a + b, 0)
      );
    }
    return 0;
  }
</script>

<Modal
  bind:open
  danger
  modalHeading="Delete item"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:submit={remove}
>
  {#if childrenCount > 0}
    <p>
      This will delete {progress?.name} and all its {childrenCount} children.
    </p>
  {:else}
    <p>This will delete {progress?.name}.</p>
  {/if}
</Modal>
