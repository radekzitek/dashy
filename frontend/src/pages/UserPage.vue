<template>
    <q-page class="q-pa-sm">
        <q-card bordered elevated class="my-card q-mx-auto">
            <q-img src="images/profile.jpg">
                <div class="text-h5 absolute-bottom text-right">Current User</div>
            </q-img>
            <q-card-section>
                <q-list>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="perm_identity" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label overline>Username</q-item-label>
                            <q-item-label>{{ authStore.username }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="badge" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label overline>First Name</q-item-label>
                            <q-item-label>{{ authStore.first_name }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="badge" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label overline>Last Name</q-item-label>
                            <q-item-label>{{ authStore.last_name }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="email" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label overline>eMail</q-item-label>
                            <q-item-label>{{ authStore.email }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

    </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
