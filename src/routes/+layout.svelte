<script lang="ts">
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
    <HeaderNavItem href="/" text="Home" />
    <HeaderNavItem href="/progress" text="Progress" />
  </HeaderNav>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink href="/" text="Home" />
    <SideNavLink href="/progress" text="Progress" />
  </SideNavItems>
</SideNav>

<Content>
  <slot />
</Content>
