
// -----------------------------------------------------------------------------
// ----------------------------- Add Controller --------------------------------
// -----------------------------------------------------------------------------
VestaxVCI100 = new function() {}

VestaxVCI100.group = "[Master]";
VestaxVCI100.loopHotcueDeck = null;
VestaxVCI100.shiftMode = false;
VestaxVCI100.preview = false;
VestaxVCI100.jogPlaylistScrollMode = false;
VestaxVCI100.beatloopSizes = [0.5, 1, 2, 4];
VestaxVCI100.beatloopModifier = 2;
VestaxVCI100.beatloopMinMax = {"min": 0.125, "max": 32};
VestaxVCI100.microphonesActive = [];
VestaxVCI100.effectsActive = [];
VestaxVCI100.Buttons = {};

VestaxVCI100.ButtonState = {"released":0x00, "pressed":0x7F};
VestaxVCI100.Button = function (controlId) {
  this.controlId = controlId;
  this.state = VestaxVCI100.ButtonState.released;
  this.handler = null
}
VestaxVCI100.Button.prototype.handleEvent = function(value) {
  this.handler(value);
}

VestaxVCI100.addButton = function(buttonName, button, eventHandler) {
  if(eventHandler) {
    var executionEnvironment = this;
    function handler(value) {
        button.state = value;
        executionEnvironment[eventHandler](value);
    }
    button.handler = handler;
  }
  this.Buttons[buttonName] = button; 
}

// -----------------------------------------------------------------------------
// --------------------------- Lighting functions ------------------------------
// -----------------------------------------------------------------------------
function setLoopHotcueLighting(value) {
  midi.sendShortMsg(0x90, 0x65, 0x00);
  if (value.includes(1)) midi.sendShortMsg(0x90, 0x65, 0x7F);

  midi.sendShortMsg(0x90, 0x66, 0x00);
  if (value.includes(2)) midi.sendShortMsg(0x90, 0x66, 0x7F);

  midi.sendShortMsg(0x90, 0x67, 0x00);
  if (value.includes(3)) midi.sendShortMsg(0x90, 0x67, 0x7F);
  
  midi.sendShortMsg(0x90, 0x68, 0x00);
  if (value.includes(4)) midi.sendShortMsg(0x90, 0x68, 0x7F);
}

function setLoopHotcueButtonLighting(value) {
  midi.sendShortMsg(0x90, 0x62, 0x00);
  if (value.includes(1)) midi.sendShortMsg(0x90, 0x62, 0x7F);

  midi.sendShortMsg(0x90, 0x63, 0x00);
  if (value.includes(2)) midi.sendShortMsg(0x90, 0x63, 0x7F);

  midi.sendShortMsg(0x90, 0x64, 0x00);
  if (value.includes(3)) midi.sendShortMsg(0x90, 0x64, 0x7F);
}

function setLoopSwitchLighting(value) {
  midi.sendShortMsg(0x90, 0x42, 0x00);
  if (value.includes(1)) midi.sendShortMsg(0x90, 0x42, 0x7F);
  
  midi.sendShortMsg(0x90, 0x43, 0x00);
  if (value.includes(2)) midi.sendShortMsg(0x90, 0x43, 0x7F);
}

function setHotcueSwitchLighting(value) {
  midi.sendShortMsg(0x90, 0x44, 0x00);
  if (value.includes(1)) midi.sendShortMsg(0x90, 0x44, 0x7F);
  
  midi.sendShortMsg(0x90, 0x45, 0x00);
  if (value.includes(2)) midi.sendShortMsg(0x90, 0x45, 0x7F);
}

function setLibrarySwitchLighting(value) {
  midi.sendShortMsg(0x90, 0x5C, 0x00);
  if (value.includes(1)) midi.sendShortMsg(0x90, 0x5C, 0x7F);
  
  midi.sendShortMsg(0x90, 0x5D, 0x00);
  if (value.includes(2)) midi.sendShortMsg(0x90, 0x5D, 0x7F);
  
  // Only one thats working atm
  midi.sendShortMsg(0x90, 0x5F, 0x00);
  if (value.includes(3)) midi.sendShortMsg(0x90, 0x5F, 0x7F);
  
  midi.sendShortMsg(0x90, 0x60, 0x00);
  if (value.includes(4)) midi.sendShortMsg(0x90, 0x60, 0x7F);
  
  midi.sendShortMsg(0x90, 0x61, 0x00);
  if (value.includes(5)) midi.sendShortMsg(0x90, 0x61, 0x7F);
}

