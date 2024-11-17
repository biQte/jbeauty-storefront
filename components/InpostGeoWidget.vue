<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const emit = defineEmits<{
  (event: "pointSelected", data: any): void;
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

// Initialize GeoWidget
function initializeWidget() {
  const wrapperDiv = document.getElementById(wrapperId);

  if (wrapperDiv) {
    const geoElement = document.createElement("inpost-geowidget");
    geoElement.setAttribute("token", props.token);
    geoElement.setAttribute("language", props.language);
    geoElement.setAttribute("config", props.config);
    geoElement.setAttribute("onpoint", "onpointselect");
    geoElement.id = widgetId;
    wrapperDiv.appendChild(geoElement);

    geoElement.addEventListener("inpost.geowidget.init", (event: any) => {
      console.log("GeoWidget initialized with API:", event.detail.api);

      document.addEventListener("onpointselect", (event: any) =>
        emit("pointSelected", event)
      );
    });
  } else {
    console.error("GeoWidget wrapper not found.");
  }
}

// Lifecycle Hooks
onMounted(() => {
  const scriptUrl = props.sandbox
    ? "https://sandbox-easy-geowidget-sdk.easypack24.net/inpost-geowidget.js"
    : "https://geowidget.inpost.pl/inpost-geowidget.js";

  const stylesheetUrl = props.sandbox
    ? "https://sandbox-easy-geowidget-sdk.easypack24.net/inpost-geowidget.css"
    : "https://geowidget.inpost.pl/inpost-geowidget.css";

  loadStylesheet(
    stylesheetUrl,
    () => {
      console.log("GeoWidget stylesheet loaded.");
    },
    () => {
      console.error("Failed to load GeoWidget stylesheet.");
    }
  );

  loadScript(
    scriptUrl,
    () => {
      console.log("GeoWidget script loaded.");
      initializeWidget();
    },
    () => {
      console.error("Failed to load GeoWidget script.");
    }
  );
});

onUnmounted(() => {
  const geoElement = document.getElementById(widgetId);
  if (geoElement) {
    geoElement.remove();
    console.log("GeoWidget removed.");
  }
});
document.removeEventListener("onpointselect", () => {});
</script>

<template>
  <div :id="wrapperId" style="width: 100%; height: 500px; overflow: hidden">
    <!-- GeoWidget will render here -->
  </div>
</template>
