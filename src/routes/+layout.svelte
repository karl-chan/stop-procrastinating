<script lang="ts">
  import {
    Content,
    Header,
    SideNav,
    SideNavItems,
    SideNavLink,
  } from "carbon-components-svelte";
  import "carbon-components-svelte/css/white.css";

  let isSideNavOpen = false;
</script>

<Header
  platformName="Stop Procrastinating"
  bind:isSideNavOpen
  persistentHamburgerMenu={true}
/>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink href="/" text="Home" />
  </SideNavItems>
</SideNav>

<Content>
  <slot />
</Content>