function setEffectSwitchLighting(value) {
  // Remember: 4th effect key will turn on depending on channel A/B/mas.

  midi.sendShortMsg(0x90, 0x4A, 0x00);
  if (value.includes(1)) midi.sendShortMsg(0x90, 0x4A, 0x7F);
  
  midi.sendShortMsg(0x90, 0x4B, 0x00);
  if (value.includes(2)) midi.sendShortMsg(0x90, 0x4B, 0x7F);
  
  midi.sendShortMsg(0x90, 0x4C, 0x00);
  if (value.includes(3)) midi.sendShortMsg(0x90, 0x4C, 0x7F);
}

function setHeadphoneSwitchLighting(value) {
  midi.sendShortMsg(0x90, 0x48, 0x00);
  if (value.includes(1)) midi.sendShortMsg(0x90, 0x48, 0x7F);
  
  midi.sendShortMsg(0x90, 0x49, 0x00);
  if (value.includes(2)) midi.sendShortMsg(0x90, 0x49, 0x7F);

  //midi.sendShortMsg(0x90, 0x48, 0xFE);
}

function setBeatloopButtonStateLighting(deck) {
  function setBeatloopButtonLighting(deck) {
    let buttonsActive = [];
    if (deck.beatloopActive) buttonsActive.push(1);
    if (deck.beatloopOverSize) buttonsActive.push(2);
    if (deck.beatloopUnderSize) buttonsActive.push(3);
    setLoopHotcueButtonLighting(buttonsActive);
  }

  if (deck.beatloopSize < VestaxVCI100.beatloopSizes[0]) {
    deck.beatloopOverSize = false;
    deck.beatloopUnderSize = true;
    setBeatloopButtonLighting(deck);
  } else if (deck.beatloopSize > VestaxVCI100.beatloopSizes[VestaxVCI100.beatloopSizes.length - 1]) {
    deck.beatloopOverSize = true;
    deck.beatloopUnderSize = false;
    setBeatloopButtonLighting(deck);
  } else {
    deck.beatloopOverSize = false;
    deck.beatloopUnderSize = false;
    setBeatloopButtonLighting(deck);
  }
}

function setBeatloopSizeLighting(deck, modifier) {
  deck.beatloopSize *= modifier;
  let indexBeatloop = VestaxVCI100.beatloopSizes.indexOf(deck.beatloopSize);

  setBeatloopButtonStateLighting(deck);

  if (indexBeatloop != -1) {
    setLoopHotcueLighting([VestaxVCI100.beatloopSizes.length - indexBeatloop]);
  } else {
    setLoopHotcueLighting([]);
  }
}

// TODO
function setHotcueLighting(deck) {
  let buttonsActive = deck.hotcuesActive;

  if (deck.hotcueActive) buttonsActive.push(1);
  setLoopHotcueButtonLighting(buttonsActive);
}

function setBeatloopLighting(deck) {
  let indexBeatLoop = VestaxVCI100.beatloopSizes.indexOf(deck.beatloopSize);

  if (indexBeatLoop != -1) {
    setLoopHotcueLighting([VestaxVCI100.beatloopSizes.length - indexBeatLoop]);
  } else {
    setLoopHotcueLighting([]);
  }
}

function setPreviewButtonLighting(deck) {
  if (getPlay(deck)) {
    setLibrarySwitchLighting([3]);
    setLoopHotcueButtonLighting([3]);
  } else {
    setLibrarySwitchLighting([]);
    setLoopHotcueButtonLighting([]);
  }
}

// -----------------------------------------------------------------------------
// --------------------------- Software Variables ------------------------------
// -----------------------------------------------------------------------------
function setBeatloopSize(deck, newBeatloopSize) {
  console.log(deck.group, newBeatloopSize)
  engine.setValue(deck.group, "beatloop_size", newBeatloopSize);
}

function setBeatloopDouble(deck) {
  engine.setValue(deck.group, "loop_double", 1);
}

function setBeatloopHalve(deck) {
  engine.setValue(deck.group, "loop_halve", 1);
}

function setBeatloopActivate(deck) {
  engine.setValue(deck.group, "beatloop_activate", 1);
}

function setHotcueSet(deck, hotcueNumber) {
  engine.setValue(deck.group, `hotcue_${hotcueNumber}_set`, 1);
}

function setHotcueClear(deck, hotcueNumber) {
  engine.setValue(deck.group, `hotcue_${hotcueNumber}_clear`, 1);
}

