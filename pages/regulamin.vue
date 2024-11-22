<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Regulamin",
  ogTitle: "JBeauty - Regulamin",
});

const nuxtApp = useNuxtApp();

nuxtApp.$anchorScroll!.matched.push(({ path, hash }) => {
  if (hash) {
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
  <div class="terms-of-service-wrapper">
    <h1>Regulamin sklepu JBeauty</h1>
    <p>Ostatnia modyfikacja: 15.11.2024r.</p>
    <h2>&#167; 1 Postanowienia wstępne</h2>
    <ol>
      <li>
        Sklep internetowy JBeauty, dostępny pod adresem internetowym
        https://jbeautysklep.pl, prowadzony jest przez Joannę Bilską prowadzącą
        działalność gospodarczą pod firmą JBeauty Joanna Bilska, wpisaną do
        Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG)
        prowadzonej przez ministra właściwego ds. gospodarki, NIP 8681997279,
        REGON 540090261.
      </li>
      <li>
        Niniejszy Regulamin skierowany jest zarówno do Konsumentów, jak i do
        Przedsiębiorców korzystających ze Sklepu i określa zasady korzystania ze
        Sklepu internetowego oraz zasady i tryb zawierania Umów Sprzedaży z
        Klientem na odległość za pośrednictwem Sklepu.
      </li>
    </ol>
    <h2>&#167; 2 Definicje</h2>
    <ol>
      <li>
        <b>Konsument</b> - osoba fizyczna zawierająca ze Sprzedawcą umowę w
        ramach Sklepu, której przedmiot nie jest związany bezpośrednio z jej
        działalnością gospodarczą lub zawodową.
      </li>
      <li>
        <b>Sprzedawca</b> - osoba fizyczna prowadząca działalność gospodarczą
        pod firmą JBeauty Joanna Bilska, wpisaną do Centralnej Ewidencji i
        Informacji o Działalności Gospodarczej (CEIDG) prowadzonej przez
        ministra właściwego ds. gospodarki, NIP 8681997279, REGON 540090261.
      </li>
      <li>
        <b>Klient</b> - każdy podmiot dokonujący zakupów za pośrednictwem
        Sklepu.
      </li>
      <li>
        <b>Przedsiębiorca</b> - osoba fizyczna, osoba prawna i jednostka
        organizacyjna niebędąca osobą prawną, której odrębna ustawa przyznaje
        zdolność prawną, wykonująca we własnym imieniu działalność gospodarczą,
        która korzysta ze Sklepu.
      </li>
      <li>
        <b>Sklep</b> - sklep internetowy prowadzony przez Sprzedawcę pod adresem
        internetowym https://jbeautysklep.pl
      </li>
      <li>
        <b>Umowa zawarta na odległość</b> - umowa zawarta z Klientem w ramach
        zorganizowanego systemu zawierania umów na odległość (w ramach Sklepu),
        bez jednoczesnej fizycznej obecności stron, z wyłącznym wykorzystaniem
        jednego lub większej liczby środków porozumiewania się na odległość do
        chwili zawarcia umowy włącznie.
      </li>
      <li><b>Regulamin</b> - niniejszy regulamin Sklepu.</li>
      <li>
        <b>Zamówienie</b> - oświadczenie woli Klienta składane za pomocą
        Formularza Zamówienia i zmierzające bezpośrednio do zawarcia Umowy
        Sprzedaży Produktu lub Produktów ze Sprzedawcą.
      </li>
      <li>
        <b>Konto</b> - konto klienta w Sklepie, są w nim gromadzone dane podane
        przez Klienta oraz informacje o złożonych przez niego Zamówieniach w
        Sklepie.
      </li>
      <li>
        <b>Formularz rejestracji</b> - formularz dostępny w Sklepie,
        umożliwiający utworzenie Konta.
      </li>
      <li>
        <b>Formularz zamówienia</b> - interaktywny formularz dostępny w Sklepie
        umożliwiający złożenie Zamówienia, w szczególności poprzez dodanie
        Produktów do Koszyka oraz określenie warunków Umowy Sprzedaży, w tym
        sposobu dostawy i płatności.
      </li>
      <li>
        <b>Koszyk</b> – element oprogramowania Sklepu, w którym widoczne są
        wybrane przez Klienta Produkty do zakupu, a także istnieje możliwość
        ustalenia i modyfikacji danych Zamówienia, w szczególności ilości
        produktów.
      </li>
      <li>
        <b>Produkt</b> - dostępna w Sklepie rzecz ruchoma/usługa będąca
        przedmiotem Umowy Sprzedaży między Klientem a Sprzedawcą.
      </li>
      <li>
        <b>Umowa Sprzedaży</b> - umowa sprzedaży Produktu zawierana albo zawarta
        między Klientem a Sprzedawcą za pośrednictwem Sklepu internetowego.
      </li>
    </ol>
    <h2>&#167; 3 Kontakt ze Sklepem</h2>
    <ol>
      <li>Adres Sprzedawcy: 32-731 Żegocina, Żegocina 102</li>
      <li>Adres e-mail Sprzedawcy: info@jbeautysklep.pl</li>
      <li>Numer telefonu Sprzedawcy: +48 792 669 926</li>
      <li>
        Numer rachunku bankowego Sprzedawcy 90 1140 2004 0000 3002 8533 6659
      </li>
      <li>
        Klient może porozumiewać się ze Sprzedawcą za pomocą adresów i numerów
        telefonów podanych w niniejszym paragrafie.
      </li>
      <li>
        Klient może porozumieć się telefonicznie ze Sprzedawcą w godzinach
        8:00-16:00.
      </li>
    </ol>
    <h2>&#167; 4 Wymagania techniczne</h2>
    <ol class="alphanumeric-list">
      Do korzystania ze Sklepu, w tym przeglądania asortymentu Sklepu oraz
      składania zamówień na Produkty, niezbędne są:
      <li>
        urządzenie końcowe z dostępem do sieci Internet i przeglądarką
        internetową typu smartfon, komputer PC, laptop, itp.,
      </li>
      <li>aktywne konto poczty elektronicznej (e-mail),</li>
      <li>włączona obsługa plików cookies.</li>
    </ol>
    <h2>&#167; 5 Informacje ogólne</h2>
    <ol>
      <li>
        Sprzedawca w najszerszym dopuszczalnym przez prawo zakresie nie ponosi
        odpowiedzialności za zakłócenia w tym przerwy w funkcjonowaniu Sklepu
        spowodowane siłą wyższą, niedozwolonym działaniem osób trzecich lub
        niekompatybilnością Sklepu internetowego z infrastrukturą techniczną
        Klienta.
      </li>
      <li>
        Przeglądanie asortymentu Sklepu nie wymaga zakładania Konta. Składanie
        zamówień przez Klienta na Produkty znajdujące się w asortymencie Sklepu
        możliwe jest albo po założeniu Konta zgodnie z postanowieniami § 6
        Regulaminu albo przez podanie niezbędnych danych osobowych i adresowych
        umożliwiających realizację Zamówienia bez zakładania Konta.
      </li>
      <li>
        Ceny podane w Sklepie są podane w polskich złotych i są cenami brutto
        (uwzględniają podatek VAT).
      </li>
      <li>
        Na końcową (ostateczną) kwotę do zapłaty przez Klienta składa się cena
        za Produkt oraz koszt dostawy (w tym opłaty za transport, dostarczenie i
        usługi pocztowe), o której Klient jest informowany na stronach Sklepu w
        trakcie składania Zamówienia, w tym także w chwili wyrażenia woli
        związania się Umową Sprzedaży.
      </li>
    </ol>
    <h2>&#167; 6 Zakładanie konta w sklepie</h2>
    <ol>
      <li>
        Aby założyć Konto w Sklepie, należy wypełnić Formularz rejestracji.
        Niezbędne jest podanie następujących danych: Adres E-mail, Imię,
        Nazwisko, Hasło
      </li>
      <li>Założenie Konta w Sklepie jest darmowe.</li>
      <li>
        Logowanie się na Konto odbywa się poprzez podanie adresu E-mail i hasła
        ustanowionych w Formularzu rejestracji.
      </li>
      <li>
        Klient ma możliwość w każdej chwili, bez podania przyczyny i bez
        ponoszenia z tego tytułu jakichkolwiek opłat usunąć Konto poprzez
        wysłanie stosownego żądania do Sprzedawcy, w szczególności za
        pośrednictwem poczty elektronicznej lub pisemnie na adresy podane w § 3.
      </li>
    </ol>
    <h2>&#167; 7 Zasady składania zamówienia</h2>
    <ol>
      W celu złożenia Zamówienia należy:
      <li>zalogować się do Sklepu (opcjonalnie);</li>
      <li>
        wybrać Produkt będący przedmiotem Zamówienia, a następnie kliknąć
        przycisk „Do koszyka” (lub równoznaczny);
      </li>
      <li>
        zalogować się lub skorzystać z możliwości złożenia Zamówienia bez
        rejestracji;
      </li>
      <li>
        jeżeli wybrano możliwość złożenia Zamówienia bez rejestracji - wypełnić
        Formularz zamówienia poprzez wpisanie danych odbiorcy Zamówienia oraz
        adresu, na który ma nastąpić dostawa Produktu, wybrać rodzaj przesyłki
        (sposób dostarczenia Produktu), wpisać dane do faktury, jeśli są inne
        niż dane odbiorcy Zamówienia,
      </li>
      <li>kliknąć przycisk “Zamawiam i płacę” (lub równoznaczny);</li>
      <li>
        wybrać jeden z dostępnych sposobów płatności i w zależności od sposobu
        płatności, opłacić zamówienie w określonym terminie, z zastrzeżeniem § 8
        pkt 3.
      </li>
    </ol>
    <h2 id="shipping-and-payments">
      &#167; 8 Oferowane metody dostawy oraz płatności
    </h2>
    <ol>
      <li>
        Dostawa Produktu odbywa się za pośrednictwem zewnętrznej firmy –
        operatora pocztowego (np. firmy kurierskiej,  czy firmy realizującej
        odbiór w punkcie), wybranego przez Klienta w trakcie składania
        Zamówienia.
      </li>
      <li>
        Dostawa Produktu do Klienta jest odpłatna, chyba że Klient złożył
        Zamówienie z darmową dostawą, po spełnieniu kryteriów darmowej dostawy
        lub w czasie trwania Akcji Promocyjnej na darmową dostawę. Dostępne
        aktualnie koszty dostawy Produktu są wskazywane Klientowi przed
        złożeniem Zamówienia i zawarciem Umowy Sprzedaży.
      </li>
      <li>
        Z chwilą wydania przez Sprzedawcę Produktu przewoźnikowi, przechodzą na
        Klienta korzyści i ciężary związane z Produktem oraz niebezpieczeństwo
        przypadkowej utraty lub uszkodzenia Produktu. Sprzedawca w takim wypadku
        nie ponosi odpowiedzialności za utratę, ubytek lub uszkodzenie Produktu,
        powstałe od przyjęcia go do przewozu aż do wydania go Klientowi oraz za
        opóźnienie w przewozie przesyłki.
      </li>
      <li>
        Klient może skorzystać z następujących metod dostawy lub odbioru
        zamówionego Produktu:
        <ol class="alphanumeric-list">
          <li>InPost Paczkomaty 24/7,</li>
          <li>InPost Kurier,</li>
          <li>InPost Kurier - Pobranie</li>
        </ol>
      </li>
      <li>
        Klient może skorzystać z następujących metod płatności:
        <ol class="alphanumeric-list">
          <li>Płatność za pobraniem</li>
          <li>Płatności elektroniczne</li>
        </ol>
      </li>
      <li>
        Szczegółowe informacje na temat metod dostawy oraz akceptowalnych metod
        płatności znajdują się za stronach Sklepu.
      </li>
    </ol>
    <h2>&#167; 9 Wykonanie umowy sprzedaży</h2>
    <ol>
      <li>
        Zawarcie Umowy Sprzedaży między Klientem a Sprzedawcą następuje po
        uprzednim złożeniu przez Klienta Zamówienia za pomocą Formularza
        zamówienia w Sklepie internetowym zgodnie z § 7 Regulaminu.
      </li>
      <li>
        Po złożeniu Zamówienia Sprzedawca niezwłocznie potwierdza jego
        otrzymanie oraz jednocześnie przyjmuje Zamówienie do realizacji.
        Potwierdzenie otrzymania Zamówienia i jego przyjęcie do realizacji
        następuje poprzez przesłanie przez Sprzedawcę Klientowi stosownej
        wiadomości e-mail na podany w trakcie składania Zamówienia adres poczty
        elektronicznej Klienta, która zawiera co najmniej oświadczenia
        Sprzedawcy o otrzymaniu Zamówienia i o jego przyjęciu do realizacji oraz
        potwierdzenie zawarcia Umowy Sprzedaży. Z chwilą otrzymania przez
        Klienta powyższej wiadomości e-mail zostaje zawarta Umowa Sprzedaży
        między Klientem a Sprzedawcą.
      </li>
      <li>
        W przypadku wyboru przez Klienta:
        <ol class="alphanumeric-list">
          <li>
            płatności elektronicznych, Klient obowiązany jest do dokonania
            płatności w terminie 2 dni kalendarzowych od dnia zawarcia Umowy
            Sprzedaży - w przeciwnym razie zamówienie zostanie anulowane.
          </li>
          <li>
            płatności za pobraniem przy odbiorze przesyłki, Klient obowiązany
            jest do dokonania płatności przy odbiorze przesyłki.
          </li>
        </ol>
      </li>
      <li>
        Produkt zostanie wysłany przez Sprzedawcę w terminie wskazanym w jego
        opisie (z zastrzeżeniem ustępu 5 niniejszego paragrafu), w sposób
        wybrany przez Klienta podczas składania Zamówienia.
      </li>
      <li>
        W przypadku zamówienia Produktów o różnych terminach dostawy, terminem
        dostawy jest najdłuższy podany termin.
      </li>
      <li>
        Początek biegu terminu dostawy Produktu do Klienta liczy się w
        następujący sposób:
        <ol class="alphanumeric-list">
          <li>
            W przypadku wyboru przez Klienta sposobu płatności elektronicznych -
            od dnia uznania rachunku bankowego Sprzedawcy.
          </li>
          <li>
            W przypadku wyboru przez Klienta sposobu płatności za pobraniem – od
            dnia zawarcia Umowy Sprzedaży,
          </li>
        </ol>
      </li>
      <li>Dostawa Produktu odbywa się wyłącznie na terenie Polski.</li>
    </ol>
    <h2 id="withdrawal">&#167; 10 Prawo odstąpienia od umowy</h2>
    <ol>
      <li>
        Konsument może w terminie 14 dni odstąpić od Umowy Sprzedaży bez podania
        jakiejkolwiek przyczyny.
      </li>
      <li>
        Bieg terminu określonego w ust. 1 rozpoczyna się od dostarczenia
        Produktu Konsumentowi lub wskazanej przez niego osobie innej niż
        przewoźnik.
      </li>
      <li>
        W przypadku Umowy, która obejmuje wiele Produktów, które są dostarczane
        osobno, partiami lub w częściach, termin wskazany w ust. 1 biegnie od
        dostawy ostatniej rzeczy, partii lub części.
      </li>
      <li>
        Konsument może odstąpić od Umowy, składając Sprzedawcy oświadczenie o
        odstąpieniu od Umowy. Do zachowania terminu odstąpienia od Umowy
        wystarczy wysłanie przez Konsumenta oświadczenia przed upływem tego
        terminu.
      </li>
      <li>
        Oświadczenie może być wysłane za pomocą tradycyjnej poczty bądź drogą
        elektroniczną poprzez przesłanie oświadczenia na adres e-mail
        Sprzedawcy, dane kontaktowe Sprzedawcy zostały określone w § 3. Wzór
        dokumentu stanowi załącznik do ustawy z dnia 30 maja 2014 roku o prawach
        konsumenta.
      </li>
      <li>
        W przypadku przesłania oświadczenia przez Konsumenta drogą
        elektroniczną, Sprzedawca niezwłocznie prześle Konsumentowi na podany
        przez Konsumenta adres e-mail potwierdzenie otrzymania oświadczenia o
        odstąpieniu od Umowy.
      </li>
      <li>
        Skutki odstąpienia od Umowy:
        <ol class="alphanumeric-list">
          <li>
            W przypadku odstąpienia od Umowy zawartej na odległość Umowę uważa
            się za niezawartą.
          </li>
          <li>
            W przypadku odstąpienia od Umowy Sprzedawca zwraca Konsumentowi
            niezwłocznie, nie później niż w terminie 14 dni od dnia otrzymania
            oświadczenia Konsumenta o odstąpieniu od Umowy, wszystkie dokonane
            przez niego płatności, w tym koszty dostarczenia rzeczy, z wyjątkiem
            dodatkowych kosztów wynikających z wybranego przez Konsumenta
            sposobu dostarczenia innego niż najtańszy zwykły sposób dostarczenia
            oferowany przez Sprzedawcę.
          </li>
          <li>
            Zwrotu płatności Sprzedawca dokona przy użyciu takich samych metod
            płatności, jakie zostały przez Konsumenta użyte w pierwotnej
            transakcji, chyba że Konsument wyraźnie zgodził się na inne
            rozwiązanie, które nie będzie się wiązało dla niego z żadnymi
            kosztami.
          </li>
          <li>
            Sprzedawca może wstrzymać się ze zwrotem płatności do czasu
            otrzymania Produktu z powrotem lub do czasu dostarczenia mu dowodu
            jego odesłania, w zależności od tego, które zdarzenie nastąpi
            wcześniej.
          </li>
          <li>
            Konsument powinien odesłać Produkt na adres Sprzedawcy podany w
            niniejszym Regulaminie niezwłocznie, nie później niż 14 dni od dnia,
            w którym poinformował Sprzedawcę o odstąpieniu od Umowy. Termin
            zostanie zachowany, jeśli Konsument odeśle Produkt przed upływem
            terminu 14 dni.
          </li>
          <li>
            Konsument ponosi bezpośrednie koszty zwrotu Produktu, także koszty
            zwrotu Produktu, jeśli ze względu na swój charakter Produkt ten nie
            mógł zostać w zwykłym trybie odesłany pocztą.
          </li>
          <li>
            Konsument odpowiada tylko za zmniejszenie wartości Produktu
            wynikające z korzystania z niego w sposób inny niż było to konieczne
            do stwierdzenia charakteru, cech i funkcjonowania Produktu.
          </li>
        </ol>
      </li>
      <li>
        W przypadku gdy ze względu na charakter Produktu nie może on zostać
        odesłany w zwykłym trybie pocztą, informacja o tym, a także o kosztach
        zwrotu Produktu, będzie się znajdować w opisie Produktu w Sklepie.
      </li>
      <li>
        Prawo do odstąpienia od umowy zawartej na odległość nie przysługuje
        Konsumentowi w odniesieniu do Umowy:
        <ol class="alphanumeric-list">
          <li>
            w której przedmiotem świadczenia jest rzecz nieprefabrykowana,
            wyprodukowana według specyfikacji Konsumenta lub służąca
            zaspokojeniu jego zindywidualizowanych potrzeb,
          </li>
          <li>
            w której przedmiotem świadczenia jest rzecz dostarczana w
            zapieczętowanym opakowaniu, której po otwarciu opakowania nie można
            zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych,
            jeżeli opakowanie zostało otwarte po dostarczeniu,
          </li>
          <li>
            w które przedmiotem świadczenia jest rzecz ulegająca szybkiemu
            zepsuciu lub mająca krótki termin przydatności do użycia,
          </li>
          <li>
            o świadczenie usług, jeżeli Sprzedawca wykonał w pełni usługę za
            wyraźną zgodą Konsumenta, który został poinformowany przez
            rozpoczęciem świadczenia, że po spełnieniu świadczenia przez
            Sprzedawcę utraci prawo odstąpienia od Umowy,
          </li>
          <li>
            o dostarczenie treści cyfrowych, które nie są zapisane na nośniku
            materialnym, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną
            zgodą Konsumenta przed upływem terminu do odstąpienia od umowy i po
            poinformowaniu go przez Sprzedawcę o utracie prawa odstąpienia od
            Umowy,
          </li>
        </ol>
      </li>
    </ol>
    <h2>&#167; 11 Reklamacja i gwarancja</h2>
    <ol>
      <li>Umową Sprzedaży objęte są nowe Produkty.</li>
      <li>
        W przypadku wystąpienia wady zakupionego u Sprzedawcy towaru Klient ma
        prawo do reklamacji w oparciu o przepisy dotyczące rękojmi w kodeksie
        cywilnym.
      </li>
      <li>
        Reklamację należy zgłosić pisemnie lub drogą elektroniczną na podane w
        niniejszym Regulaminie adresy Sprzedawcy.
      </li>
      <li>
        Zaleca się, aby w reklamacji zawrzeć m.in. zwięzły opis wady,
        okoliczności (w tym datę) jej wystąpienia, dane Klienta składającego
        reklamację, oraz żądanie Klienta w związku z wadą towaru.
      </li>
      <li>
        Sprzedawca ustosunkuje się do żądania reklamacyjnego niezwłocznie, nie
        później niż w terminie 14 dni, a jeśli nie zrobi tego w tym terminie,
        uważa się, że żądanie Klienta uznał za uzasadnione.
      </li>
      <li>
        Towary odsyłane w ramach procedury reklamacyjnej należy wysyłać na adres
        podany w § 3 niniejszego Regulaminu.
      </li>
      <li>
        W przypadku, gdy na Produkt została udzielona gwarancja, informacja o
        niej, a także jej treść, będą zawarte przy opisie Produktu w Sklepie.
      </li>
    </ol>
    <h2>
      &#167; 12 Pozasądowe sposoby rozpatrywania reklamacji i dochodzenia
      roszczeń
    </h2>
    <ol>
      <li>
        Szczegółowe informacje dotyczące możliwości skorzystania przez
        Konsumenta z pozasądowych sposobów rozpatrywania reklamacji i
        dochodzenia roszczeń oraz zasady dostępu do tych procedur dostępne są w
        siedzibach oraz na stronach internetowych powiatowych (miejskich)
        rzeczników konsumentów, organizacji społecznych, do których zadań
        statutowych należy ochrona konsumentów, Wojewódzkich Inspektoratów
        Inspekcji Handlowej oraz pod następującymi adresami internetowymi Urzędu
        Ochrony Konkurencji i Konsumentów:
        <a href="http://www.uokik.gov.pl/spory_konsumenckie.php"
          >http://www.uokik.gov.pl/spory_konsumenckie.php</a
        >&nbsp;
        <a href="http://www.uokik.gov.pl/sprawy_indywidualne.php"
          >http://www.uokik.gov.pl/sprawy_indywidualne.php</a
        >
        oraz
        <a href="http://www.uokik.gov.pl/wazne_adresy.php"
          >http://www.uokik.gov.pl/wazne_adresy.php</a
        >.
      </li>
      <li>
        Konsument posiada następujące przykładowe możliwości skorzystania z
        pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń:
        <ol class="alphanumeric-list">
          <li>
            Konsument uprawniony jest do zwrócenia się do stałego polubownego
            sądu konsumenckiego, o którym mowa w art. 37 ustawy z dnia 15
            grudnia 2000 r. o Inspekcji Handlowej (Dz.U. z 2014 r. poz. 148 z
            późn. zm.), z wnioskiem o rozstrzygnięcie sporu wynikłego z Umowy
            zawartej ze Sprzedawcą.
          </li>
          <li>
            Konsument uprawniony jest do zwrócenia się do wojewódzkiego
            inspektora Inspekcji Handlowej, zgodnie z art. 36 ustawy z dnia 15
            grudnia 2000 r. o Inspekcji Handlowej (Dz.U. z 2014 r. poz. 148 z
            późn. zm.), z wnioskiem o wszczęcie postępowania mediacyjnego w
            sprawie polubownego zakończenia sporu między Konsumentem a
            Sprzedawcą.
          </li>
          <li>
            Konsument może uzyskać bezpłatną pomoc w sprawie rozstrzygnięcia
            sporu między nim a Sprzedawcą, korzystając także z bezpłatnej pomocy
            powiatowego (miejskiego) rzecznika konsumentów lub organizacji
            społecznej, do której zadań statutowych należy ochrona konsumentów
            (m.in. Federacja Konsumentów, Stowarzyszenie Konsumentów Polskich).
          </li>
        </ol>
      </li>
    </ol>
    <h2>&#167; 13 Dane osobowe w Sklepie Internetowym</h2>
    <ol>
      <li>
        Administratorem danych osobowych Klientów zbieranych za pośrednictwem
        Sklepu internetowego jest Sprzedawca.
      </li>
      <li>
        Dane osobowe Klientów zbierane przez administratora za pośrednictwem
        Sklepu internetowego zbierane są w celu realizacji Umowy Sprzedaży, a
        jeżeli Klient wyrazi na to zgodę - także w celu marketingowym.
      </li>
      <li>
        Odbiorcami danych osobowych Klientów Sklepu internetowego mogą być:
        <ol class="alphanumeric-list">
          <li>
            W przypadku Klienta, który korzysta w Sklepie internetowym ze
            sposobu dostawy przesyłką pocztową lub przesyłką kurierską,
            Administrator udostępnia zebrane dane osobowe Klienta wybranemu
            przewoźnikowi lub pośrednikowi realizującemu przesyłki na zlecenie
            Administratora.
          </li>
          <li>
            W przypadku Klienta, który korzysta w Sklepie internetowym ze
            sposobu płatności elektronicznych lub kartą płatniczą Administrator
            udostępnia zebrane dane osobowe Klienta, wybranemu podmiotowi
            obsługującemu powyższe płatności w Sklepie internetowym.
          </li>
        </ol>
      </li>
      <li>
        Klient ma prawo dostępu do treści swoich danych oraz ich poprawiania.
      </li>
      <li>
        Podanie danych osobowych jest dobrowolne, aczkolwiek niepodanie
        wskazanych w Regulaminie danych osobowych niezbędnych do zawarcia Umowy
        Sprzedaży skutkuje brakiem możliwości zawarcia tejże umowy.
      </li>
    </ol>
    <h2>&#167; 14 Postanowienia końcowe</h2>
    <ol>
      <li>Regulamin obowiązuje od dnia 15.11.2024r.</li>
      <li>
        Sprzedawca zastrzega sobie prawo do zmiany Regulaminu z ważnych przyczyn
        to jest: zmiany przepisów prawa, zmiany sposobów płatności i dostaw - w
        zakresie, w jakim te zmiany wpływają na realizację postanowień
        niniejszego Regulaminu. Zamówienia złożone przed wejściem w życie zmian,
        o których mowa w poprzednim zdaniu, będą realizowane na zasadach
        obowiązujących w momencie ich składania.
      </li>
      <li>
        Sprzedawca zastrzega sobie prawo do wprowadzenia ograniczeń w
        korzystaniu ze Sklepu internetowego spowodowanych jego serwisem
        technicznym, pracami konserwacyjnymi lub pracami nad polepszeniem jego
        funkcjonalności. Jednocześnie Sprzedawca zobowiązuje się do dołożenia
        wszelkich starań, by wspomniane przerwy odbywały się w godzinach nocnych
        i trwały jak najkrócej.
      </li>
      <li>
        Umowy zawierane poprzez Sklep internetowy zawierane są w języku polskim.
      </li>
      <li>
        W sprawach nieuregulowanych w niniejszym Regulaminie mają zastosowanie
        powszechnie obowiązujące przepisy prawa polskiego, w szczególności:
        Kodeksu cywilnego; ustawy o świadczeniu usług drogą elektroniczną;
        ustawy o prawach konsumenta, ustawy o ochronie danych osobowych.
      </li>
      <li>
        Klient ma prawo skorzystać z pozasądowych sposobów rozpatrywania
        reklamacji i dochodzenia roszczeń. W tym celu może złożyć skargę za
        pośrednictwem unijnej platformy internetowej ODR dostępnej pod adresem:
        <a href="http://ec.europa.eu/consumers/odr/"
          >http://ec.europa.eu/consumers/odr/</a
        >.
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.terms-of-service-wrapper {
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
}
</style>
