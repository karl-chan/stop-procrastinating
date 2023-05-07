<script lang="ts">
  import ProgressTreeEditor from "../../lib/progress/ProgressTreeEditor.svelte";
  import { progress } from "../../stores";
</script>

<ProgressTreeEditor title="My progress" bind:progress={$progress} />