function setHotcueGoto(deck, hotcueNumber) {
  engine.setValue(deck.group, `hotcue_${hotcueNumber}_goto`, 1);
}

function setPlay(deck, value = null) {
  if (value != null) {
    engine.setValue(deck.group, "play", value);
  } else if (getPlay(deck)) {
    engine.setValue(deck.group, "play", 0);
  } else {
    engine.setValue(deck.group, "play", 1);
  }
}

function setPlayNull(deck) {
  engine.setValue(deck.group, "play", 0);
}

function setLoadTrackAndPlay(deck) {
  engine.setValue(deck.group, "LoadSelectedTrackAndPlay", 1);
}

function setLoadTrack(deck) {
  engine.setValue(deck.group, "LoadSelectedTrack", 1);
}

function setEject(deck) {
  engine.setValue(deck.group, "eject", 1);
  engine.setValue(deck.group, "eject", 0);
}

function setMicrophoneEnabled(deck, value = null) {
  if (value != null) {
    engine.setValue(deck.group, "talkover", value);
  } else if (getMicrophoneEnabled(deck)) {
    engine.setValue(deck.group, "talkover", 0);
  } else {
    engine.setValue(deck.group, "talkover", 1);
  }
}

function setEffectEnabled(deck, value = null) {
  if (value != null) {
    engine.setValue(`[EffectRack1_EffectUnit${deck.deckNumber}]`, "enabled", value);
  } else if (getEffectEnabled(deck)) {
    engine.setValue(`[EffectRack1_EffectUnit${deck.deckNumber}]`, "enabled", 0);
  } else {
    engine.setValue(`[EffectRack1_EffectUnit${deck.deckNumber}]`, "enabled", 1);
  }
}

function setEffectEnabledMaster(effectsActive = null) {
  if (effectsActive != null) {
    for (let deckNumber = 1; deckNumber <= 2; deckNumber ++) {
      if (effectsActive.includes(deckNumber)) {
        engine.setValue(`[EffectRack1_EffectUnit${deckNumber}]`, "group_[Master]_enable", 1);
      } else {
        engine.setValue(`[EffectRack1_EffectUnit${deckNumber}]`, "group_[Master]_enable", 0);
      }
    }
  }
}

function setEffectEnabledHeadphones(effectsActive = null) {
  if (effectsActive != null) {
    for (let deckNumber = 1; deckNumber <= 2; deckNumber ++) {
      if (effectsActive.includes(deckNumber)) {
        engine.setValue(`[EffectRack1_EffectUnit${deckNumber}]`, "group_[Headphone]_enable", 1);
      } else {
        engine.setValue(`[EffectRack1_EffectUnit${deckNumber}]`, "group_[Headphone]_enable", 0);
      }
    }
  }
}

function setEffectEnabledDecks(effectsActive = null) {
  if (effectsActive != null) {
    for (let deckNumber = 1; deckNumber <= 2; deckNumber ++) {
      if (effectsActive.includes(deckNumber)) {
        engine.setValue(`[EffectRack1_EffectUnit${deckNumber}]`, `group_[Channel${deckNumber}]_enable`, 1);
      } else {
        engine.setValue(`[EffectRack1_EffectUnit${deckNumber}]`, `group_[Channel${deckNumber}]_enable`, 0);
      }
    }
  }
}

function setHeadphoneEnabled(deck) {
  if (getHeadphoneEnabled(deck)) {
    engine.setValue(deck.group, "pfl", 0)
  } else {
    engine.setValue(deck.group, "pfl", 1)
  }
}

function getBeatloopSize(deck) {
  return engine.getValue(deck.group, "beatloop_size");
}

function getBeatloopActive(deck) {
  return engine.getValue(deck.group, "loop_enabled") == 1;
}

function getHotcuesActive(deck) {
  let hotcuesActive = [];

  if (engine.getValue(deck.group, "hotcue_1_status") == 1) hotcuesActive.push(1);
  if (engine.getValue(deck.group, "hotcue_3_status") == 1) hotcuesActive.push(3);
  if (engine.getValue(deck.group, "hotcue_2_status") == 1) hotcuesActive.push(2);
  if (engine.getValue(deck.group, "hotcue_4_status") == 1) hotcuesActive.push(4);

  return hotcuesActive;
}

function getPlay(deck) {
  return engine.getValue(deck.group, "play") == 1;
}

