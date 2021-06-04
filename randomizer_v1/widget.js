let commands,
  nextCommand,
  challengeItemCommand,
  resetItemCommand,
  resetChallengeCommand,
  vipToggleOnCommand,
  vipToggleOffCommand;

const listOfPhasItems = [
  "Spirit Box",
  "Ghost Writing Book",
  "EMF Reader",
  "Video Camera",
  "UV Flashlight",
  "Strong Flashlight",
  "Candle",
  "Crucifix",
  "Glow Stick",
  "Head Mounted Camera",
  "Infrared Light Sensor",
  "Lighter",
  "Motion Sensor",
  "Parabolic Microphone",
  "Salt Shaker",
  "Sanity Pills",
  "Smudge Sticks",
  "Sound Sensor",
  "Thermometer",
  "Tripod",
];

const listOfChallenges = [
  "Butterfingers",
  "Carbon Footprint",
  "Cat Daddy",
  "Chatterbox",
  "Claustrophobia",
  //"Crime Scene Investigator",
  "Door Closer",
  "Experienced Hunter",
  "For Science",
  "Forgetful",
  "Fully Equipped",
  "Germaphobe",
  "Ghost Hugger",
  "Giggler",
  "Glutton for Punishment",
  "Good Samaritan",
  "Handyman",
  "Hoarder",
  "Honker",
  "I.T. Crew",
  "Kleptomaniac",
  "Light Hoarder",
  "Lights Out",
  "Mute",
  "Noctophile",
  "Picture Perfect",
  "Pill Anxiety",
  "Pyromaniac",
  "Quirk Forgiveness",
  "Realtor",
  "Restless",
  "Scophophobia",
  "Slob",
  "Stingy",
  "Swaparoo",
  "Technophone",
  "Telemarketer",
  "The Right Chicken",
  "The TimeTell",
  "Weak Bladder",
];

const listOfChallengeItems = [
  "Spirit Box",
  "Writing Book",
  "EMF Reader",
  "Video Camera",
  "UV Flashlight",
  "Strong Flashlight",
  "Candle",
  "Crucifix",
  "Glow Stick",
  "Head Camera",
  "Infrared Sensor",
  "Lighter",
  "Motion Sensor",
  "Parabolic",
  "Photo Camera",
  "Salt Shaker",
  "Sanity Pills",
  "Smudge Sticks",
  "Sound Sensor",
  "Thermometer",
  "Tripod",
];

let config = {};

let channelName;

let currentPhasList = [...listOfPhasItems];
let extraPhasList = [...listOfChallengeItems];
var whatListType = 0;

window.addEventListener('onWidgetLoad', function (obj) {
  const fieldData = obj.detail.fieldData;
  nextCommand = fieldData['nextCommand'];
  challengeItemCommand = fieldData['challengeItemCommand'];
  resetItemCommand = fieldData['resetItemCommand'];
  resetChallengeCommand = fieldData['resetChallengeCommand'];
  vipToggleOnCommand = fieldData['vipToggleOnCommand'];
  vipToggleOffCommand = fieldData['vipToggleOffCommand'];
  
  commands = [
    nextCommand,
    challengeItemCommand,
    resetItemCommand,
    resetChallengeCommand,
    vipToggleOnCommand,
    vipToggleOffCommand,
  ];
  
  config.allowVIPS = (fieldData['allowVIPS'] === 'yes') ? true : false;
  config.vipCommandAccess = (config.allowVIPS) ? true : false;

  let useGradientBorder = (fieldData['useGradientBorder'] === 'yes') ? true : false;
  let useAnimatedBorder = (fieldData['useAnimatedBorder'] === 'yes') ? true : false;

  if (useGradientBorder) {
    $('#items-container').addClass('animated-box');

    if (useAnimatedBorder) {
      $('#items-container').addClass('in');
      $('#items-container').addClass('animated-box-300');
    } else {
      $('#items-container').addClass('animated-box-100');
    }
  } else {
    $('#items-container').addClass('phas-border');
  }
});
  
window.addEventListener("onEventReceived", function (obj) {
  // Grab relevant data from the event;
  let data = obj.detail.event.data;

  // Check if a moderator
  let badges = data.badges;
  let i = badges.findIndex(x =>
    x.type === "moderator" ||
    x.type === "broadcaster" ||
    (config.allowVIPS && config.vipCommandAccess && x.type === "vip") ||
    data.displayName.toLowerCase() === "glitchedmythos"
  );
  if (i == -1) {
    // Not a mod, VIP or GlitchedMythos
    return;
  }

  // Check if a matching command
  let givenCommand = data.text.split(" ")[0];
  let commandArgument = data.text.split(" ").slice(1).join(" ");

  switch (givenCommand.toLowerCase()) {
    case "{{nextCommand}}":
      nextItem(0);
      break;
    case "{{challengeItemCommand}}":
      if (whatListType===1) { nextItem(1); }
      break;
    case "{{resetItemCommand}}":
      resetItems();
      currentPhasList = [...listOfPhasItems];
      whatListType = 0;
      break;
    case "{{resetChallengeCommand}}":
      resetItems();
      currentPhasList = [...listOfChallenges];
      extraPhasList = [...listOfChallengeItems];
      whatListType = 1;
      break;
    case "{{vipToggleOnCommand}}":
      if (x.type === 'moderator' || x.type === 'broadcaster') {
        config.vipCommandAccess = true;
      }
      break;
    case "{{vipToggleOffCommand}}":
      if (x.type === 'moderator' || x.type === 'broadcaster') {
        config.vipCommandAccess = false;
      }
      break;
  }
});

const nextItem = (num) => {
  if(isEmpty($("#items-container"))) {
    $("#items-container").removeClass("hidden");
  }
  if (num===1) {
    var item = currentPhasList.splice(
      Math.floor(Math.random() * currentPhasList.length),
      1
    ) + ' + ' + extraPhasList.splice(
      Math.floor(Math.random() * extraPhasList.length),
      1
    );
  }
  else {
    var item = currentPhasList.splice(
      Math.floor(Math.random() * currentPhasList.length),
      1
    );
  }
  if (currentPhasList.length < 1) {
    // DO nothing
  } else {
    if (currentPhasList.length % 2 == 0) {
      const newItem = $.parseHTML(
        `
              <div class="objecteven flex items-center justify-center flex-col animate__animated animate__backInRight">
                <div class="text-center">
                  ${item}
                </div>
              </div>
            `
      );
    $("#items-container").append(newItem);
    } else { 
      const newItem = $.parseHTML(
        `
              <div class="objectodd flex items-center justify-center flex-col animate__animated animate__backInRight">
                <div class="text-center">
                  ${item}
                </div>
              </div>
            `
      );
      $("#items-container").append(newItem);
    }
  }
};

const resetItems = () => {
  $("#items-container").addClass("animate__animated");
  $("#items-container").addClass("animate__hinge");

  setTimeout(() => {
    $("#items-container").empty();
    $("#items-container").removeClass("animate__animated");
    $("#items-container").removeClass("animate__hinge");
    $("#items-container").addClass("hidden");
  }, 2000);
};

function isEmpty( el ){
    return !$.trim(el.html())
}
