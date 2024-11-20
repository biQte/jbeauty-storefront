<script setup lang="ts"></script>

<template>
  <div class="footer-wrapper">
    <div class="footer-wrapper-top">
      <h4 class="find-us-at">Znajdziesz nas na</h4>
      <div class="socials">
        <v-btn variant="text"
          ><svg
            fill="#e42f7b"
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
        </v-btn>
        <a href="https://www.instagram.com/jbeautysklep/" target="_blank">
          <v-icon icon="mdi-instagram" size="32" color="#e42fb7"></v-icon>
        </a>
      </div>
    </div>
    <div class="footer-wrapper-bottom">
      <div class="about">
        <h4>O nas</h4>
        <NuxtLink to="/regulamin"><p>Regulamin</p></NuxtLink>
        <p>Dostawa i płatność</p>
        <p>Odstąpienie od umowy</p>
        <NuxtLink to="/polityka-prywatnosci"
          ><p>Polityka prywatności</p></NuxtLink
        >
        <p>Polityka Cookies</p>
      </div>
      <div class="contact">
        <h4>Kontakt</h4>
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
  background-color: #ffeff8;
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
    background-color: #e42f7b;
    color: white;
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
</style>
