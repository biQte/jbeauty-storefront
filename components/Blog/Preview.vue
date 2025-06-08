<script setup lang="ts">
defineProps<{
  posts: any[];
}>();

const router = useRouter();
</script>

<template>
  <section class="blog-preview-wrapper">
    <h3 class="blog-preview-title">Najświesze na blogu</h3>
    <div class="blog-preview-grid">
      <div
        class="blog-preview-card"
        v-for="post in posts.slice(0, 3)"
        :key="post.id"
        @click="router.push(`/blog/${post.handle}`)"
      >
        <img
          :src="post.thumbnail"
          :alt="`Miniatura postu ${post.title}`"
          class="blog-preview-img"
        />
        <h3 class="blog-preview-heading">{{ post.title }}</h3>
        <p class="blog-preview-snippet">
          {{ post.description.slice(0, 120) + "..." }}
        </p>
        <button class="blog-preview-btn">Czytaj więcej</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.blog-preview-wrapper {
  padding: 3rem 1rem;
  background-color: #fafafa;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.blog-preview-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.blog-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  justify-content: center;
}

.blog-preview-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.1);
  }

  .blog-preview-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
  }

  .blog-preview-heading {
    margin: 1rem 0 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .blog-preview-snippet {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 1rem;
  }

  .blog-preview-btn {
    background: #ff5c6a;
    color: white;
    border: none;
    padding: 0.6rem 1.4rem;
    border-radius: 25px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: #e84a58;
    }
  }
}
</style>