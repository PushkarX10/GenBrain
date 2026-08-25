/**
 * GenBrain — Flashcard Interaction Hook
 *
 * Manages card fetching from the database and records
 * user interactions for the spaced repetition system.
 *
 * General Knowledge only — 15+ curated facts across diverse topics.
 */

import { useCallback, useRef } from "react";
import { useCardStore, type CardData } from "../store/useCardStore";
import { useGameStore } from "../store/useGameStore";
import {
  calculateNextReview,
  interactionToQuality,
  DEFAULT_SM2,
  type SM2State,
} from "../lib/spacedRepetition";
import { recordInteraction, incrementCardsRead } from "../db/helpers";

/** General Knowledge card pool — curated facts across diverse topics */
export const GK_CARDS: CardData[] = [
  {
    id: "gk-1",
    tag: "Science",
    front: "Octopuses have three hearts — and two of them stop beating when they swim.",
    back: "The pair pumping blood to the gills pause during swimming, which is partly why octopuses prefer crawling.",
    deepDive:
      "Two branchial hearts push blood through the gills, while a systemic heart circulates it to the body. Swimming strains this system, so octopuses tire quickly and favor crawling.",
  },
  {
    id: "gk-2",
    tag: "Space",
    front: "A day on Venus is longer than its year.",
    back: "Venus rotates once every 243 Earth days but orbits the Sun in just 225.",
    deepDive:
      "Venus spins retrograde and extremely slowly. Its sidereal day (243 Earth days) exceeds its orbital period (225 days), so a Venusian solar day works out to about 117 Earth days.",
  },
  {
    id: "gk-3",
    tag: "History",
    front: "Oxford University is older than the Aztec Empire.",
    back: "Teaching began at Oxford around 1096; Tenochtitlán was founded in 1325.",
    deepDive:
      "Oxford has evidence of teaching from 1096, expanding rapidly after 1167. The Aztec capital Tenochtitlán was not founded until 1325 — meaning Oxford predates it by over two centuries.",
  },
  {
    id: "gk-4",
    tag: "Nature",
    front: "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.",
    back: "Honey's low moisture, acidic pH, and natural hydrogen peroxide make it inhospitable to bacteria and microorganisms.",
    deepDive:
      "Bees fan nectar with their wings to reduce moisture below 18%. The enzyme glucose oxidase produces hydrogen peroxide, and the acidic pH (~3.9) creates a triple antimicrobial barrier.",
  },
  {
    id: "gk-5",
    tag: "Language",
    front: "The shortest complete sentence in English is 'Go.'",
    back: "It contains a subject (implied 'you') and a predicate (the verb 'go'), satisfying the grammatical requirements of a sentence.",
    deepDive:
      "In imperative sentences, the subject 'you' is understood but not stated. 'Go.' is both a complete sentence and a single-word command, making it the shortest possible valid English sentence.",
  },
  {
    id: "gk-6",
    tag: "Geography",
    front: "Russia spans 11 time zones — more than any other country.",
    back: "From Kaliningrad (UTC+2) to Kamchatka (UTC+12), Russia covers nearly half the world's longitudes.",
    deepDive:
      "Russia stretches over 10,000 km east to west. When it's midnight on Russia's western border, it's already 10 AM the next day on its Pacific coast. France technically spans 12 if overseas territories count.",
  },
  {
    id: "gk-7",
    tag: "Science",
    front: "Bananas are naturally radioactive due to their potassium content.",
    back: "Bananas contain potassium-40 (⁴⁰K), a naturally occurring radioactive isotope, but the dose is harmless.",
    deepDive:
      "A single banana delivers about 0.01 mSv of radiation — the 'banana equivalent dose.' You would need to eat 10 million bananas at once for radiation sickness. Your body regulates potassium levels regardless.",
  },
  {
    id: "gk-8",
    tag: "History",
    front: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
    back: "The Great Pyramid was built ~2560 BC. Cleopatra lived ~30 BC. The Moon landing was 1969 AD.",
    deepDive:
      "About 2,530 years separated Cleopatra from the Great Pyramid, but only 1,999 years separated her from the Moon landing. The ancient world was far more spread out in time than people realize.",
  },
  {
    id: "gk-9",
    tag: "Technology",
    front: "The first computer 'bug' was an actual bug — a moth trapped in a relay of the Harvard Mark II.",
    back: "In 1947, Grace Hopper's team taped the moth into their logbook with the note 'First actual case of bug being found.'",
    deepDive:
      "While the term 'bug' for malfunctions predated this incident (Thomas Edison used it in 1878), the moth event popularized it in computing. Grace Hopper later pioneered the COBOL programming language.",
  },
  {
    id: "gk-10",
    tag: "Nature",
    front: "A group of flamingos is called a 'flamboyance.'",
    back: "The collective noun reflects their vibrant pink plumage and dramatic social displays.",
    deepDive:
      "Flamingos get their color from carotenoid pigments in their diet of brine shrimp and algae. Born gray-white, they gradually turn pink. A flamboyance can contain thousands of birds performing synchronized dances.",
  },
  {
    id: "gk-11",
    tag: "Space",
    front: "There are more stars in the universe than grains of sand on all of Earth's beaches.",
    back: "Estimates suggest ~10²² stars vs ~7.5×10¹⁸ grains of sand — roughly 1,000 stars per grain.",
    deepDive:
      "The observable universe contains ~2 trillion galaxies, each with hundreds of billions of stars. Earth's beaches hold an estimated 7.5 quintillion grains of sand. Stars outnumber sand by a factor of ~1,000.",
  },
  {
    id: "gk-12",
    tag: "Geography",
    front: "The Dead Sea is shrinking — its surface has dropped over 30 meters since the 1960s.",
    back: "Water diversion from the Jordan River and mineral extraction have dramatically reduced inflow.",
    deepDive:
      "The Dead Sea, at 430m below sea level, is the lowest point on Earth's land surface. Its salinity (~34%) is nearly 10x that of the ocean. A proposed Red Sea–Dead Sea canal could stabilize levels.",
  },
  {
    id: "gk-13",
    tag: "Science",
    front: "Glass is neither a solid nor a liquid — it's an amorphous solid.",
    back: "Glass molecules are frozen in a disordered arrangement, unlike the neat crystal lattice of true solids.",
    deepDive:
      "The myth that old window glass is thicker at the bottom (suggesting it 'flows') is false — that's a manufacturing artifact. Glass transitions gradually from liquid to solid without crystallizing.",
  },
  {
    id: "gk-14",
    tag: "Language",
    front: "The word 'set' has the most definitions of any English word — over 430 senses in the OED.",
    back: "Its meanings span verbs (set a table), nouns (a set of tools), and adjectives (a set routine).",
    deepDive:
      "The Oxford English Dictionary entry for 'set' is one of the longest, reflecting centuries of evolving usage. 'Run' is a close contender with ~396 senses. Monosyllabic words often accumulate the most meanings.",
  },
  {
    id: "gk-15",
    tag: "History",
    front: "The shortest war in history lasted 38 to 45 minutes — between Britain and Zanzibar in 1896.",
    back: "The Anglo-Zanzibar War began at 9:00 AM on August 27, 1896, and Zanzibar surrendered before 10:00 AM.",
    deepDive:
      "Sultan Khalid bin Barghash refused to step down. The British issued a 9:00 AM ultimatum; when it expired, five warships bombarded the palace. Around 500 Zanzibari casualties vs 1 British sailor wounded.",
  },
];

