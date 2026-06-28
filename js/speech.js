// speech.js — Norwegian TTS voice selection and speaking helpers.
    let norwegianVoice=null,speechSeq=0,segmentTimer=null;
    function isNorwegianVoice(voice){
      const lang=String(voice.lang||"").toLowerCase();
      const name=String(voice.name||"").toLowerCase();
      return lang==="nb-no"||lang==="no-no"||lang==="nn-no"||lang.startsWith("nb")||lang.startsWith("no")||lang.startsWith("nn")||name.includes("norsk")||name.includes("norwegian")||name.includes("nora");
    }
    function loadNorwegianVoice(){
      if(!("speechSynthesis" in window))return null;
      const voices=window.speechSynthesis.getVoices?.()||[];
      norwegianVoice=voices.find(v=>String(v.lang||"").toLowerCase()==="nb-no")||voices.find(v=>String(v.lang||"").toLowerCase()==="no-no")||voices.find(isNorwegianVoice)||null;
      return norwegianVoice;
    }
    if("speechSynthesis" in window){
      loadNorwegianVoice();
      window.speechSynthesis.onvoiceschanged=()=>{loadNorwegianVoice();updateTtsHint()};
      setInterval(()=>{try{if(window.speechSynthesis.speaking)window.speechSynthesis.resume()}catch{}},6000);
    }
    function speakPayload(payload,remember=true){if(!payload)return;if(remember)lastSpeechPayload=payload;if(!state.sound||!("speechSynthesis" in window))return;const seq=++speechSeq;if(segmentTimer){clearTimeout(segmentTimer);segmentTimer=null}window.speechSynthesis.cancel();loadNorwegianVoice();if(payload.segments?.length){speakSegments(payload.segments,payload,seq);return}speakOne(payload.text||"",payload)}
    function speakOne(text,opts={},onDone){if(!text)return;const utter=new SpeechSynthesisUtterance(text);utter.lang="nb-NO";const voice=loadNorwegianVoice();if(voice){utter.voice=voice;utter.lang=voice.lang||"nb-NO"}utter.rate=opts.rate||0.82;utter.pitch=opts.pitch||1.08;utter.onstart=()=>{if(opts.onStart)opts.onStart()};utter.onend=()=>{if(onDone)onDone()};window.speechSynthesis.speak(utter)}
    // Per-segment callbacks let a caller sync visuals to real speech timing:
    // onSegmentStart(i) fires when segment i actually begins speaking (via the
    // utterance's onstart), onSegmentsDone() fires after the last one ends.
    function speakSegments(segments,opts={},seq=speechSeq){let index=0;const next=()=>{if(seq!==speechSeq)return;if(index>=segments.length){if(opts.onSegmentsDone)opts.onSegmentsDone();return}const i=index++;if(opts.onSegmentStart)opts.onStart=()=>{if(seq===speechSeq)opts.onSegmentStart(i)};speakOne(segments[i],opts,()=>{if(seq!==speechSeq)return;segmentTimer=window.setTimeout(next,opts.pause??280)})};next()}
    function letterSoundSegment(letter){const ch=normalizeSpellingWord(letter)[0]||"";return ch?(LETTER_SOUND_TEXT[ch]||ch.toLowerCase()):""}
    function speakLetterSound(letter){const ch=normalizeSpellingWord(letter)[0]||"";if(!ch)return;speakPayload({text:letterSoundSegment(ch),rate:.7,pitch:1.08},false)}
