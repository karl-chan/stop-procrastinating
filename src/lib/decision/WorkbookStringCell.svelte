<script lang="ts">
  import { Button } from "carbon-components-svelte";
  import { Edit } from "carbon-icons-svelte";
  import { createEventDispatcher } from "svelte";
  import Flex from "../flex/Flex.svelte";

  export let value: string;
  export let bold: boolean = false;
  let editing = false;

  const dispatch = createEventDispatcher<{ change: string }>();

  function onChange() {
    dispatch("change", value);
    editing = false;
  }
</script>

{#if editing}
  <input bind:value on:blur={onChange} />
{:else}
  <Flex direction="row">
    <div class:bold>{value}</div>
    <Button
      kind="ghost"
      iconDescription="Rename"
      icon={Edit}
      on:click={() => (editing = true)}
    />
  </Flex>
{/if}

<style lang="scss">
  .bold {
    font-weight: bold;
  }
</style>
