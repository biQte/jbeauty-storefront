<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const emits = defineEmits<{
  (event: "onpointselect", data: any): void;
}>();

// Props for dynamic configuration
const props = defineProps({
  token: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "pl",
  },
  config: {
    type: String,
    default: "parcelcollect",
  },
  sandbox: {
    type: Boolean,
    default: false,
  },
});

// Refs for DOM management
const widgetId = "inpost-geowidget";
const wrapperId = `${widgetId}-wrapper`;

// Helper to load external scripts
function loadScript(src: string, onLoad: () => void, onError: () => void) {
  if (!document.querySelector(`script[src="${src}"]`)) {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = onLoad;
    script.onerror = onError;
    document.body.appendChild(script);
  } else {
    onLoad();
  }
}

// Helper to load external styles
function loadStylesheet(href: string, onLoad: () => void, onError: () => void) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = onLoad;
    link.onerror = onError;
    document.head.appendChild(link);
  } else {
    onLoad();
  }
}

// const resetWidget = () => {
//   const wrapperDiv = document.getElementById(wrapperId);
// };

// Initialize GeoWidget
function initializeWidget() {
  const wrapperDiv = document.getElementById(wrapperId);

  if (wrapperDiv) {
    const geoElement = document.createElement("inpost-geowidget");
    geoElement.setAttribute(
      "token",
      // "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDcyMjI1ODMsImlhdCI6MTczMTg2MjU4MywianRpIjoiNzYzYjgxYmQtNzZmMC00MDhkLWFhMDAtMDJhOWYzMWU3MTI1IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpfMUJmY1BtX09uMzBKV2VNVEtkUmM4VkVzMzhpN3Y5Ui14VzcxbDBaYk1BIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYTVmMmQyMmEtYzAxMi00NTY5LTk5NmYtZTc0OTA4NTI0NGJjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImE1ZjJkMjJhLWMwMTItNDU2OS05OTZmLWU3NDkwODUyNDRiYyIsImFsbG93ZWRfcmVmZXJyZXJzIjoiamJlYXV0eXNrbGVwLnBsIiwidXVpZCI6IjlhODIwYmU2LTJmMjItNDA1Ny05MTBlLThiODEwMDg5M2M3NCJ9.Hi1EmMvBsGwJO8JyaqV0AukG2iWJ9uhSStqBe4MCJG-4i6Ndb4jjEx_tYmUxuymKJeKKnLiti1PnQE3ZOMgFNJsnb1ZPKfcM0kGe-llD5RnbKsBqPQEJYon2vxMAeG_-ZjYy9NjwhhVZ35XD-1ERA-6Ah-7EgquUwl_fgN6i81ameJHD0yu4oci4t_DBMWQ8eHwaL1HOB3uMIksVIVTvbrAU4rZ5WKLSrVpw2j50mWxMAgrk-2c94NnO4zWM8nmjYPjw-H-JkFORLXHDFaQyVdC_aYCvdnJe7l0r2iSAQNvlT_F4iwjc3QKZ0Zfb9yCeVXPzbEBqml9xGenNOSxpyA"
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNTEwMTc3ODQsImlhdCI6MTczNTY1Nzc4NCwianRpIjoiMzMzNTFjNmMtOGIwMi00MGJjLThhNmQtNWUxZGFhYmUwZjkwIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpfMUJmY1BtX09uMzBKV2VNVEtkUmM4VkVzMzhpN3Y5Ui14VzcxbDBaYk1BIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiZTcwYjhmYTEtMmVjNi00OTcwLTk4NzMtMmMwMmYyYWNiN2ZmIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImU3MGI4ZmExLTJlYzYtNDk3MC05ODczLTJjMDJmMmFjYjdmZiIsImFsbG93ZWRfcmVmZXJyZXJzIjoiamJlYXV0eXNrbGVwLnBsLHd3dy5qYmVhdXR5c2tsZXAucGwiLCJ1dWlkIjoiOWE4MjBiZTYtMmYyMi00MDU3LTkxMGUtOGI4MTAwODkzYzc0In0.hyGfc2sOOH9NFmecj0J1P-Iw7e84N4fXFPV1r3pxVMbZi60b8zvUcCvmSzUWg83TlfH10kuTNh5bk8yLh3vHiKNDdiK5HV_oGLLSNuFREwRzyN351E3aScExnEIYtM6TiCRpRQEvqKS_qhvzSLpdyxOaZNxzKWHbEbFBU8HICwbzu_0y1Dhpnf1zHJCQdZoJbZGol9D9l8eP8qlaUyLtLqapvKZAAnh9sTGtoPEuMEZMitQRmEGuVfaK6-15lsxZEnHkQVDYfowLF7v8MuIukAkR4nqxJF4Nr3gk-YZR3uQBeri3dWhyGRF5LjtP4WfKqWgh_wKXxudwUaABpP9RnQ"
    );
    geoElement.setAttribute("language", props.language);
    geoElement.setAttribute("config", props.config);
    geoElement.setAttribute("onpoint", "onpointselect");
    geoElement.id = widgetId;
    wrapperDiv.appendChild(geoElement);

    geoElement.addEventListener("inpost.geowidget.init", (event: any) => {});
  } else {
    console.error("GeoWidget wrapper not found.");
  }
}

// Lifecycle Hooks
onMounted(() => {
  const scriptUrl = "https://geowidget.inpost.pl/inpost-geowidget.js";

  const stylesheetUrl = "https://geowidget.inpost.pl/inpost-geowidget.css";

  loadStylesheet(
    stylesheetUrl,
    () => {},
    () => {
      console.error("Failed to load GeoWidget stylesheet.");
    }
  );

  loadScript(
    scriptUrl,
    () => {
      initializeWidget();
    },
    () => {
      console.error("Failed to load GeoWidget script.");
    }
  );
});

onUnmounted(() => {
  //   const geoElement = document.getElementById(widgetId);
  //   if (geoElement) {
  //     geoElement.remove();
  //   }
});
</script>

<template>
  <div :id="wrapperId" style="width: 100%; height: 500px; overflow: hidden">
    <!-- GeoWidget will render here -->
  </div>
</template>
