document.addEventListener('DOMContentLoaded', () => {
  // vars
  let delayToConvert = 750;
  let _delayToConvert;
  let rulesNbsp = [];
  let rulesNobr = [];
  const mainInput = document.querySelector('#source .texts-item__input');
  const mainOutput = document.querySelector('#result .texts-item__input');
  const mainOutputHTML = document.querySelector('#resultHTML .texts-item__input');
  const mainPreview = document.querySelector('#breakdown .texts-item__input');

  const rulesListNbsp = document.querySelector('#nbsp-list');
  const rulesListNobr = document.querySelector('#nobr-list');

  let standardRulesNbsp = [
      // cyrilic
      'и',
      'с',
      'а',
      'к',
      'в',
      'у',
      'о',
      'за',
      'не',
      'то',
      'на',
      'от',
      'до',
      'по',
      'при',
      'про',
      'для',
      'как',
      'где',
      'кто',
      'что',
      'это',
      'чем',
      'так',
      

      // eng
      'at',
      'on',
      'a',
      'the',
      'at',
  ];
  let standardRulesNobr = [
    // cyrilic
    'т.д.',
    'т.е.',
    'т.к.',
    'т.п.',
    'всегда ли',
    'прежде всего',
    'если же',
    'тем более',
  ];
  
  loadFromStorage();
  function loadFromStorage() {
    rulesNbsp = JSON.parse(localStorage.getItem('rulesNbspStored'));
    rulesNobr = JSON.parse(localStorage.getItem('rulesNobrStored'));


    if (rulesNbsp === null) {
      rulesNbsp = [];
    };
    if (rulesNobr === null) {
      rulesNobr = [];
    };

    console.log('loaded rules from LocalStorage:')
    console.log(rulesNbsp)
    console.log(rulesNobr)
  };

  // no rules
  if (rulesNbsp.length === 0 && rulesNobr.length === 0) {
    console.log('No rules loaded. Loading defaults...')
    rulesNbsp = standardRulesNbsp;
    rulesNobr = standardRulesNobr;
  };

  renderItemsFromLocalStorage();
  function renderItemsFromLocalStorage() {
    rulesListNbsp.innerHTML = '';
    rulesListNobr.innerHTML = '';

    rulesNbsp.forEach(function(rulesNbspElement, index) {
      const btn = document.createElement('button');
      btn.classList.add('rules-update-item__list-item');
      btn.setAttribute('data-array-pos', index);
      btn.setAttribute('title', 'Удалить');
      btn.innerText = `${rulesNbspElement}`;

      btn.addEventListener('click', () => {
        deleteRule(index, 'Nbsp');
      });

      rulesListNbsp.append(btn);
    });

    rulesNobr.forEach(function(rulesNobrElement, index) {
      const btn = document.createElement('button');
      btn.classList.add('rules-update-item__list-item');
      btn.setAttribute('data-array-pos', index);
      btn.setAttribute('title', 'Удалить');
      btn.innerText = `${rulesNobrElement}`;

      btn.addEventListener('click', () => {
        deleteRule(index, 'Nobr');
      });

      rulesListNobr.append(btn);
    });
    
    convert();
  };

  function addRule(text, listName) {
    if (listName == 'Nbsp') {
      rulesNbsp.push(text);
    };
    if (listName == 'Nobr') {
      rulesNobr.push(text);
    };
    updateLocalStorage();
    renderItemsFromLocalStorage();
  };

  function deleteRule(positionInArray, listName) {
    if (listName == 'Nbsp') {
      rulesNbsp.splice(positionInArray, 1);
    };
    if (listName == 'Nobr') {
      rulesNobr.splice(positionInArray, 1);
    };
    updateLocalStorage();
  };

  function updateLocalStorage() {
    localStorage.setItem('rulesNbspStored', JSON.stringify(rulesNbsp));
    localStorage.setItem('rulesNobrStored', JSON.stringify(rulesNobr));
    renderItemsFromLocalStorage();
  };

  jsForm();
  function jsForm() {
    const nbspInput = document.querySelector('#rule-add-nbsp');
    const nbspSubmit = document.querySelector('#add-rule-nbsp');

    nbspSubmit.addEventListener('click', () => {
      if(nbspInput.value !== '') {
        addRule(`${nbspInput.value}`, 'Nbsp')
      };
    });

    const nobrInput = document.querySelector('#rule-add-nobr');
    const nobrSubmit = document.querySelector('#add-rule-nobr');

    nobrSubmit.addEventListener('click', () => {
      if(nobrInput.value !== '') {
        addRule(`${nobrInput.value}`, 'Nobr')
      };
    });
  };

  // convert func
  mainInput.addEventListener('input', () => {
    clearTimeout(_delayToConvert);
    _delayToConvert = setTimeout(convert, delayToConvert);
  });
  convert();
  function convert() {
    const originalText = mainInput.value;

    let newText = originalText;
    let newTextHTML = originalText;
    let previewText = originalText;

    // nbsp
    if (rulesNbsp.length !== 0) {
      placeNbsp();
      function placeNbsp() {
        rulesNbsp.forEach(rulesNbspRule => {
          // as is
          while(newTextHTML.includes(` ${rulesNbspRule} `)) {
            // new copy
            newText = newText.replace(` ${rulesNbspRule} `, ` ${rulesNbspRule} `);
            // new HTML copy
            newTextHTML = newTextHTML.replace(` ${rulesNbspRule} `, ` ${rulesNbspRule}&nbsp;`);
            // preview copy
            previewText = previewText.replace(` ${rulesNbspRule} `, ` ${rulesNbspRule}<span class="nbsp"></span>`);
          };

          // capital
          let rulesNbspRule2 = rulesNbspRule.charAt(0).toUpperCase();
          while(newTextHTML.includes(` ${rulesNbspRule2} `)) {
            newText = newText.replace(` ${rulesNbspRule2} `, ` ${rulesNbspRule2} `);
            newTextHTML = newTextHTML.replace(` ${rulesNbspRule2} `, ` ${rulesNbspRule2}&nbsp;`);
            previewText = previewText.replace(` ${rulesNbspRule2} `, ` ${rulesNbspRule2}<span class="nbsp"></span> `);
          };
        });
        mainOutput.value = newText;
        mainPreview.innerHTML = previewText;
      };
    };

    // nobr
    if (rulesNobr.length !== 0) {
      placeNobr();
      function placeNobr() {
        rulesNobr.forEach(rulesNobrRule => {
          // as is
          while(newTextHTML.includes(` ${rulesNobrRule} `)) {
            newTextHTML = newTextHTML.replace(` ${rulesNobrRule} `, ` <nobr>${rulesNobrRule}</nobr> `);
            previewText = previewText.replace(` ${rulesNobrRule} `, ` <span class="nobr">${rulesNobrRule}</span> `);
          };

          // capital
          let rulesNobrRule2 = rulesNobrRule.charAt(0).toUpperCase() + rulesNobrRule.slice(1);
          while(newTextHTML.includes(` ${rulesNobrRule2} `)) {
            newTextHTML = newTextHTML.replace(` ${rulesNobrRule2} `, ` <nobr>${rulesNobrRule2}</nobr> `);
            previewText = previewText.replace(` ${rulesNobrRule2} `, ` <span class="nobr">${rulesNobrRule2}</span> `);
          };
        });
        mainOutput.value = newText;
        mainOutputHTML.value = newTextHTML;
        mainPreview.innerHTML = previewText;
      };
    };
  };

  // share resize
  shareResize();
  function shareResize() {
    mainInput.addEventListener('mouseup', () => {
      mainOutput.style.height = mainInput.style.height;
      mainOutputHTML.style.height = mainInput.style.height;
    });
    mainOutput.style.height = mainInput.style.height;
    mainOutputHTML.style.height = mainInput.style.height;
  };

  // reset btn
  const resetBtn = document.querySelector('.reset-btn');
  resetBtn.addEventListener('click', () => {
    confirm('Сбросить правила?');
    rulesNbsp = standardRulesNbsp;
    rulesNobr = standardRulesNobr;
    updateLocalStorage();
    renderItemsFromLocalStorage();
  });
});