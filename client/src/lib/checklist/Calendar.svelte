<script lang="ts">
  import { Button } from "carbon-components-svelte";
  import CaretLeft from "carbon-icons-svelte/lib/CaretLeft.svelte";
  import CaretRight from "carbon-icons-svelte/lib/CaretRight.svelte";
  import dayjs, { Dayjs } from "dayjs";
  import Flex from "../flex/Flex.svelte";
  import { formatDate } from "../util/format";

  export let doneDates: string[];

  const startOfMonth = dayjs().startOf("month");

  let displayMonth = startOfMonth;
  $: isLatestMonth = displayMonth.isSame(startOfMonth);
  $: grid = computeCalendarGrid(displayMonth);
  $: doneDatesSet = new Set(doneDates);

  type Row = (number | undefined)[];
  type Grid = Row[];

  function computeCalendarGrid(displayMonth: Dayjs): Grid {
    const startDayOfWeek = displayMonth.day();
    const lastDayOfMonth = displayMonth.endOf("month").date();
    const grid: Grid = [];

    const firstRow: Row = [
      ...emptyOfLength(startDayOfWeek),
      ...range(1, 8 - startDayOfWeek),
    ];
    grid.push(firstRow);

    for (
      let counter = 8 - startDayOfWeek;
      counter <= lastDayOfMonth;
      counter += 7
    ) {
      const row: Row =
        counter + 7 <= lastDayOfMonth
          ? range(counter, counter + 7)
          : [
              ...range(counter, lastDayOfMonth + 1),
              ...emptyOfLength(lastDayOfMonth - counter + 6),
            ];
      grid.push(row);
    }

    return grid;
  }

  function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  function emptyOfLength(length: number): undefined[] {
    return new Array(length).fill(undefined);
  }

  function prevMonth() {
    displayMonth = displayMonth.subtract(1, "month");
  }

  function nextMonth() {
    displayMonth = displayMonth.add(1, "month");
  }

  function isDone(cell: number | undefined) {
    if (cell !== undefined) {
      const cellDate = formatDate(dayjs(displayMonth).set("date", cell));
      return doneDatesSet.has(cellDate);
    }
    return false;
  }
</script>

<Flex direction="column" align="center">
  <Flex direction="row" justify="between">
    <Button
      iconDescription="Previous month"
      icon={CaretLeft}
      size="small"
      on:click={prevMonth}
    />
    <div class="title">
      {displayMonth.format("MMM")}
      {displayMonth.format("YYYY")}
    </div>
    <Button
      iconDescription="Next month"
      icon={CaretRight}
      size="small"
      on:click={nextMonth}
      bind:disabled={isLatestMonth}
    />
  </Flex>

  <table>
    <thead>
      {#each Array(7) as _, i}
        <th>{dayjs().day(i).format("ddd")}</th>
      {/each}
    </thead>
    <tbody>
      {#each grid as row}
        <tr>
          {#each row as cell}
            <td class:done={isDone(cell)}>
              {cell ?? ""}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</Flex>

<style lang="scss">
  .title {
    font-size: 24px;
  }

  table,
  th,
  td {
    text-align: center;
    vertical-align: middle;
  }

  .done {
    color: white;
    background-color: green;
    font-weight: bold;
  }
</style>
