<script lang="ts">
  import { Button, Tooltip } from "carbon-components-svelte";
  import CalendarHeatMap from "carbon-icons-svelte/lib/CalendarHeatMap.svelte";
  import Reset from "carbon-icons-svelte/lib/Reset.svelte";
  import dayjs from "dayjs";
  import Flex from "../flex/Flex.svelte";
  import { formatDate } from "../util/format";
  import Calendar from "./Calendar.svelte";
  import DismissibleChecklist from "./DismissibleChecklist.svelte";
  import type { Checklist } from "./checklist";

  export let checklist: Checklist;
  export let doneDates: string[];

  const today = formatDate(dayjs());
  let dismissed: Boolean[] = computeDismissed();

  function recordDone() {
    if (!doneDates.includes(today)) {
      doneDates.push(today);
      doneDates = doneDates;
    }
  }

  function reset() {
    doneDates = doneDates.filter((d) => d !== today);
    dismissed = computeDismissed();
  }

  function computeDismissed(): Boolean[] {
    return new Array(checklist.length).fill(
      doneDates.includes(today) ? true : false
    );
  }
</script>

<DismissibleChecklist
  title="Today's todos"
  bind:checklist
  bind:dismissed
  on:dismissAll={recordDone}
>
  <Flex slot="icons">
    <Tooltip>
      <Button
        iconDescription="Show calendar"
        icon={CalendarHeatMap}
        slot="icon"
      />
      <Calendar bind:doneDates />
    </Tooltip>
    <Button iconDescription="Reset" icon={Reset} on:click={reset} />
  </Flex>
</DismissibleChecklist>
