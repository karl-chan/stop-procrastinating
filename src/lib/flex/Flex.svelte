<script lang="ts">
  export let direction: "row" | "column" = "row";
  export let align: "start" | "center" | "end" | "stretch" = "center";
  export let justify:
    | "start"
    | "center"
    | "end"
    | "around"
    | "between"
    | "evenly" = "center";
  export let reverse = false;

  const alignMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };

  const justifyMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    around: "space-around",
    between: "space-between",
    evenly: "space-evenly",
  };

  $: directionWithReverse = reverse ? `${direction}-reverse` : direction;
</script>

<div
  {...$$restProps}
  class={$$restProps.class}
  style:display="flex"
  style:flex-direction={directionWithReverse}
  style:align-items={alignMap[align]}
  style:justify-content={justifyMap[justify]}
>
  <slot />
</div>
