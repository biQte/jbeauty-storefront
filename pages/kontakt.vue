<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Kontakt",
  ogTitle: "JBeauty - Kontakt",
  description:
    "Skontaktuj się z nami. Email: info@jbeautysklep.pl. Telefon: +48 792 669 926",
  ogDescription:
    "Skontaktuj się z nami. Email: info@jbeautysklep.pl. Telefon: +48 792 669 926",
});
</script>

<template>
  <div class="contact-page-wrapper">
    <h1>Kontakt</h1>
    <h3>
      Masz pytania? Napisz:
      <a href="mailto:info@jbeautysklep.pl">info@jbeautysklep.pl</a>
    </h3>
    <h3>
      Wolisz zadzwonić? Telefon: <a href="tel:+48792669926">792 669 926</a>
    </h3>
    <h4>Możesz również skorzystać z poniższego formularza kontaktowego.</h4>
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
</template>

<style lang="scss" scoped>
.contact-page-wrapper {
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
  }
}

h5 {
  font-size: 1rem;
  font-weight: 400;
}
</style>
