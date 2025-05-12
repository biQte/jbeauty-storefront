<!-- <script setup lang="ts"></script>

<template>
  <div class="footer-wrapper">
    <div class="footer-wrapper-top">
      <h4 class="find-us-at">Znajdziesz nas na</h4>
      <div class="socials">
        <a href="https://www.tiktok.com/@jbeautysklep.pl" target="_blank"
          ><svg
            fill="#ff5c8a"
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            xml:space="preserve"
          >
            <path
              d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
            />
          </svg>
        </a>
        <a href="https://www.instagram.com/jbeautysklep/" target="_blank">
          <v-icon icon="mdi-instagram" size="32" color="#ff5c8a"></v-icon>
        </a>
      </div>
    </div>
    <div class="footer-wrapper-bottom">
      <div class="about">
        <h4>O nas</h4>
        <NuxtLink to="/regulamin"><p>Regulamin</p></NuxtLink>
        <NuxtLink to="/regulamin#shipping-and-payments"
          ><p>Dostawa i płatność</p></NuxtLink
        >
        <NuxtLink to="/regulamin#withdrawal"
          ><p>Odstąpienie od umowy</p></NuxtLink
        >
        <NuxtLink to="/polityka-prywatnosci"
          ><p>Polityka prywatności</p></NuxtLink
        >
        <NuxtLink to="/polityka-prywatnosci#cookies"
          ><p>Polityka Cookies</p></NuxtLink
        >
      </div>
      <div class="contact">
        <h4>Kontakt</h4>
        <p>Żegocina 102</p>
        <p>32-731 Żegocina</p>
        <a href="mailto:info@jbeautysklep.pl"
          ><p>E-mail: info@jbeautysklep.pl</p></a
        >
        <a href="tel:+48792669926">
          <p>Telefon: 792 669 926</p>
        </a>
      </div>
      <div class="personal">
        <h4>Dane osobowe</h4>
        <NuxtLink to="/konto"><p>Konto</p></NuxtLink>
        <NuxtLink to="/konto?showOrders=true"><p>Zamówienia</p></NuxtLink>
      </div>
    </div>
    <div class="legal">
      <p>&copy;JBeauty Joanna Bilska {{ new Date().getFullYear() }}.</p>
      <p>Wszelkie prawa zastrzeżone.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-wrapper {
  margin-top: 5rem;
  background-color: $secondary-color;
  padding-top: 1rem;
  // margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  .footer-wrapper-top {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    .socials {
      display: flex;
      gap: 1.5rem;
    }
  }
  .footer-wrapper-bottom {
    display: flex;
    align-items: start;
    justify-content: space-around;
    // gap: 2rem;
    // position: absolute;
    // bottom: 0;
    // left: 0;
    width: 100%;

    @media only screen and (max-width: 720px) {
      flex-direction: column;
      justify-content: center;
      align-items: start;
      margin-left: 10%;
    }
  }

  .legal {
    background-color: $secondary-color;
    color: black;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 5px;
    font-size: 1rem;
    padding: 1rem 0;
    // font-family: "Poppins", sans-serif;
    @media only screen and (max-width: 720px) {
      flex-direction: column;
    }
  }

  h4 {
    font-size: 2rem;
  }

  h5 {
    font-size: 1.4rem;
  }
}
</style> -->

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-gray-100 text-gray-800 mt-20 pt-10 pb-6 px-6">
    <div
      class="max-w-screen-xl mx-auto grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    >
      <!-- Kolumna 1: O nas -->
      <div>
        <h4 class="text-lg font-semibold mb-3">O nas</h4>
        <ul class="space-y-2 text-sm">
          <li><NuxtLink to="/regulamin">Regulamin</NuxtLink></li>
          <li>
            <NuxtLink to="/regulamin#shipping-and-payments"
              >Dostawa i płatność</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/regulamin#withdrawal">Odstąpienie od umowy</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/polityka-prywatnosci">Polityka prywatności</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/polityka-prywatnosci#cookies"
              >Polityka Cookies</NuxtLink
            >
          </li>
        </ul>
      </div>

      <!-- Kolumna 2: Kontakt -->
      <div>
        <h4 class="text-lg font-semibold mb-3">Kontakt</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="https://jbeautysklep.pl/kontakt">Formularz kontaktowy</a></li>
          <li>Żegocina 102</li>
          <li>32-731 Żegocina</li>
          <li>
            <a href="mailto:info@jbeautysklep.pl">info@jbeautysklep.pl</a>
          </li>
          <li><a href="tel:+48792669926">792 669 926</a></li>
        </ul>
      </div>

      <!-- Kolumna 3: Konto -->
      <div>
        <h4 class="text-lg font-semibold mb-3">Dane osobowe</h4>
        <ul class="space-y-2 text-sm">
          <li><NuxtLink to="/konto">Konto</NuxtLink></li>
          <li><NuxtLink to="/konto?showorders=true">Zamówienia</NuxtLink></li>
        </ul>
      </div>

      <!-- Kolumna 4: Social media -->
      <div>
        <h4 class="text-lg font-semibold mb-3">Znajdziesz nas na</h4>
        <div class="flex items-center gap-4">
          <a
            href="https://www.tiktok.com/@jbeautysklep.pl"
            target="_blank"
            aria-label="TikTok"
          >
            <svg
              class="w-7 h-7 fill-[#ff5c8a]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
              />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/jbeautysklep/"
            target="_blank"
            aria-label="Instagram"
          >
            <v-icon icon="mdi-instagram" size="28" color="#ff5c8a"></v-icon>
          </a>
        </div>
      </div>
    </div>

    <!-- Dolna belka -->
    <div class="mt-10 text-center text-sm text-gray-500 border-t pt-4">
      &copy; JBeauty Joanna Bilska {{ currentYear }}. Wszelkie prawa
      zastrzeżone.
    </div>
  </footer>
</template>