export function useFlashcards() {
  const setCards = useCardStore((s) => s.setCards);
  const advance = useCardStore((s) => s.advance);
  const getCurrentCard = useCardStore((s) => s.getCurrentCard);
  const addXp = useGameStore((s) => s.addXp);
  const bumpQuest = useGameStore((s) => s.bumpQuest);
  const viewStart = useRef<number>(Date.now());

  /** Initialize the card deck (from DB or sample data) */
  const loadCards = useCallback(() => {
    // TODO: Replace with WatermelonDB query when cards are populated
    setCards(GK_CARDS);
  }, [setCards]);

  /** Called when the user swipes to the next card */
  const onSwipe = useCallback(
    (direction: 1 | -1) => {
      const currentCard = getCurrentCard();
      const durationMs = Date.now() - viewStart.current;

      // Record the interaction
      if (currentCard) {
        const interactionType = durationMs < 1000 ? "skipped" : "viewed";
        const quality = interactionToQuality(interactionType, durationMs);
        const smState = calculateNextReview(DEFAULT_SM2, quality);

        recordInteraction(currentCard.id, interactionType, durationMs, smState);

        if (interactionType === "viewed") {
          incrementCardsRead();
        }
      }

      // Advance the deck (wraps around via modulo — infinite cycling)
      const isNew = advance(direction);
      if (isNew) {
        addXp(4, "card_read");
        bumpQuest("read", 1);
      }

      // Reset view timer
      viewStart.current = Date.now();
    },
    [getCurrentCard, advance, addXp, bumpQuest]
  );

  /** Called when the user asks the AI tutor about a card */
  const onAskAI = useCallback(
    (card: CardData) => {
      const durationMs = Date.now() - viewStart.current;
      const quality = interactionToQuality("asked_ai", durationMs);
      const smState = calculateNextReview(DEFAULT_SM2, quality);

      recordInteraction(card.id, "asked_ai", durationMs, smState);
      addXp(8, "card_deep_dive");
    },
    [addXp]
  );

  return {
    loadCards,
    onSwipe,
    onAskAI,
    currentCard: getCurrentCard(),
  };
}
