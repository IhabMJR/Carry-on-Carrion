let xp = 0;
let health = 100;
let gold = 15;
let currentWeapon = 0;
let currentWispy = 1;
let maxWispy = 1;
let fighting;
let monsterHealth;
let forestComplete = false;
let inventory = ["claws"];
let day = 1;
/*let playerTurn = true;*/

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const controls = document.querySelector("#controls");
const text = document.querySelector("#text");
const healthText = document.querySelector("#healthText");
const wispyText = document.querySelector("#wispyText");
const maxWispyText = document.querySelector("#maxWispyText");
const dayText = document.querySelector("#dayText");
const goldText = document.querySelector("#goldText");
const xpText = document.querySelector("#xpText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "claws", power: 5 },
  { name: "dagger", power: 30 },
  { name: "bastard sword", power: 50 },
  { name: "greatsword", power: 100 },
];
const monsters = [
  {
    name: "Penumbral",
    level: 2,
    health: 15,
  },
  {
    name: "Umbral",
    level: 8,
    health: 60,
  },
  {
    name: "Accursed Hydra",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "camp",
    "button text": [
      "Sit by the fire",
      "Explore the forest",
      "???",
    ],
    "button functions": [goCampActions, goForest, fightBoss],
    text: "You are at your camp. A merchant warms himself by the fire, his steed resting by his side.",
  },
  {
    name: "merchant",
    "button text": [
      "Buy Wispy (25 gold)",
      "Buy weapon (30 gold)",
      "End the conversation",
    ],
    "button functions": [buyWispy, buyWeapon, goCampActions],
    text: "You engage in discussion with the merchant.",
  },
  {
    name: "forest",
    "button text": ["Fight Penumbraling", "Fight Umbral", "Return to camp"],
    "button functions": [fightLesserShadow, fightShadow, goCamp],
    text: "You journey into the forest. Shadows lurk in every corner of this place wishing to feast on a fresh corpse.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Heal", "Run"],
    "button functions": [attack, heal, goCamp],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": ["Go to camp", "Go to camp", "Go to camp"],
    "button functions": [goCamp, goCamp, easterEgg],
    text: "The monster vanishes as it dies, any trace of its body is now gone to the wind. You gain experience points and find gold.",
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die.",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the warrior! YOU WIN THE GAME!",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to camp?"],
    "button functions": [pickTwo, pickEight, goCamp],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
  {
    name: "camp actions",
    "button text": ["Speak to the merchant", "Rest", "Get back up"],
    "button functions": [goMerchant, goRest, goCamp],
    text: "You sit down by the campfire, indulging yourself in the rare moments of peace you are allowed.",
  },
  {
    name: "rest",
    "button text": ["Carry on", "Carry on", "Carry on"],
    "button functions": [goCamp, goCamp, goCamp],
    text: "As you rest, your vials are imbued with Wispy. The sunlight graces your face." /*use ${} to allow different dreams to play out!*/,
  },
];

// initialize buttons
button1.onclick = goMerchant;
button2.onclick = goForest;
button3.onclick = fightBoss;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  type(location.text);
}

function type(txt) {
  window.typed = new Typed("#text", {
    strings: [txt],
    typeSpeed: 5,
    backSpeed: 5,
    backDelay: 100,
    showCursor: true,
    cursorChar: "|",
    autoInsertCss: true,
    preStringTyped: () => {
      button1.disabled = true;
      button2.disabled = true;
      button3.disabled = true;
    },
    onComplete: () => {
      button1.disabled = false;
      button2.disabled = false;
      button3.disabled = false;
    },
  });
}

function goCamp() {
  update(locations[0]);
}

function goCampActions() {
  update(locations[8]);
}

function goMerchant() {
  update(locations[1]);
}

function goRest() {
  update(locations[9]);
  currentWispy = maxWispy;
  wispyText.innerText = currentWispy;
  day++;
  dayText.innerText = day;
}

function goForest() {
  update(locations[2]);
}

function buyWispy() {
  let buyWispyText;
  if (maxWispy < 5) {
    if (gold >= 25) {
      gold -= 25;
      currentWispy++;
      maxWispy++;
      goldText.innerText = gold;
      wispyText.innerText = currentWispy;
      maxWispyText.innerText = maxWispy;
      buyWispyText = "You purchase a vial of Wispy.";
    } else {
      buyWispyText = "You do not have enough gold to buy a vial of Wispy.";
    }
  } else {
    buyWispyText = "The merchant looks at you in utter disbelief, you have no more place on your person to carry anymore vials.";
  }
  type(buyWispyText);
}

function buyWeapon() {
  let buyWeaponText;
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      buyWeaponText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      buyWeaponText += " In your inventory you have: " + inventory;
    } else {
      buyWeaponText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    buyWeaponText = "You've already bought every weapon that the merchant has offered you.";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
  type(buyWeaponText);
}

function sellWeapon() {
  let sellWeaponText;
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    sellWeaponText = "You sold a " + currentWeapon + ".";
    sellWeaponText += " In your inventory you have: " + inventory;
  } else {
    sellWeaponText = "The merchant isn't interested in buying any claws today.";
  }
  type(sellWeaponText);
}

function fightLesserShadow() {
  fighting = 0;
  goFight();
}

function fightShadow() {
  fighting = 1;
  goFight();
}

function fightBoss() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  let attackText;
  attackText = "The " + monsters[fighting].name + " attacks. You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    attackText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 1) {
      forestComplete = true;
      console.log(forestComplete);
      defeatMonster();
    }
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    attackText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
  type(attackText);
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function heal() {
  if (currentWispy > 0) {
    currentWispy--;
    health += 15;
    wispyText.innerText = currentWispy;
    healthText.innerText = health;
    type("You drink a vial of Wispy, you regain 15 health.");
  } else if (health <= 25) {
    type(
      '"You grow weaker Carrion, perhaps you shall meet your end once more?" The voice whispers. You are out of Wispy vials.');
  } else if (health >= 85) {
    type(
      '"Do you truly fear your opponent this much?" the voice inside you rings out in a shameful tone. You are out of Wispy vials.');
  } else {
    type("You're all out of Wispy.");
  }
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  playerTurn = true;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  health = 100;
  maxWispy = 1;
  currentWispy = maxWispy;
  gold = 15;
  xp = 0;
  playerTurn = true;
  currentWeapon = 0;
  inventory = ["claws"];
  goldText.innerText = gold;
  healthText.innerText = health;
  maxWispyText.innerText = maxWispy;
  wispyText.innerText = currentWispy;
  xpText.innerText = xp;
  goCamp();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  let pickText;
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  type("You picked " + guess + ". Here are the random numbers:\n");
  for (let i = 0; i < 10; i++) {
    pickText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    pickText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    pickText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
  type(pickText);
}
