// Ülesanne 15 - suurim arv massiivis
function suurim(numbers) {
    let max = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] > max) {
        max = numbers[i];
      }
    }
    return max;
  }
  
  let numbers = [4, 1, 7, 3, 9, 2, 6];
  
  console.log("Suurim arv on:", suurim(numbers));
  
  // Ülesanne 16 - Temperatuuri teisendamine Celsiusest Fahrenheitiks
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }
  
  let celsius = 25;
  console.log(`${celsius}°C on ${celsiusToFahrenheit(celsius)}°F`);
  
  // Ülesanne 17 - Korrutustabel
function korrutustabel(number) {
    for (let i = 1; i <= 10; i++) {
      console.log(`${number} * ${i} = ${number * i}`);
    }
  }
  
  korrutustabel(5);

  // Ülesanne 18 - Faktoriaali arvutamine
function faktoriaal(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  }
  
  console.log(faktoriaal(5)); // peaks väljastama 120, kuna 5! = 5 * 4 * 3 * 2 * 1

  // Ülesanne 19 - Tähtede muster
function tahedMuster(n) {
    for (let i = 1; i <= n; i++) {
      console.log('*'.repeat(i));
    }
  }
  
  tahedMuster(5);

  // Ülesanne 20 - Algarvu kontroll (poolik, kasutab algarvude leidmise reeglit, mis netist leidsin)
  function onAlgarv(number) {

    // Kontrolli, kas number lõppeb 0, 2, 4, 6, 8 või 5-ga (välja arvatud 5 ise)
    if (number % 10 === 0 || number % 10 === 5 || number % 2 === 0) {
      return false;
    }
  
    // Kontrolli, kas numbrite summa on jagatav 3-ga
    let summa = 0;
    let tempNumber = number;
    while (tempNumber > 0) {
      summa += tempNumber % 10;
      tempNumber = Math.floor(tempNumber / 10);
    }
  
    if (summa % 3 === 0 && number !== 3) {
      return false;
    }
  
    // Kontrolli jaguvust algarvudega kuni arvu ruutjuureni
    const ruutjuur = Math.sqrt(number);
    for (let i = 2; i <= ruutjuur; i++) {
      if (number % i === 0) {
        return false;
      }
    }
  
    // Kui ükski kontroll ei eitanud algarvulikkust, on arv algarv
    return number > 1;
  }
  
  
  // Testimine
  console.log(onAlgarv(29)); // peaks väljastama true, kuna 29 on algarv
  console.log(onAlgarv(49)); // peaks väljastama false, kuna 49 ei ole algarv
  