<script lang="ts">
  import { base } from "$app/paths";
  import {
    Content,
    Header,
    HeaderNav,
    HeaderNavItem,
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
>
  <HeaderNav>
    <HeaderNavItem href="{base}/" text="Home" />
    <HeaderNavItem href="{base}/progress" text="Progress" />
  </HeaderNav>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink href="{base}/" text="Home" />
    <SideNavLink href="{base}/progress" text="Progress" />
  </SideNavItems>
</SideNav>

<Content>
  <slot />
</Content>