function getTrackLoaded(deck) {
  return engine.getValue(deck.group, "track_loaded") == 1;
}

function getMicrophoneEnabled(deck) {
  return engine.getValue(deck.group, "talkover") == 1;
}

function getEffectEnabled(deck) {
  return engine.getValue(`[EffectRack1_EffectUnit${deck.deckNumber}]`, "enabled") == 1
}

function getEffectsEnabledMaster() {
  let effectsActive = [];

  if (engine.getValue(`[EffectRack1_EffectUnit1]`, "group_[Master]_enable") == 1) effectsActive.push(1);
  if (engine.getValue(`[EffectRack1_EffectUnit2]`, "group_[Master]_enable") == 1) effectsActive.push(2);
  
  return effectsActive;
}

function getHeadphoneEnabled(deck) {
  return engine.getValue(deck.group, "pfl") == 1;
}

// -----------------------------------------------------------------------------
// --------------------- [Deck] Loop & Hotcue features -------------------------
// -----------------------------------------------------------------------------

VestaxVCI100.key1Handler = function(value) {
  var deck = this.loopHotcueDeck;

  if (value) {
    if (deck != null && deck.loop) {
      if (!getBeatloopActive(deck)) {
        deck.beatloopActive = true;
        setBeatloopButtonStateLighting(deck);
      } else {
        deck.beatloopActive = false;
        setBeatloopButtonStateLighting(deck);
      }
  
      setBeatloopActivate(deck);
    } else {
      setEject(VestaxVCI100.Decks.Preview);
    }
  }
}

VestaxVCI100.key2Handler = function(value) {
  var deck = this.loopHotcueDeck;

  if (value) {
    if (deck != null && deck.loop) {
      if (!(getBeatloopSize(deck) >= VestaxVCI100.beatloopMinMax.max)) {
        setBeatloopSizeLighting(deck, VestaxVCI100.beatloopModifier);
        setBeatloopDouble(deck);
      }
    }
  }
}

VestaxVCI100.key3Handler = function(value) {
  var deck = this.loopHotcueDeck;

  if (value) {
    if (deck != null && deck.loop) {
      if (!(getBeatloopSize(deck) <= VestaxVCI100.beatloopMinMax.min)) {
        setBeatloopSizeLighting(deck, 1/VestaxVCI100.beatloopModifier);
        setBeatloopHalve(deck);
      }
    } else {
      let previewDeck = VestaxVCI100.Decks.Preview;
  
      setPlay(previewDeck);
      setPreviewButtonLighting(previewDeck);
    }
  }
}

// -----------------------------------------------------------------------------
// ----------------- [Deck] Beatloop-Size- & Hotcue-Editor ---------------------
// -----------------------------------------------------------------------------
function beatloopDeckHandler(deck, keyNumber) {
  let newBeatloopSize = VestaxVCI100.beatloopSizes[VestaxVCI100.beatloopSizes.length - keyNumber];
  deck.beatloopSize = newBeatloopSize;

  setBeatloopSize(deck, newBeatloopSize);
  setLoopHotcueLighting([keyNumber]);
}

function hotcueDeckHandler(deck, keyNumber) {
  if (VestaxVCI100.Buttons.Key3.state == VestaxVCI100.ButtonState.pressed) {
    deck.hotcueActive.push(keyNumber);
    setLoopHotcueLighting(deck.hotcueActive);
    setHotcueSet(deck, keyNumber);
  } else if (VestaxVCI100.Buttons.Key1.state == VestaxVCI100.ButtonState.pressed) {
    let hotcueIndex = deck.hotcueActive.indexOf(keyNumber);
    if (hotcueIndex > -1) deck.hotcueActive.splice(hotcueIndex, 1);

    setLoopHotcueLighting(deck.hotcueActive);
    setHotcueClear(deck, keyNumber);
  } else {
    setHotcueGoto(deck, keyNumber);
  }
}

function micDeckHandler(micDeck, keyNumber) {
  if (!getMicrophoneEnabled(micDeck)) {
    VestaxVCI100.microphonesActive.push(keyNumber);
    setLoopHotcueLighting(VestaxVCI100.microphonesActive);
  } else {
    let hotcueIndex = VestaxVCI100.microphonesActive.indexOf(keyNumber);
    if (hotcueIndex > -1) VestaxVCI100.microphonesActive.splice(hotcueIndex, 1);

    setLoopHotcueLighting(VestaxVCI100.microphonesActive);
  }
  setMicrophoneEnabled(micDeck);
}

