import { deck } from "../src/deck/content";
import { expandDeck } from "../src/deck/expand";
import { validateDeck } from "../src/deck/schema";

const validatedDeck = validateDeck(deck);
const slides = expandDeck(validatedDeck);

console.log(
  `Deck is valid: ${validatedDeck.slides.length} authored slides, ${slides.length} rendered slides.`,
);
