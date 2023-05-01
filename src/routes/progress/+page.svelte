<script lang="ts">
  import ProgressTreeView from "../../lib/progress/ProgressTreeView.svelte";
  import { progress } from "../../stores";
</script>

<ProgressTreeView title="My progress" bind:progress={$progress} />
