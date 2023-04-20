<script lang="ts">
  import DailyChecklist from "../lib/checklist/DailyChecklist.svelte";
  import { checklist } from "../stores";
</script>

<DailyChecklist
  bind:checklist={$checklist.checklist}
  bind:doneDates={$checklist.doneDates}
/>
