/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/** **/

'use strict';

const Alexa = require('alexa-sdk');
/* const hexagrams = require('./hexgrams'); */

const APP_ID = "amzn1.ask.skill.64027d03-afd5-4dc7-a0b6-177c66673fb3"; 

const RECIPE_EN_GB = {
        		'One': 'The first hexagram is made up of six unbroken lines.  These unbroken lines stand for the primal power, which is light–giving, active, strong, and of the spirit.  The hexagram is consistently strong in character, and since it is without weakness, its essence is power or energy.  Its image is heaven.  Its energy is represented as unrestricted by any fixed conditions in space and is therefore conceived of as motion.  Time is regarded as the basis of this motion.  Thus the hexagram includes also the power of time and the power of persisting in time, that is, duration. The power represented by the hexagram is to be interpreted in a dual sense—in terms of its action on the universe and of its action on the world of men.  In relation to the universe, the hexagram expresses the strong, creative action of the Deity.  In relation to the human world, it denotes the creative action of the holy man or sage, of the ruler or leader of men, who through his power awakens and develops their higher nature.',
        		'Sixty Four': 'This hexagram indicates a time when the transition from disorder to order is not yet completed.  The change is indeed prepared for, since all the lines in the upper trigram are in relation to those in the lower.  However, they are not yet in their places.  While the preceding hexagram offers an analogy to autumn, which forms the transition from summer to winter, this hexagram presents a parallel to spring, which leads out of winter’s stagnation into the fruitful time of summer.  With this hopeful outlook the Book of Changes come to its close.',
};

const RECIPE_EN_US = {
        		'One': 'The first hexagram is made up of six unbroken lines.  These unbroken lines stand for the primal power, which is light–giving, active, strong, and of the spirit.  The hexagram is consistently strong in character, and since it is without weakness, its essence is power or energy.  Its image is heaven.  Its energy is represented as unrestricted by any fixed conditions in space and is therefore conceived of as motion.  Time is regarded as the basis of this motion.  Thus the hexagram includes also the power of time and the power of persisting in time, that is, duration. The power represented by the hexagram is to be interpreted in a dual sense—in terms of its action on the universe and of its action on the world of men.  In relation to the universe, the hexagram expresses the strong, creative action of the Deity.  In relation to the human world, it denotes the creative action of the holy man or sage, of the ruler or leader of men, who through his power awakens and develops their higher nature.',
		        'Sixty Four': 'This hexagram indicates a time when the transition from disorder to order is not yet completed.  The change is indeed prepared for, since all the lines in the upper trigram are in relation to those in the lower.  However, they are not yet in their places.  While the preceding hexagram offers an analogy to autumn, which forms the transition from summer to winter, this hexagram presents a parallel to spring, which leads out of winter’s stagnation into the fruitful time of summer.  With this hopeful outlook the Book of Changes come to its close.',
};

const languageStrings = {
    'en': {
        translation: {
            RECIPES: RECIPE_EN_US,
            // TODO: Update these messages to customize.
            SKILL_NAME: 'IChing',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s is the meaning of Hexagram One? ... So, how might I advise you?",
            WELCOME_REPROMPT: 'Take your time. For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  -  Hexagram %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the meaning or, tell me about or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, what\'s the meaning, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Fare well!',
            RECIPE_REPEAT_MESSAGE: 'Ask me to repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, the heavens have obscured the answer",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the Hexagram %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that hexgram. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What hexagram would you like advise about?',
        },
    },
    'en-US': {
        translation: {
            RECIPES: RECIPE_EN_US,
            SKILL_NAME: 'IChing',
        },
    },
    'en-GB': {
        translation: {
            RECIPES: RECIPE_EN_GB,
            SKILL_NAME: 'IChing',
        },
    },
};

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'HexagramIntent': function () {
        const hexagramSlot = this.event.request.intent.slots.Hexagram;
        let hexagramName;
        if (hexagramSlot && hexagramSlot.value) {
            hexagramName = hexgramSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), hexagramName);
        const myRecipes = this.t('RECIPES');
        const recipe = myRecipes[hexagramName];

        if (recipe) {
            this.attributes.speechOutput = recipe;
            this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');

            this.response.speak(recipe).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, recipe);
            this.emit(':responseReady');
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            if (hexagramName) {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', hexagramName);
            } else {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.response.speak(speechOutput).listen(repromptSpeech);
            this.emit(':responseReady');
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

