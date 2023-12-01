<script lang="ts">
  import DailyChecklist from "../lib/checklist/DailyChecklist.svelte";
  import { store } from "../stores";
</script>

<DailyChecklist
  bind:checklist={$store.checklist.checklist}
  bind:doneDates={$store.checklist.doneDates}
/>
