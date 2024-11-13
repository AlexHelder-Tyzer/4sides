<template>
  <div v-if="showCamera" class="camera-modal">
    <div
      class="camera-header d-flex justify-content-between align-items-center mb-3">
      <h3>Captura una foto</h3>
      <button @click="closeCamera" class="btn btn-secondary">Cerrar</button>
    </div>

    <div class="d-flex flex-column align-items-center">
      <video ref="video" autoplay playsinline class="w-100 mb-2" />
      <button @click="takePhoto" class="btn btn-primary mt-2">
        Capturar Foto
      </button>
    </div>

    <div
      v-if="photoData"
      class="modal fade show"
      tabindex="-1"
      style="display: block"
      aria-labelledby="photoModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="photoModalLabel">
              Previsualización de la Foto
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closePhotoModal"
              aria-label="Cerrar"></button>
          </div>
          <div class="modal-body text-center">
            <img :src="photoData" alt="Foto Capturada" class="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showCamera: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      videoStream: null,
      photoData: null,
    };
  },

  methods: {
    async startCamera() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.$refs.video.srcObject = this.videoStream;
      } catch (error) {
        console.log("Error al acceder a la cámara", error);
      }
    },

    takePhoto() {
      const canvas = document.createElement("canvas");
      canvas.width = this.$refs.video.videoWidth;
      canvas.height = this.$refs.video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
      this.photoData = canvas.toDataURL("image/png");
    },

    closeCamera() {
      this.$emit("close-camera");
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
      }
      this.photoData = null;
    },

    closePhotoModal() {
      this.photoData = null;
    },
  },

  watch: {
    showCamera(value) {
      if (value) {
        this.startCamera();
      } else {
        this.closeCamera();
      }
    },
  },

  mounted() {
    if (this.showCamera) {
      this.startCamera();
    }
  },

  beforeUnmount() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
  },
};
</script>

<style scoped>
.camera-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  width: 80%;
  height: 80%;
  max-width: 600px;
  max-height: 600px;
  overflow: hidden;
  border-radius: 10px;
  padding: 20px;
}

.camera-header {
  width: 100%;
}

.photo-preview img {
  max-width: 100%;
  max-height: 300px;
}

.modal-dialog-centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  color: black;
  border-radius: 8px;
}

.modal-header {
  background-color: #007bff;
  color: white;
}

.btn-close {
  background-color: transparent;
  border: none;
  color: white;
}

.modal-body img {
  max-width: 100%;
  max-height: 500px;
}
</style>