VestaxVCI100.key4Handler = function(value) {
  let keyNumber = 1;
  let deck = this.loopHotcueDeck;

  if (value) {
    if (deck != null && deck.loop) {
      beatloopDeckHandler(deck, keyNumber);
    } else if (deck != null && deck.hotcue) {
      hotcueDeckHandler(deck, keyNumber);
    } else {
      let micDeck = VestaxVCI100.Decks[`Mic${keyNumber}`];
  
      micDeckHandler(micDeck, keyNumber)
    }
  }
}

VestaxVCI100.key5Handler = function(value) {
  let keyNumber = 2;
  let deck = this.loopHotcueDeck;

  if (value) {
    if (deck != null && deck.loop) {
      beatloopDeckHandler(deck, keyNumber);
    } else if (deck != null && deck.hotcue) {
      hotcueDeckHandler(deck, keyNumber);
    } else {
      let micDeck = VestaxVCI100.Decks[`Mic${keyNumber}`];
  
      micDeckHandler(micDeck, keyNumber)
    }
  }
}

VestaxVCI100.key6Handler = function(value) {
  let keyNumber = 3;
  let deck = this.loopHotcueDeck;

  if (value) {
    if (deck != null && deck.loop) {
      beatloopDeckHandler(deck, keyNumber);
    } else if (deck != null && deck.hotcue) {
      hotcueDeckHandler(deck, keyNumber);
    } else {
      let micDeck = VestaxVCI100.Decks[`Mic${keyNumber}`];
  
      micDeckHandler(micDeck, keyNumber)
    }
  }
}

VestaxVCI100.key7Handler = function(value) {
  let keyNumber = 4;
  let deck = this.loopHotcueDeck;

  if (value) {
    if (deck != null && deck.loop) {
      beatloopDeckHandler(deck, keyNumber);
    } else if (deck != null && deck.hotcue) {
      hotcueDeckHandler(deck, keyNumber);
    } else {
      let micDeck = VestaxVCI100.Decks[`Mic${keyNumber}`];
  
      micDeckHandler(micDeck, keyNumber)
    }
  }
}

VestaxVCI100.previewKeyHandler = function(value) {
  if (value) {
    let previewDeck = VestaxVCI100.Decks.Preview;

    setLoadTrack(previewDeck);
    setPlayNull(previewDeck);
    setPreviewButtonLighting(previewDeck);
  }
}

VestaxVCI100.effectKeyHandler = function(value) {
  if (value) {
    let deck1 = VestaxVCI100.GetDeck("[Channel1]");
    let deck2 = VestaxVCI100.GetDeck("[Channel2]");

    // Restore effect states of both decks and master
    VestaxVCI100.effectsActive = getEffectsEnabledMaster();
    deck1.effectActive = getEffectEnabled(deck1);
    deck2.effectActive = getEffectEnabled(deck2);
    
    if (VestaxVCI100.effectsActive.length == 0) {
      setEffectEnabledDecks([]);
      setEffectEnabledMaster([1,2]);
      VestaxVCI100.effectsActive = [1,2];
    } else {
      VestaxVCI100.effectsActive = [];
      setEffectEnabledMaster([]);
      setEffectEnabledDecks([1,2]);
    }

    let effectsActive = [];

    if (deck1.effectActive) effectsActive.push(deck1.deckNumber);
    if (deck2.effectActive) effectsActive.push(deck2.deckNumber);
    if (VestaxVCI100.effectsActive.length != 0) effectsActive.push(3);
    
    setEffectSwitchLighting(effectsActive);
  }
}

// -----------------------------------------------------------------------------
// -------------------- Add all Buttons except Loop/Hotcue ---------------------
// -----------------------------------------------------------------------------
VestaxVCI100.addButton("Key1", new VestaxVCI100.Button(0x62), "key1Handler");
VestaxVCI100.addButton("Key2", new VestaxVCI100.Button(0x63), "key2Handler");
VestaxVCI100.addButton("Key3", new VestaxVCI100.Button(0x64), "key3Handler");
VestaxVCI100.addButton("Key4", new VestaxVCI100.Button(0x68), "key4Handler");
VestaxVCI100.addButton("Key5", new VestaxVCI100.Button(0x67), "key5Handler");
VestaxVCI100.addButton("Key6", new VestaxVCI100.Button(0x66), "key6Handler");
VestaxVCI100.addButton("Key7", new VestaxVCI100.Button(0x65), "key7Handler");

