<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Kontakt",
  ogTitle: "JBeauty - Kontakt",
  description:
    "Skontaktuj się z nami. Email: info@jbeautysklep.pl. Telefon: +48 792 669 926",
  ogDescription:
    "Skontaktuj się z nami. Email: info@jbeautysklep.pl. Telefon: +48 792 669 926",
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

const { width, height } = useWindowSize();
</script>

<template>
  <div class="contact-page-wrapper">
    <h1>Kontakt</h1>
    <div class="contact-wrapper">
      <div class="text-wrapper">
        <h3>
          Masz pytania? Napisz:
          <a href="mailto:info@jbeautysklep.pl">info@jbeautysklep.pl</a>
        </h3>
        <h3>
          Wolisz zadzwonić? Telefon: <a href="tel:+48792669926">792 669 926</a>
        </h3>
        <h4>Możesz również skorzystać formularza kontaktowego.</h4>
        <div class="form-wrapper">
          <form
            action="https://formsubmit.co/a7589d8489d4702682a64ac853cd68b9"
            method="POST"
          >
            <div class="input-wrapper">
              <label for="email">Twój e-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Wpisz swój e-mail"
                required
              />
            </div>
            <div class="input-wrapper">
              <label for="firstName">Imię:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Twoje imię"
                required
              />
            </div>
            <div class="input-wrapper">
              <label for="subject">Temat wiadomości (opcjonalnie):</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Temat wiadomości (opcjonalnie)"
              />
            </div>
            <div class="input-wrapper">
              <label for="message">Wiadomość:</label>
              <textarea
                name="message"
                id="message"
                placeholder="Napisz wiadomość"
              ></textarea>
            </div>
            <input type="text" name="_honey" style="display: none" />
            <input type="hidden" name="_template" value="box" />
            <div class="submit-wrapper">
              <input type="submit" value="Prześlij" />
            </div>
            <br />
            <h5>Zwykle odpowiadamy do 24 godzin.</h5>
          </form>
        </div>
      </div>
      <!-- <div class="map-wrapper">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.9539572249855!2d20.406310712300453!3d49.808667571357795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47161917b01ff59d%3A0xe0204291449b2d1!2s%C5%BBegocina%20102%2C%2032-731%20%C5%BBegocina!5e1!3m2!1sen!2spl!4v1734556258937!5m2!1sen!2spl"
          width="600"
          height="450"
          style="border: 0"
          loading="lazy"
          v-if="width > 720"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.9539572249855!2d20.406310712300453!3d49.808667571357795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47161917b01ff59d%3A0xe0204291449b2d1!2s%C5%BBegocina%20102%2C%2032-731%20%C5%BBegocina!5e1!3m2!1sen!2spl!4v1734556258937!5m2!1sen!2spl"
          width="400"
          height="300"
          style="border: 0"
          loading="lazy"
          v-if="width <= 720"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact-page-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: start;
  align-items: center;
  justify-content: center;
  .contact-wrapper {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: start;
    justify-content: center;
    margin-top: 2rem;

    @media only screen and (max-width: 720px) {
      flex-direction: column;
    }
    .text-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-align: start;

      .form-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 90%;
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        //   background-color: #e4acc7;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

        .input-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 1rem;

          label {
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: $primary-color;
          }

          input[type="email"],
          textarea,
          input[type="text"] {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid $primary-color;
            border-radius: 25px;
            font-size: 1rem;
          }
        }
        .submit-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;

          input[type="submit"] {
            padding: 0.4rem 1.8rem;
            background-color: $primary-color;
            color: #fff;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
          }
        }
      }
    }

    .map-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
  }
}

h1 {
  font-size: 2.5rem;
  font-weight: 400;
  @media only screen and (max-width: 720px) {
    font-size: 2rem;
  }
}

h3 {
  font-size: 1.5rem;
  font-weight: 400;
  @media only screen and (max-width: 720px) {
    font-size: 1rem;
  }
}

h4 {
  font-size: 1.2rem;
  font-weight: 400;
  @media only screen and (max-width: 720px) {
    font-size: 1rem;
    text-align: center;
    text-wrap: wrap;
  }
}

h5 {
  font-size: 1rem;
  font-weight: 400;
}
</style>
