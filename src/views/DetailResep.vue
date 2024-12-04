<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/resep"></ion-back-button>
          </ion-buttons>
          <ion-title>{{ resep?.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <div v-if="resep" class="recipe-details">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Resep : {{ resep.name }}</ion-card-title>
            </ion-card-header>
  
            <ion-card-content>
              <div class="recipe-section">
                <h4>Langkah Pembuatan</h4>
                <p>{{ resep.langkah }}</p>
              </div>
              <div class="recipe-metadata">
                <p>
                  <small>
                    Dibuat: {{ formatDate(resep.createdAt) }}
                    <span v-if="resep.createdAt !== resep.updatedAt">
                    
                    </span>
                  </small>
                </p>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
        <div v-else-if="!loading" class="ion-padding">
          <ion-text color="danger">Resep tidak ditemukan</ion-text>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    
    IonText
  } from '@ionic/vue';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { firestoreService, type Resep } from '@/utils/firestore';
  
  const route = useRoute();
  const resep = ref<Resep | null>(null);
  const loading = ref(true);
  
  const formatDate = (timestamp?: any) => {
    if (!timestamp) return '-';
    try {
      // Pastikan mendapatkan objek Date
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };
  
  onMounted(async () => {
    try {
      const resepId = route.params.id as string;
      resep.value = await firestoreService.getResepById(resepId);
            // Log untuk debugging
      console.log('Loaded Resep:', resep.value);
    } catch (error) {
      console.error('Error loading resep:', error);
      resep.value = null;
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style scoped>
  .recipe-details {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .recipe-section {
    margin-bottom: 20px;
    color: #000;
  }
  
  .recipe-section h2 {
  border-bottom: 1px solid #000; /* Mengubah warna border menjadi hitam */
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.recipe-metadata {

  margin-top: 20px;
  text-align: right;
  color: #000;/* Mengubah warna teks menjadi hitam */
}
.recipe-section h4,
.recipe-card-title,
.recipe-card-content,
.recipe-metadata,
.recipe-metadata small {
  color: #000000; /* Mengubah semua teks menjadi warna hitam */
}

  </style>