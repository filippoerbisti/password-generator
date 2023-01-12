import Head from 'next/head'
import Script from 'next/script'

export default function Home() {

  if(typeof document != "undefined"){
    const sliderProps = {
      fill: "#0B1EDF",
      background: "rgba(255, 255, 255, 0.214)",
    };

    const slider = document.querySelector(".range__slider");
    const sliderValue = document.querySelector(".length__title");

    slider.querySelector("input").addEventListener("input", event => {
      sliderValue.setAttribute("data-length", event.target.value);
      applyFill(event.target);
    });

    applyFill(slider.querySelector("input"));

    function applyFill(slider) {
      const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
      const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
          0.1}%)`;
      slider.style.background = bg;
      sliderValue.setAttribute("data-length", slider.value);
    }

    const randomFunc = {
      lower: getRandomLower,
      upper: getRandomUpper,
      number: getRandomNumber,
      symbol: getRandomSymbol,
    };

    function secureMathRandom() {
      return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
    }

    // Generator Functions
    // All the functions that are responsible to return a random value taht we will use to create password.
    function getRandomLower() {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    function getRandomUpper() {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    function getRandomNumber() {
      return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
    }
    function getRandomSymbol() {
      const symbols = '~!@#$%^&*()_+{}":?><;.,';
      return symbols[Math.floor(Math.random() * symbols.length)];
    }

    const resultEl = document.getElementById("result");
    const lengthEl = document.getElementById("slider");

    const uppercaseEl = document.getElementById("uppercase");
    const lowercaseEl = document.getElementById("lowercase");
    const numberEl = document.getElementById("number");
    const symbolEl = document.getElementById("symbol");

    const generateBtn = document.getElementById("generate");
    const copyBtn = document.getElementById("copy-btn");
    const resultContainer = document.querySelector(".result");
    const copyInfo = document.querySelector(".result__info.right");
    const copiedInfo = document.querySelector(".result__info.left");

    let generatedPassword = false;

    let resultContainerBound = {
      left: resultContainer.getBoundingClientRect().left,
      top: resultContainer.getBoundingClientRect().top,
    };

    window.addEventListener("resize", e => {
      resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
      };
    });

    // Copy Password in clipboard
    resultContainer.addEventListener("click", () => {
      const textarea = document.createElement("textarea");
      const password = resultEl.innerText;
      if (!password || password == "CLICK GENERATE") {
        return;
      }
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();

      copyInfo.style.transform = "translateY(200%)";
      copyInfo.style.opacity = "0";
      copiedInfo.style.transform = "translateY(0%)";
      copiedInfo.style.opacity = "0.75";
    });

    generateBtn.addEventListener("click", () => {
      const length = +lengthEl.value;
      const hasLower = lowercaseEl.checked;
      const hasUpper = uppercaseEl.checked;
      const hasNumber = numberEl.checked;
      const hasSymbol = symbolEl.checked;
      generatedPassword = true;
      resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
      copyInfo.style.transform = "translateY(0%)";
      copyInfo.style.opacity = "0.75";
      copiedInfo.style.transform = "translateY(200%)";
      copiedInfo.style.opacity = "0";
    });

    function generatePassword(length, lower, upper, number, symbol) {
      let generatedPassword = "";
      const typesCount = lower + upper + number + symbol;
      const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
      if (typesCount === 0) {
        return "";
      }
      for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
          const funcName = Object.keys(type)[0];
          generatedPassword += randomFunc[funcName]();
        });
      }
      return generatedPassword.slice(0, length)
                      .split('').sort(() => Math.random() - 0.5)
                      .join('');
    }

    function disableOnlyCheckbox(){
      let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
      totalChecked.forEach(el => {
        if(totalChecked.length == 1){
          el.disabled = true;
        }else{
          el.disabled = false;
        }
      })
    }

    [uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
      el.addEventListener('click', () => {
        disableOnlyCheckbox()
      })
    })
  }

  return (
    <>
      <Head>
        <title>Password Generator</title>
        <meta name="description" content="Password Generator powered by Filippo Erbisti" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" crossOrigin='anonymous' />
      <Script src="https://fonts.googleapis.com/css?family=Montserrat&amp;display=swap" crossOrigin='anonymous' />
    
      <main>
        <div className="container">
          <h2 className="title">Password Generator</h2>
          <div className="result">
            <div className="result__title field-title">Generated Password</div>
            <div className="result__info right">click to copy</div>
            <div className="result__info left">copied</div>
            <div className="result__viewbox" id="result">CLICK GENERATE</div>
          </div>
          <div className="length range__slider" data-min="4" data-max="32">
            <div className="length__title field-title" data-length='0'>length:</div>
            <input id="slider" type="range" min="4" max="32" defaultValue={16} />
          </div>

          <div className="settings">
            <span className="settings__title field-title">settings</span>
            <div className="setting">
              <input type="checkbox" id="uppercase" defaultChecked />
              <label htmlFor="uppercase">Include Uppercase</label>
            </div>
            <div className="setting">
              <input type="checkbox" id="lowercase" defaultChecked />
              <label htmlFor="lowercase">Include Lowercase</label>
            </div>
            <div className="setting">
              <input type="checkbox" id="number" defaultChecked />
              <label htmlFor="number">Include Numbers</label>
            </div>
            <div className="setting">
              <input type="checkbox" id="symbol" />
              <label htmlFor="symbol">Include Symbols</label>
            </div>
          </div>

          <button className="btn generate" id="generate">Generate Password</button>
        </div>
      </main>
    </>
  )
}
