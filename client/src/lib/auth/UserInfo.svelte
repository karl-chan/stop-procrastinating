<script lang="ts">
  import { base } from "$app/paths";
  import { Button, HeaderPanelDivider } from "carbon-components-svelte";
  import {
      CloudUpload,
      Logout,
      RecentlyViewed,
      TrashCan,
  } from "carbon-icons-svelte";
  import dayjs from "dayjs";
  import { defaultStore, store } from "../../stores";
  import Flex from "../flex/Flex.svelte";
  import { defaultUser, type Backup, type User } from "./user";

  export let user: User;
  export let backups: Backup[];

  async function performBackup() {
    try {
      const res = await fetch(`${base}/api/backup`, {
        method: "POST",
        body: JSON.stringify($store),
      });
      const { id, timestamp } = await res.json();
      backups = [{ id, timestamp }, ...backups];
    } catch (err) {
      console.error(err);
    }
  }

  async function restoreFrom(backup: Backup) {
    try {
      const res = await fetch(`${base}/api/backup/${backup.id}`);
      const state = await res.json();
      $store = state;
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteBackup(backup: Backup) {
    try {
      await fetch(`${base}/api/backup/${backup.id}`, {
        method: "DELETE",
      });
      backups = backups.filter((b) => b.id != backup.id);
    } catch (err) {
      console.error(err);
    }
  }

  async function logout() {
    try {
      await performBackup();
      await fetch(`${base}/api/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    } finally {
      user = defaultUser;
      $store = defaultStore;
    }
  }
</script>

<Flex direction="column" align="center">
  <img src={user.avatarUrl} width="100px" height="100px" alt="avatar" />
  <p>{user.name}</p>

  {#if user.isAuthenticated}
    <HeaderPanelDivider />
    <Button icon={CloudUpload} on:click={performBackup} style="width: 100%"
      >Back up now</Button
    >

    {#if backups.length}
      <Flex direction="column" align="start">
        <HeaderPanelDivider>Restore from</HeaderPanelDivider>
        {#each backups as backup}
          <Flex direction="row">
            <Button
              size="small"
              icon={RecentlyViewed}
              on:click={() => restoreFrom(backup)}
              >{dayjs(backup.timestamp).format("lll")}</Button
            >
            <Button
              size="small"
              kind="danger"
              icon={TrashCan}
              on:click={() => deleteBackup(backup)}
            />
          </Flex>
        {/each}
      </Flex>
    {/if}

    <HeaderPanelDivider />
    <Button kind="danger" icon={Logout} on:click={logout} style="width: 100%"
      >Log out</Button
    >
  {:else}
    <Button href="{base}/api/login/google">Sign in with Google</Button>
  {/if}
</Flex>
