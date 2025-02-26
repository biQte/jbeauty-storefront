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
        <h2>&#162; 1 Postanowienia ogólne</h2>
        <p>Organizatorem konkursu jest JBeauty Joanna Bilska.
        Konkurs odbywa się na platformie Instagram i nie jest w żaden sposób sponsorowany, popierany ani związany z Instagramem.
        Konkurs trwa od 26.02.2025 do 07.03.2025 do godziny 23:59
        Wyniki zostaną ogłoszone 08.03.2025 do godziny 18:00</p>
        <h2>&#162; 2 Warunki uczestnictwa</h2>
        <p>Uczestnikiem konkursu może być każda osoba fizyczna, która :
        posiada publiczne konto na Instagramie
        ukończyła 18 lat lub posiada zgodę opiekuna prawnego na udział w konkursie
        spelni wszystkie warunki uczestnictwa określone w $3 niniejszego regulaminu</p>
        <h2>&#162; 3 Zasady udziału w konkursie</h2>
        <p>Aby wziąć udział w konkursie, uczestnik musi:
        Zaobserwować profil organizatora 
        Polubić post konkursowy i udostępnić go na swoejej relacji (profil musi być publiczny)
        W komentarzu napisać za co lubi produkty jednej z marek konkursowych (Excellent Pro, Victoria Vynn) oraz oznaczyć 3 osoby, by zaprosić je do zabawy - liczba komentarzy nie jest ograniczona, każdy nowy komentarz oznacza kolejną szansę na wygraną.</p>
        <h2>&#162; Nagrody i wybór zwycięzcy</h2>
        <p>
            Nagrodami w konkursie są:
            <ol>
                <li>1x produkty do stylizacji paznokci o wartości 200 zł</li>
                <li>1x produkty do stylizacji paznokci o wartości 150 zł</li>
                <li>3x rabat 20% na zakupy w JBeauty</li>
            </ol>
        </p>
        <p>Spośród wszystkich poprawnie zgłoszonych uczestników organizator wybierze zwycięzców kierując się kreatywnością odpowiedzi na pytanie konkursowe.
        Wyniki zostaną ogłoszone na platformie Instagram 08.03.2025.
        Zwycięzcy zobowiązani są do kontaktu poprzez wiadomość na platformie Instagram w ciągu 48 godzin od ogłoszenia wyników.
        W przypadku braku kontaktu organizatorzy zastrzegają sobie prawo do wyłonienia innego zwycięzcy.
        </p>
        <h2>&#162; 5 Przetwarzanie danych osobowych</h2>
        <p>Uczestnicy konkursu wyrażają zgodę na przetwarzanie swoich danych osobowych w celu przeprowadzenia konkursu i przekazania nagrody.
            Dane osobowe nie będą przekazywane osobom trzecim ani wykorzystywane w celach marketingowych.</p>
        <h2>&#162; 6 Postanowienia końcowe</h2>
        <p>Udział w konkursie jest dobrowolny i oznacza akceptację niniejszego regulaminu.
            Wszelkie pytania dotyczące konkursu należy kierować do organizatora poprzez wiadomość prywatną na Instagramie.</p>
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

    h1{
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
}
</style>
