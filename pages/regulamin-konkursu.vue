<script lang="ts" setup>
useSeoMeta({
  title: "JBeauty - Regulamin konkursu",
  ogTitle: "JBeauty - Regulamin konkursu",
});
</script>

<template>
  <div class="terms-of-contest">
    <h1>Regulamin konkursu</h1>
    <p>Ostatnia modyfikacja: 25.02.2025r.</p>
    <h2>&#167; 1 Postanowienia ogólne</h2>
    <ol>
      <li>Organizatorem konkursu jest JBeauty Joanna Bilska.</li>
      <li>
        Konkurs odbywa się na platformie Instagram i nie jest w żaden sposób
        sponsorowany, popierany ani związany z Instagramem.
      </li>
      <li>Konkurs trwa od 26.02.2025 do 07.03.2025 do godziny 23:59</li>
      <li>Wyniki zostaną ogłoszone 08.03.2025 do godziny 18:00</li>
    </ol>
    <h2>&#167; 2 Warunki uczestnictwa</h2>
    <ul>
      Uczestnikiem konkursu może być każda osoba fizyczna, która:
      <li>posiada publiczne konto na Instagramie</li>
      <li>
        ukończyła 18 lat lub posiada zgodę opiekuna prawnego na udział w
        konkursie
      </li>
      <li>
        spelni wszystkie warunki uczestnictwa określone w $3 niniejszego
        regulaminu
      </li>
    </ul>
    <h2>&#167; 3 Zasady udziału w konkursie</h2>
    <ol>
      Aby wziąć udział w konkursie, uczestnik musi:
      <li>Zaobserwować profil organizatora</li>
      <li>
        Polubić post konkursowy i udostępnić go na swoejej relacji (profil musi
        być publiczny)
      </li>
      <li>
        W komentarzu napisać za co lubi produkty jednej z marek konkursowych
        (Excellent Pro, Victoria Vynn) oraz oznaczyć 3 osoby, by zaprosić je do
        zabawy - liczba komentarzy nie jest ograniczona, każdy nowy komentarz
        oznacza kolejną szansę na wygraną.
      </li>
    </ol>
    <h2>&#167; Nagrody i wybór zwycięzcy</h2>
    <ol>
      <li>
        Nagrodami w konkursie są:
        <ul>
          <li>1x produkty do stylizacji paznokci o wartości 200 zł</li>
          <li>1x produkty do stylizacji paznokci o wartości 150 zł</li>
          <li>3x rabat 20% na zakupy w JBeauty</li>
        </ul>
      </li>
      <li>
        Spośród wszystkich poprawnie zgłoszonych uczestników organizator
        wybierze zwycięzców kierując się kreatywnością odpowiedzi na pytanie
        konkursowe.
      </li>
      <li>
        Wyniki zostaną ogłoszone na platformie Instagram 08.03.2025. Zwycięzcy
        zobowiązani są do kontaktu poprzez wiadomość na platformie Instagram w
        ciągu 48 godzin od ogłoszenia wyników.
      </li>
      <li>
        W przypadku braku kontaktu organizatorzy zastrzegają sobie prawo do
        wyłonienia innego zwycięzcy.
      </li>
    </ol>
    <h2>&#167; 5 Przetwarzanie danych osobowych</h2>
    <ol>
      <li>
        Uczestnicy konkursu wyrażają zgodę na przetwarzanie swoich danych
        osobowych w celu przeprowadzenia konkursu i przekazania nagrody.
      </li>
      <li>
        Dane osobowe nie będą przekazywane osobom trzecim ani wykorzystywane w
        celach marketingowych.
      </li>
    </ol>
    <h2>&#167; 6 Postanowienia końcowe</h2>
    <ol>
      <li>
        Udział w konkursie jest dobrowolny i oznacza akceptację niniejszego
        regulaminu.
      </li>
      <li>
        Wszelkie pytania dotyczące konkursu należy kierować do organizatora
        poprzez wiadomość prywatną na Instagramie.
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.terms-of-contest {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 2.5rem;
    font-weight: 400;
  }

  h2 {
    font-size: 2rem;
    font-weight: 400;
  }

  p {
    max-width: 1200px;
    padding: 0 5rem;
  }

  ol {
    max-width: 1200px;
    padding: 0 5rem;
    list-style-type: decimal;
  }

  .alphanumeric-list {
    list-style-type: lower-latin;
  }

  ul {
    list-style-type: disc;
  }
}
</style>
