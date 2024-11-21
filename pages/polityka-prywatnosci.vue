<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Polityka prywatności",
  ogTitle: "JBeauty - Polityka prywatności",
});

const nuxtApp = useNuxtApp();

nuxtApp.$anchorScroll!.matched.push(({ path, hash }) => {
  if (hash) {
    console.log(hash);

    const targetSelector = hash;
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      return {
        toAnchor: {
          target: targetElement as HTMLElement,
          scrollOptions: {
            behavior: "smooth",
            offsetTop: 300,
          },
        },
      };
    }
  }
});
</script>

<template>
  <div class="privacy-policy-wrapper">
    <h1>Polityka prywatności</h1>
    <p>Ostatnia modyfikacja: 15.11.2024r.</p>
    <h2>&#167; 1 Postanowienia ogólne</h2>
    <ol>
      <li>
        Polityka prywatności określa, jak zbierane, przetwarzane i przechowywane
        są dane osobowe Użytkowników niezbędne do świadczenia usług drogą
        elektroniczną za pośrednictwem serwisu internetowego
        https://jbeautysklep.pl (dalej: Serwis).
      </li>
      <li>
        Serwis zbiera wyłącznie dane osobowe niezbędne do świadczenia i rozwoju
        usług w nim oferowanych.
      </li>
      <li>
        Dane osobowe zbierane za pośrednictwem Serwisu są przetwarzane zgodnie
        z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia
        27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku
        z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu
        takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie
        o ochronie danych, dalej RODO) oraz ustawą o ochronie danych osobowych z
        dnia 10 maja 2018 r.
      </li>
    </ol>
    <h2>&#167; 2 Administrator danych</h2>
    <ol>
      Administratorem danych osobowych zbieranych poprzez Serwis jest Joanna
      Bilska, adres: Żegocina 102, 32-731 Żegocina, NIP: 8681997279, REGON:
      540090261, adres poczty elektronicznej:
      <a href="mailto:info@jbeautysklep.pl">info@jbeautysklep.pl</a>
      (dalej: Administrator).
    </ol>
    <h2>&#167; 3 Cel zbierania danych osobowych</h2>
    <ol>
      <li>
        Dane osobowe wykorzystywane są w celu:
        <ul>
          <li>rejestracji konta i weryfikacji tożsamości Użytkownika,</li>
          <li>umożliwienia logowania do Serwisu,</li>
          <li>realizacji umowy dotyczącej usług i e-usług,</li>
          <li>komunikacji z Użytkownikiem</li>
          <li>
            wysyłki newslettera (po wyrażeniu zgody Użytkownika na jego
            otrzymywanie),
          </li>
          <li>prowadzenia systemu komentarzy,</li>
          <li>świadczenia usług społecznościowych,</li>
          <li>promocji oferty Administratora,</li>
          <li>marketingu, remarketingu, afiliacji,</li>
          <li>personalizacji Serwisu dla Użytkowników,</li>
          <li>działań analitycznych i statystycznych,</li>
          <li>windykacji należności,</li>
          <li>ustalenia i dochodzenia roszczeń albo obrony przed nimi.</li>
        </ul>
      </li>
      <li>
        Podanie danych jest dobrowolne, ale niezbędne do zawarcia umowy albo
        skorzystania z innych funkcjonalności Serwisu.
      </li>
    </ol>
    <h2>&#167; 4 Rodzaj przetwarzania danych osobowych</h2>
    <ol>
      Administrator może przetwarzać dane osobowe Użytkownika: imię i nazwisko,
      data urodzenia, adres zamieszkania, adres e-mail, numer telefonu, NIP.
    </ol>
    <h2>&#167; 5 Okres przechowywania danych osobowych</h2>
    <ol>
      Dane osobowe Użytkowników będą przetwarzane przez okres:
      <ul>
        <li>
          gdy podstawą przetwarzania danych jest wykonanie umowy – do momentu
          przedawnienia roszczeń po jej wykonaniu,
        </li>
        <li>
          gdy podstawą przetwarzania danych jest zgoda – do momentu jej
          odwołania, a po odwołaniu zgody do przedawnienia roszczeń.
        </li>
      </ul>
      W obu przypadkach termin przedawnienia wynosi 6 lat, a dla roszczeń
      o świadczenia okresowe i roszczeń dotyczących prowadzenia działalności
      gospodarczej – 3 lata (jeśli przepis szczególny nie stanowi inaczej).
    </ol>
    <h2>&#167; 6 Udostępnianie danych osobowych</h2>
    <ol>
      <li>
        Dane osobowe Użytkowników mogą być przekazywane: podmiotom powiązanym z
        Administratorem, jego podwykonawcom, podmiotom współpracującym z
        Administratorem np. firmom obsługującym e-płatności, firmom świadczącym
        usługi kurierskie/pocztowe, kancelariom prawnym.
      </li>
      <li>
        Dane osobowe Użytkowników będą przekazywane poza teren Europejskiego
        Obszaru Gospodarczego (EOG).
      </li>
    </ol>
    <h2>&#167; 7 Prawa Użytkowników</h2>
    <ol>
      <li>
        Użytkownik Serwisu ma prawo do: dostępu do treści swoich danych
        osobowych, ich sprostowania, usunięcia, ograniczenia przetwarzania,
        przenoszenia, wniesienia sprzeciwu wobec przetwarzania, cofnięcia zgody
        w każdej chwili (co nie ma wpływu na zgodność z prawem przetwarzania
        dokonanego w oparciu o zgodę przed jej cofnięciem).
      </li>
      <li>
        Zgłoszenie o wystąpieniu przez Użytkownika z uprawnieniem wynikającym
        z wymienionych praw należy przesłać na adres
        <a href="mailto:info@jbeautysklep.pl">info@jbeautysklep.pl</a>.
      </li>
      <li>
        Administrator spełnia lub odmawia spełnienia żądania niezwłocznie –
        maksymalnie w ciągu miesiąca od jego otrzymania.
      </li>
      <li>
        Użytkownik ma prawo złożyć skargę do Prezesa Urzędu Ochrony Danych
        Osobowych, jeśli uzna, że przetwarzanie narusza jego prawa i wolności
        (RODO).
      </li>
    </ol>
    <h2 id="cookies">&#167; 8 Pliki cookies</h2>
    <ol>
      <li>
        Serwis zbiera informacje za pomocą plików cookies – sesyjnych, stałych i
        podmiotów zewnętrznych.
      </li>
      <li>
        Zbieranie plików cookies wspiera poprawne świadczenie usług w Serwisie i
        służy celom statystycznym.
      </li>
      <li>
        Użytkownik może określić zakres dostępu plików cookies do swojego
        urządzenia w ustawieniach przeglądarki.
      </li>
    </ol>
    <h2>&#167; 9 Zautomatyzowane podejmowanie decyzji i profilowanie</h2>
    <ol>
      <li>
        Dane Użytkowników nie mogą być przetwarzane w zautomatyzowany sposób
        tak, że na skutek tego mogłyby zapaść wobec nich jakiekolwiek decyzje.
      </li>
      <li>
        Dane Użytkowników mogą być profilowane celem dostosowania treści i
        personalizacji oferty po wyrażeniu przez nich zgody.
      </li>
    </ol>
    <h2>&#167; 10 Postanowienia końcowe</h2>
    <ol>
      <li>
        Administrator ma prawo do wprowadzenia zmian w Polityce prywatności,
        przy czym prawa Użytkowników nie zostaną ograniczone.
      </li>
      <li>
        Informacja o wprowadzonych zmianach pojawi się w formie komunikatu
        dostępnego w Serwisie.
      </li>
      <li>
        W sprawach nieuregulowanych w niniejszej Polityce prywatności obowiązują
        przepisy RODO i przepisy prawa polskiego.
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.privacy-policy-wrapper {
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
