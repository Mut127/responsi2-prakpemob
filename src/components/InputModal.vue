<template>
    <ion-modal :is-open="isOpen" @did-dismiss="cancel" class="resep-modal">
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>{{ editingId ? 'Edit' : 'Add' }} Resep</ion-title>
          <ion-buttons slot="start">
            <ion-button @click="cancel" color="light">
              <ion-icon :icon="close" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item class="form-item">
          <ion-input 
            v-model="resep.name" 
            label="Resep Name" 
            label-placement="floating" 
            placeholder="Enter Resep Name">
          </ion-input>
        </ion-item>
        <ion-item class="form-item">
          <ion-textarea 
            v-model="resep.langkah" 
            label="Langkah-  Langkah" 
            label-placement="floating" 
            placeholder="Enter Description" 
            :autogrow="true" 
            :rows="3">
          </ion-textarea>
        </ion-item>
        <ion-row>
          <ion-col>
            <ion-button 
              type="button" 
              @click="submitForm" 
              shape="round" 
              color="primary" 
              expand="block">
              {{ editingId ? 'Edit' : 'Add' }} Resep
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonRow,
    IonCol,
    IonItem,
    IonContent,
    IonTextarea,
    IonDatetime,
  } from '@ionic/vue';
  import { close } from 'ionicons/icons';
  import { Resep, firestoreService } from '@/utils/firestore';
  import { watch, ref } from 'vue';
  
  const props = defineProps<{
    isOpen: boolean;
    editingId: string | null;
    resep: Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>;
  }>();
  
  const emit = defineEmits<{
    'update:isOpen': [value: boolean];
    'update:editingId': [value: string | null];
    'submit': [item: Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>];
  }>();
  
  const cancel = () => {
    emit('update:isOpen', false);
    emit('update:editingId', null);
    resetResep();
  };
  
  const submitForm = () => {
    emit('submit', props.resep);
    cancel();
  };
  
  const resetResep = () => {
    props.resep.name = '';
    props.resep.langkah = '';
   
  };
  
  // Watch editingId for changes
  watch(
    () => props.editingId,
    async (newEditingId) => {
      if (newEditingId) {
        try {
          const resep = await firestoreService.getResepById(newEditingId);
          if (resep) {
            props.resep.name = resep.name;
            props.resep.langkah = resep.langkah;
          
          }
        } catch (error) {
          console.error('Failed to fetch resep data:', error);
        }
      } else {
        resetResep();
      }
    },
    { immediate: true }
  );
  </script>
  <style scoped>
  .resep-modal {
    --background: var(--ion-color-light);
    --border-radius: 12px;
    --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  .form-item {
    margin-bottom: 16px;
  }
  </style>