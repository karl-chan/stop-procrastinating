<script lang="ts">
  import ProgressTreeEditor from "../../lib/progress/ProgressTreeEditor.svelte";
  import { store } from "../../stores";
</script>

<ProgressTreeEditor title="My progress" bind:progress={$store.progress} />
