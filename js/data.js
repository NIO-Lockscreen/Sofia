// data.js — word/mode data, constants and pure helpers (loaded first).
    const WORDS=[
      {id:"sol",word:"sol",emoji:"☀️",letter:"s",sound:"sol"},
      {id:"bil",word:"bil",emoji:"🚗",letter:"b",sound:"bil"},
      {id:"hus",word:"hus",emoji:"🏠",letter:"h",sound:"hus"},
      {id:"mus",word:"mus",emoji:"🐭",letter:"m",sound:"mus"},
      {id:"mat",word:"mat",emoji:"🍽️",letter:"m",sound:"mat",noEmojiWord:true},
      {id:"bok",word:"bok",emoji:"📘",letter:"b",sound:"bok"},
      {id:"tog",word:"tog",emoji:"🚆",letter:"t",sound:"tog"},
      {id:"sko",word:"sko",emoji:"👟",letter:"s",sound:"sko"},
      {id:"båt",word:"båt",emoji:"⛵",letter:"b",sound:"båt"},
      {id:"ape",word:"ape",emoji:"🐒",letter:"a",sound:"ape"},
      {id:"and",word:"and",emoji:"🦆",letter:"a",sound:"and"},
      {id:"katt",word:"katt",emoji:"🐱",letter:"k",sound:"katt"},
      {id:"lam",word:"lam",emoji:"🐑",letter:"l",sound:"lam"},
      {id:"rev",word:"rev",emoji:"🦊",letter:"r",sound:"rev"},
      {id:"egg",word:"egg",emoji:"🥚",letter:"e",sound:"egg"},
      {id:"nål",word:"nål",emoji:"🪡",letter:"n",sound:"nål"},
      {id:"ost",word:"ost",emoji:"🧀",letter:"o",sound:"ost"},
      {id:"ull",word:"ull",emoji:"🧶",letter:"u",sound:"ull",noEmojiWord:true},
      {id:"boble",word:"boble",emoji:"🫧",letter:"b",sound:"boble"},
      {id:"bamse",word:"bamse",emoji:"🧸",letter:"b",sound:"bamse"},
      {id:"ball",word:"ball",emoji:"⚽",letter:"b",sound:"ball"},
      {id:"ku",word:"ku",emoji:"🐄",letter:"k",sound:"ku"},
      {id:"mormor",word:"mormor",emoji:"👵",letter:"m",sound:"mormor",noEmojiWord:true},
      {id:"vann",word:"vann",emoji:"💧",letter:"v",sound:"vann",noEmojiWord:true},
      {id:"hest",word:"hest",emoji:"🐴",letter:"h",sound:"hest"},
      {id:"robot",word:"robot",emoji:"🤖",letter:"r",sound:"robot"},
      {id:"sterk",word:"sterk",emoji:"💪",letter:"s",sound:"sterk",noEmojiWord:true},
      {id:"gris",word:"gris",emoji:"🐷",letter:"g",sound:"gris"},
      {id:"bæsj",word:"bæsj",emoji:"💩",letter:"b",sound:"bæsj"},
      {id:"fisk",word:"fisk",emoji:"🐟",letter:"f",sound:"fisk"},
      {id:"is",word:"is",emoji:"🍦",letter:"i",sound:"is"},
      {id:"dør",word:"dør",emoji:"🚪",letter:"d",sound:"dør"},
      {id:"jul",word:"jul",emoji:"🎄",letter:"j",sound:"jul",noEmojiWord:true},
      {id:"øye",word:"øye",emoji:"👁️",letter:"ø",sound:"øye"},
      {id:"fly",word:"fly",emoji:"✈️",letter:"f",sound:"fly"},
      {id:"eple",word:"eple",emoji:"🍎",letter:"e",sound:"eple"},
      {id:"sky",word:"sky",emoji:"☁️",letter:"s",sound:"sky"},
      {id:"løve",word:"løve",emoji:"🦁",letter:"l",sound:"løve"},
      {id:"ulv",word:"ulv",emoji:"🐺",letter:"u",sound:"ulv"}
    ];
    const NAMES=["THOMAS","SOFIA","THERESE","ANNE","ELISABETH"];
    const SPELLING_ONLY_WORDS=NAMES;
    function isName(word){return NAMES.includes((word||"").toUpperCase())}
    const MODES=[
      {id:"emojiWord",emoji:"🐱 ❓",title:"Emoji ordvalg",desc:"Finn riktig ord til emojien",helper:"Trykk på emojien for å høre hva den heter."},
      {id:"word",emoji:"☀️ sol",title:"Bilde + ord",desc:"Koble bilde til ord",helper:"Finn bildet som passer til ordet."},
      {id:"letter",emoji:"s",title:"Første lyd",desc:"Bilde/ord + startbokstav",helper:"Finn bokstaven ordet starter med."},
      {id:"blend",emoji:"s‑o‑l 📖",title:"Les ordet",desc:"Lyd bokstavene sammen",helper:"Trykk hver bokstav, lyd dem sammen, og velg riktig bilde."},
      {id:"spell",emoji:"A B C",title:"Stavelek",desc:"Bygg ord med bokstaver",helper:"Trykk bokstavene i riktig rekkefølge."},
      {id:"emojiSpell",emoji:"☀️ _ _ _",title:"Emoji-staving",desc:"Emoji + tomme felt",helper:"Se på emojien og stav ordet."}
    ];
    const defaultState={mode:"word",pairs:3,sound:true,easyMode:true,uppercase:true,rounds:0,childName:"",onboarded:false,spellingDifficulty:3,spellingWord:"SOL",emojiSpellingWord:"SOL",spellingWords:[...SPELLING_ONLY_WORDS,...WORDS.map(w=>displayWord(w.word))],deletedSpellingWords:[],spellingStreak:0,spellingBestStreak:0,emojiSpellingQueue:[],spellingWordQueue:[],emojiWordQueue:[],emojiWordDistractors:3,emojiWordStreak:0,spellingPraiseAt:0,emojiWordPraiseAt:0,blendStreak:0,blendPraiseAt:0,blendQueue:[],blendDistractors:2};
    const storageKey="miniMemoryLearningState_v9";
    const legacyStateKeyRe=/^miniMemoryLearningState_v(\d+)$/;
    function shuffle(list){const copy=[...list];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
    function displayWord(word){return String(word).toUpperCase()}
    function showWord(word){const s=String(word||"");if(state.uppercase!==false)return s.toUpperCase();return s.length?s[0].toUpperCase()+s.slice(1).toLowerCase():s}
    function cleanWordList(list){return Array.from(new Set((Array.isArray(list)?list:[]).map(normalizeSpellingWord).filter(Boolean)))}
    const SPELL_ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ".split("");
    const LETTER_SOUND_TEXT={A:"a",B:"b",C:"s",D:"d",E:"e",F:"f",G:"g",H:"h",I:"i",J:"j",K:"k",L:"l",M:"m",N:"n",O:"o",P:"p",Q:"k",R:"r",S:"s",T:"t",U:"u",V:"v",W:"v",X:"ks",Y:"y",Z:"s",Æ:"æ",Ø:"ø",Å:"å"};
    function normalizeSpellingWord(word){return displayWord(String(word||"").trim().replace(/\s+/g,"").replace(/[^A-ZÆØÅ]/gi,""))}