VestaxVCI100.addButton("PreviewKey", new VestaxVCI100.Button(0x5F), "previewKeyHandler");
VestaxVCI100.addButton("EffectKey",  new VestaxVCI100.Button(0x4C), "effectKeyHandler");

// -----------------------------------------------------------------------------
// -------------------------------- Add Deck/s ---------------------------------
// -----------------------------------------------------------------------------
VestaxVCI100.Deck = function (deckNumber, group) {
  this.deckNumber            = deckNumber;
  this.group                 = group;
  this.vinylMode             = true;
  this.scratching            = false;
  this.loop                  = false;
  this.hotcue                = false;
  this.hotcueActive          = [];
  this.beatloopSize          = 4;
  this.beatloopActive        = false;
  this.beatloopOverSize      = false;
  this.beatloopUnderSize     = false;
  this.headphoneActive       = false;
  this.effectActive          = false;
  this.Buttons               = {};
}

VestaxVCI100.Deck.prototype.addButton = VestaxVCI100.addButton;

VestaxVCI100.Deck.prototype.jogMove = function(jogValue) {
  jogValue = jogValue * 3;
  engine.setValue(this.group,"jog", jogValue);
}

VestaxVCI100.Deck.prototype.scratchMove = function(jogValue) {
  engine.scratchTick(this.deckNumber, jogValue);
}

VestaxVCI100.Deck.prototype.loopHandler = function(value) {
  if(value) {
    // Double pressing the button deselects the deck
    if (this.loop && VestaxVCI100.loopHotcueDeck == this) {
      this.loop = false;
      setLoopSwitchLighting([]);
      setLoopHotcueLighting([]);
      setLoopHotcueButtonLighting([]);
      return;
    }
    
    // Restore Lighting state of loop activated button lights
    this.beatloopActive = getBeatloopActive(this);
    setBeatloopButtonStateLighting(this);

    // Restore Lighting state of loop activated lights
    this.beatloopSize = getBeatloopSize(this);
    setBeatloopLighting(this);

    // Change deck and switch from loop to hotcue mode
    VestaxVCI100.loopHotcueDeck = this;
    this.loop = true;
    this.hotcue = false;

    // Sets Hotcue and Loop Buttons to only light up selection
    setHotcueSwitchLighting([]);
    setLoopSwitchLighting([this.deckNumber]);
  }
}

VestaxVCI100.Deck.prototype.hotcueHandler = function(value) {
  if(value) {
    // Double pressing the button deselects the deck
    if (this.hotcue && VestaxVCI100.loopHotcueDeck == this) {
      this.hotcue = false;
      setHotcueSwitchLighting([]);
      setLoopHotcueLighting([]);
      setLoopHotcueButtonLighting([]);
      return
    }
    
    // Restore Lighting state of hotcue activated button lights
    setLoopHotcueButtonLighting([]);
    
    // Restore Lighting state of hotcue activated lights
    this.hotcueActive = getHotcuesActive(this);
    setLoopHotcueLighting(this.hotcueActive);

    // Change deck and switch from loop to hotcue mode
    VestaxVCI100.loopHotcueDeck = this;
    this.hotcue = true;
    this.loop = false;

    // Sets Hotcue and Loop Buttons to only light up selection
    setLoopSwitchLighting([]);
    setHotcueSwitchLighting([this.deckNumber]);
  }
}

VestaxVCI100.Deck.prototype.effectHandler = function(value) {
  if (value) {
    // Retrieve other deck for other effect
    let other = VestaxVCI100.GetDeck(VestaxVCI100.FlipMainDeck[this.group]);

    // Restore effect states of both decks
    VestaxVCI100.effectsActive = getEffectsEnabledMaster();
    this.effectActive = getEffectEnabled(this);
    other.effectActive = getEffectEnabled(other);

    // Double pressing the button disables effects for this deck
    this.effectActive = !this.effectActive;
    setEffectEnabled(this);

    if (VestaxVCI100.effectsActive.length == 0) {
      setEffectEnabledMaster([]);
    } else {
      setEffectEnabledMaster([1,2]);
    }

    let effectsActive = [];

    if (this.effectActive)  effectsActive.push(this.deckNumber);
    if (other.effectActive) effectsActive.push(other.deckNumber);
    if (VestaxVCI100.effectsActive.length != 0) effectsActive.push(3);
    
    setEffectSwitchLighting(effectsActive);
  }
}

