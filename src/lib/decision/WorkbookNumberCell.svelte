<script lang="ts">
  import { Button, NumberInput } from "carbon-components-svelte";
  import { Edit } from "carbon-icons-svelte";
  import { createEventDispatcher } from "svelte";
  import Flex from "../flex/Flex.svelte";

  export let value: number;
  export let bold: boolean = false;
  export let formatter: (value: number) => string = (value) => value.toString();
  let editing = false;
  const min = 0;
  const max = 10;

  const dispatch = createEventDispatcher<{ change: number }>();

  function onChange() {
    const isValid = min <= value && value <= max;
    if (isValid) {
      dispatch("change", value);
      editing = false;
    }
  }
</script>

{#if editing}
  <NumberInput
    bind:value
    on:blur={onChange}
    {min}
    {max}
    invalidText="Number must be between {min} and {max}"
  />
{:else}
  <Flex direction="row">
    <div class:bold>{formatter(value)}</div>
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
