<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Resep</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <InputModal 
        v-model:isOpen="isOpen" 
        v-model:editingId="editingId" 
        :resep="resep" 
        @submit="handleSubmit" 
      />

      <ion-list>
        <ion-item-sliding v-for="resep in reseps" :key="resep.id">
          <ion-item button @click="goToDetail(resep.id)">
  <ion-label>
    <h2>{{ resep.name }}</h2>
    <p>{{ truncateLangkah(resep.langkah) }}</p>
  </ion-label>
</ion-item>


          <ion-item-options side="start">
            <ion-item-option color="danger" @click="handleDelete(resep)">
              <ion-icon :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <ion-item-options side="end">
            <ion-item-option @click="handleEdit(resep)">
              <ion-icon :icon="create"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonLabel } from '@ionic/vue';
import { add, create, trash } from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { onMounted, ref } from 'vue';
import { firestoreService, type Resep } from '@/utils/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDetail = (id: string) => {
  router.push({ name: 'DetailResep', params: { id } });
};

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const resep = ref<Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>>({ name: '', langkah: '' });
const reseps = ref<Resep[]>([]);

const loadReseps = async () => {
  reseps.value = await firestoreService.getReseps();
};

onMounted(() => {
  loadReseps();
});

const handleRefresh = async (event: any) => {
  await loadReseps();
  event.target.complete();
};

const handleSubmit = async (resepData: Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingId.value) {
    await firestoreService.updateResep(editingId.value, resepData);
  } else {
    await firestoreService.addResep(resepData);
  }
  loadReseps();
  isOpen.value = false;
};

const handleEdit = (resep: Resep) => {
  editingId.value = resep.id!;
  Object.assign(resep, { ...resep });
  isOpen.value = true;
};

const handleDelete = async (resep: Resep) => {
  await firestoreService.deleteResep(resep.id!);
  loadReseps();
};

const openAddModal = () => {
  editingId.value = null;
  resep.value = { name: '', langkah: '' }; // Reset form for add
  isOpen.value = true;
};
const truncateLangkah = (text: string, wordLimit: number = 5) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};
</script>