VestaxVCI100.Deck.prototype.headphoneHandler = function(value) {
  if(value) {
    // Retrieve other deck for other headphone
    let other = VestaxVCI100.GetDeck(VestaxVCI100.FlipMainDeck[this.group]);

    // Restore Headphone states of both decks
    this.headphoneActive = getHeadphoneEnabled(this);
    other.headphoneActive = getHeadphoneEnabled(other);

    // Double pressing the button disables headphone for this deck
    this.headphoneActive = !this.headphoneActive;
    setHeadphoneEnabled(this);

    let headphonesActive = [];

    if (this.headphoneActive)  headphonesActive.push(this.deckNumber);
    if (other.headphoneActive) headphonesActive.push(other.deckNumber);
    
    setEffectEnabledHeadphones(headphonesActive);
    setHeadphoneSwitchLighting(headphonesActive);
  }
}

VestaxVCI100.Decks = {
  "Left":     new VestaxVCI100.Deck(1,"[Channel1]"),
  "Right":    new VestaxVCI100.Deck(2,"[Channel2]"),
  "Preview":  new VestaxVCI100.Deck(11,"[PreviewDeck1]"),
  "Mic1":     new VestaxVCI100.Deck(21,"[Microphone]"),
  "Mic2":     new VestaxVCI100.Deck(22,"[Microphone2]"),
  "Mic3":     new VestaxVCI100.Deck(23,"[Microphone3]"),
  "Mic4":     new VestaxVCI100.Deck(24,"[Microphone4]")
}

VestaxVCI100.GroupToDeck = {
  "[Channel1]":"Left",
  "[Channel2]":"Right",
  "[PreviewDeck1]":"Preview",
  "[Microphone]":"Mic1",
  "[Microphone2]":"Mic2",
  "[Microphone3]":"Mic3",
  "[Microphone4]":"Mic4"
}

VestaxVCI100.FlipMainDeck = {
  "[Channel1]":"[Channel2]",
  "[Channel2]":"[Channel1]"
}

VestaxVCI100.GetDeck = function(group) {
  try { return VestaxVCI100.Decks[VestaxVCI100.GroupToDeck[group]] }
  catch(ex) { return null }
}

// -----------------------------------------------------------------------------
// -------------------------- Add Loop/Hotcue Buttons --------------------------
// -----------------------------------------------------------------------------
VestaxVCI100.Decks.Left.addButton(  "Loop",        new VestaxVCI100.Button(0x42), "loopHandler");
VestaxVCI100.Decks.Right.addButton( "Loop",        new VestaxVCI100.Button(0x43), "loopHandler");
VestaxVCI100.Decks.Left.addButton(  "Hotcue",      new VestaxVCI100.Button(0x44), "hotcueHandler");
VestaxVCI100.Decks.Right.addButton( "Hotcue",      new VestaxVCI100.Button(0x45), "hotcueHandler");
VestaxVCI100.Decks.Left.addButton(  "Effect",      new VestaxVCI100.Button(0x4A), "effectHandler");
VestaxVCI100.Decks.Right.addButton( "Effect",      new VestaxVCI100.Button(0x4B), "effectHandler");
VestaxVCI100.Decks.Left.addButton(  "Headphone",   new VestaxVCI100.Button(0x48), "headphoneHandler");
VestaxVCI100.Decks.Right.addButton( "Headphone",   new VestaxVCI100.Button(0x49), "headphoneHandler");

VestaxVCI100.init = function (id) {
  // Set Lighting to OFF for Hotcue and Loop Bottom Buttons 
  setHotcueSwitchLighting([]);
  setLoopSwitchLighting([]);

  // Set Lighting to OFF for Hotcue and Loop Top Extra Buttons
  setLoopHotcueButtonLighting([]);
  setLoopHotcueLighting([]);

  // Set Lighting to OFF for Preview Buttons
  setLibrarySwitchLighting([]);

  // Set Lighting to OFF for Effect Buttons
  setEffectSwitchLighting([]);
  setEffectEnabled(VestaxVCI100.Decks.Left, 0)
  setEffectEnabled(VestaxVCI100.Decks.Right, 0)

  // Set Effect bindings for all FX Buttons
  setEffectEnabledMaster([]);
  setEffectEnabledHeadphones([]);
  setEffectEnabledDecks([1,2]);

  // Set Lighting to OFF for Headphone Buttons
  setHeadphoneSwitchLighting([]);
  
  // Get Beatloop-Size for Deck1
  let deck1 = VestaxVCI100.Decks.Left;
  deck1.beatloopSize = getBeatloopSize(deck1);

  // Get Beatloop-Size for Deck2
  let deck2 = VestaxVCI100.Decks.Right;
  deck2.beatloopSize = getBeatloopSize(deck2);
}

