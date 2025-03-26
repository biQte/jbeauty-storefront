<script setup lang="ts">
// const { data: posts } = await useAsyncData("blog", () => {
//   return queryCollection("blog")
//     .where("draft", "<>", false)
//     .order("date", "DESC")
//     .all();
// });

// const { data: posts } = await useAsyncData("blog", () => $fetch("/api/blog"));

const posts = ref();

const results = await Promise.allSettled([
  useFetch("/api/blog", { server: true }),
]);

if (results[0].status === "fulfilled") {
  posts.value = results[0].value.data.value;
} else {
  posts.value = [];
}

const { width } = useWindowSize();

useSeoMeta({
  title: "Blog - JBeauty",
  ogTitle: "Blog - JBeauty",
});

const config = useRuntimeConfig();
const route = useRoute();

useHead({
  link: [
    {
      rel: "canonical",
      href: `${config.public.storeUrl}${route.path}`,
    },
  ],
});
</script>

<template>
  <v-container class="blog-wrapper">
    <h1 class="blog-title">Blog</h1>
    <v-row justify="center">
      <v-col v-for="post in posts" :key="post.id" cols="12">
        <v-card class="blog-card" :to="`/blog/${post.handle}`">
          <v-img
            :src="post.thumbnail"
            cover
            class="blog-image"
            :alt="`Okładka postu ${post.title}`"
            max-height="350px"
          />
          <v-card-title class="blog-card-title">
            {{ post.title }}
          </v-card-title>
          <v-card-subtitle class="blog-card-date">
            {{ new Date(post.date).toLocaleDateString("pl-PL") }}
          </v-card-subtitle>
          <v-card-text class="blog-card-text">
            {{ post.description.slice(0, 250) + "..." }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="text">Czytaj więcej</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.blog-wrapper {
  width: 100%;
  min-height: 90vh;
  padding: 2rem;
  max-width: 900px;
  margin: auto;
}

.blog-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.blog-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  }
}

.blog-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.blog-card-title {
  font-size: 1.8rem;
  font-weight: 600;
  padding: 1rem;
}

.blog-card-date {
  font-size: 1rem;
  color: gray;
  padding: 0 1rem;
}

.blog-card-text {
  padding: 0 1rem 1rem;
  font-size: 1rem;
  color: #444;
}
</style>
