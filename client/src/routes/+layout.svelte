<script lang="ts">
  import { base } from "$app/paths";
  import {
    Content,
    Header,
    HeaderAction,
    HeaderNav,
    HeaderNavItem,
    HeaderUtilities,
    SideNav,
    SideNavItems,
    SideNavLink,
  } from "carbon-components-svelte";
  import "carbon-components-svelte/css/white.css";
  import { UserAvatarFilledAlt } from "carbon-icons-svelte";
  import UserInfo from "../lib/auth/UserInfo.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  let isSideNavOpen = false;
  let isAvatarOpen = false;
</script>

<Header
  platformName="Stop Procrastinating"
  bind:isSideNavOpen
  persistentHamburgerMenu={true}
>
  <HeaderNav>
    <HeaderNavItem href="{base}/" text="Home" />
    <HeaderNavItem href="{base}/progress" text="Progress" />
    <HeaderNavItem href="{base}/decisions" text="Decisions" />
  </HeaderNav>
  <HeaderUtilities>
    <HeaderAction
      bind:isOpen={isAvatarOpen}
      icon={UserAvatarFilledAlt}
      closeIcon={UserAvatarFilledAlt}
    >
      <UserInfo bind:user={data.user} bind:backups={data.backups}></UserInfo>
    </HeaderAction>
  </HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink href="{base}/" text="Home" />
    <SideNavLink href="{base}/progress" text="Progress" />
    <SideNavLink href="{base}/decisions" text="Decisions" />
  </SideNavItems>
</SideNav>

<Content>
  <slot />
</Content>