VestaxVCI100.shutdown = function (id) {
  // Set Lighting to OFF for Hotcue and Loop Bottom Buttons 
  setHotcueSwitchLighting([]);
  setLoopSwitchLighting([]);

  // Set Lighting to OFF for Hotcue and Loop Top Extra Buttons
  setLoopHotcueButtonLighting([]);
  setLoopHotcueLighting([]);

  // Set Lighting to OFF for Preview Buttons
  setLibrarySwitchLighting([]);

  // Set Lighting to ON for Effect Buttons
  setEffectSwitchLighting([]);
  setEffectEnabled(VestaxVCI100.Decks.Left, 0)
  setEffectEnabled(VestaxVCI100.Decks.Right, 0)

  // Set Effect bindings for all FX Buttons
  setEffectEnabledMaster([]);
  setEffectEnabledHeadphones([]);
  setEffectEnabledDecks([1,2]);

  // Set Lighting to OFF for Headphone Buttons
  setHeadphoneSwitchLighting([]);
}


// -----------------------------------------------------------------------------
// ------------------------ Direct Mapping functions ---------------------------
// -----------------------------------------------------------------------------
VestaxVCI100.vinyl_mode = function (channel, control, value, status, group) {
//   var deck = VestaxVCI100.GetDeck(group);
//   if(value) {
//      if(deck.vinylMode) {
//         deck.vinylMode = false;
//         midi.sendShortMsg(0xB0, control, 0x00);
//      } else {
//         deck.vinylMode = true;
//         midi.sendShortMsg(0xB0, control, 0x7F);
//      }
//   }
}

VestaxVCI100.jog_touch = function (channel, control, value, status, group) {
  var deck = VestaxVCI100.GetDeck(group);

  if(value) {
    engine.scratchEnable(deck.deckNumber, 128*3, 33+1.0/3, 1.0/8, (1.0/8)/32, true);
  } else {
    engine.scratchDisable(deck.deckNumber);
  }
}

VestaxVCI100.jog_wheel = function (channel, control, value, status, group) {
  // 41 > 7F: CW Slow > Fast ??? 
  // 3F > 0 : CCW Slow > Fast ???
  var jogValue = value - 0x40; // -64 to +63, - = CCW, + = CW
  VestaxVCI100.GetDeck(group).jogMove(jogValue);
}

VestaxVCI100.jog_wheel_scratch = function (channel, control, value, status, group) {
  // 41 > 7F: CW Slow > Fast ??? 
  // 3F > 0 : CCW Slow > Fast ???
  var jogValue = value - 0x40; // -64 to +63, - = CCW, + = CW
  VestaxVCI100.GetDeck(group).scratchMove(jogValue);
}

VestaxVCI100.loopMode = function (channel, control, value, status, group) {
  VestaxVCI100.GetDeck(group).Buttons.Loop.handleEvent(value);
}

VestaxVCI100.hotcueMode = function (channel, control, value, status, group) {
  VestaxVCI100.GetDeck(group).Buttons.Hotcue.handleEvent(value);
}

VestaxVCI100.effectMode = function (channel, control, value, status, group) {
  VestaxVCI100.GetDeck(group).Buttons.Effect.handleEvent(value);
}

VestaxVCI100.headphoneMode = function (channel, control, value, status, group) {
  VestaxVCI100.GetDeck(group).Buttons.Headphone.handleEvent(value);
}

VestaxVCI100.key1 = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.Key1.handleEvent(value);
}

VestaxVCI100.key2 = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.Key2.handleEvent(value);
}

VestaxVCI100.key3 = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.Key3.handleEvent(value);
}

VestaxVCI100.key4 = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.Key4.handleEvent(value);
}

VestaxVCI100.key5 = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.Key5.handleEvent(value);
}

VestaxVCI100.key6 = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.Key6.handleEvent(value);
}

VestaxVCI100.key7 = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.Key7.handleEvent(value);
}

VestaxVCI100.previewKey = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.PreviewKey.handleEvent(value);
}

VestaxVCI100.effectKey = function (channel, control, value, status, group) {
  VestaxVCI100.Buttons.EffectKey.handleEvent(value);
}

