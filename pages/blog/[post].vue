<!-- <script setup lang="ts">
const route = useRoute();
const { data: post } = await useAsyncData("post", () =>
  queryCollection("blog")
    .where("draft", "<>", false)
    .where("title", "=", `${route.params.post}`)
    .first()
);

const { width, height } = useWindowSize();
</script>

<template>
  <v-sheet class="blog-post-wrapper">
    <v-card v-if="post" :width="width > 720 ? width * 0.7 : width * 0.9">
      <h1>{{ post.title }}</h1>
    </v-card>
    <v-card v-else> Nie znaleziono wpisu </v-card>
  </v-sheet>
</template>

<style lang="scss" scoped>
.blog-post-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 90vh;
  gap: 1rem;

  @media only screen and (max-width: 720px) {
    align-items: center;
    justify-content: flex-start;
  }
}
</style> -->

<script setup lang="ts">
const route = useRoute();
// const { data: post } = await useAsyncData("post", () =>
//   queryCollection("blog")
//     .where("draft", "<>", false)
//     .where("handle", "=", `${route.params.post}`)
//     .first()
// );

const { data: post } = await useAsyncData("post", () =>
  $fetch(`/api/blog/${route.params.post}`)
);

useSeoMeta({
  title: post.value?.title + " - JBeauty",
  ogTitle: post.value?.title + " - JBeauty",
  ogImage: post.value?.thumbnail,
  keywords: post.value?.tags.join(","),
});

const config = useRuntimeConfig();

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
  <v-container class="blog-post-wrapper">
    <v-card v-if="post" class="blog-post-card" :border="false" :elevation="0">
      <v-img :src="post.thumbnail" contain class="blog-post-image" />
      <!-- lazy-src="/placeholder.jpg" -->
      <v-card-title class="blog-post-title"
        ><h1>{{ post.title }}</h1></v-card-title
      >
      <v-card-subtitle class="blog-post-date">
        {{ new Date(post.date).toLocaleDateString("pl-PL") }}
      </v-card-subtitle>

      <v-card-text class="blog-post-content">
        <ContentRenderer :value="post.body" />
      </v-card-text>
    </v-card>

    <v-card v-else class="not-found">Nie znaleziono wpisu</v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.blog-post-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 90vh;
  padding: 2rem;
}

.blog-post-card {
  max-width: 1080px;
  width: 100%;
  padding: 1rem;

  @media only screen and (max-width: 720px) {
    padding: 0;
  }
}

.blog-post-image {
  height: auto;
  // max-height: 350px;
  max-height: 500px;
  border-radius: 8px;
}

.blog-post-title {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;

  ::v-deep(h1) {
    all: revert;
    font-size: 2rem;
    font-weight: 400;
  }
}

.blog-post-date {
  font-size: 1rem;
  color: gray;
}

.blog-post-content {
  font-size: 1.1rem;
  line-height: 1.6;
  padding-top: 1rem;

  div > * {
    margin-top: 1rem;
  }

  div {
    ::v-deep(h1),
    ::v-deep(h2),
    ::v-deep(h3),
    ::v-deep(h4),
    ::v-deep(h5),
    ::v-deep(h6) {
      all: revert;

      a {
        color: black;
        text-decoration: none;
      }
    }

    ::v-deep(ul),
    ::v-deep(ol),
    ::v-deep(li) {
      all: revert;
    }

    ::v-deep(a) {
      all: revert;
      color: $primary-color;
      text-decoration: none;
    }
  }
}
</style>
