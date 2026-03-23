# Simple Card Draw Game (Vite + Vanilla JavaScript)

## Overview

This project is a small browser-based card drawing system built using **Vite** and **Vanilla JavaScript**.
It simulates a basic card game mechanic where a player can draw random cards from a standard **52-card deck**.

The application demonstrates how game actions (like drawing a card) can be translated into system logic.

---

## Features

* Generates a full **52-card deck** programmatically.
* Each card has a **suit** (♠, ♥, ♦, ♣) and a **rank** (A–K).
* Player can click a **Draw Card** button to receive a random card.
* The drawn card is **removed from the deck** so it cannot appear again.
* **Deck count updates automatically** after each draw.
* If the deck is empty, the system shows the message
  **"No cards left in the deck."**
* Cards are displayed using **real playing card images**.

---

## Tech Stack

* **Vite** – development server and project bundler
* **Vanilla JavaScript** – game logic
* **HTML5** – layout
* **CSS3** – styling with a green gradient background

---

## How It Works

1. When the page loads, the system generates a **52-card deck** using suit and rank combinations.
2. When the player clicks **Draw Card**:

   * A **random index** is selected from the deck.
   * The card at that position is **removed using `splice()`**.
   * The card is added to the **player's hand**.
   * The **deck count updates**.
3. If the deck becomes empty, the system displays a message to the player.

---

## Project Structure

```
project-folder
│
├── index.html
├── main.js
├── style.css
└── README.md
```

---

## Running the Project

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

Open the local server URL shown in the terminal (usually):

```
http://localhost:5173
```

---

## Possible Improvements

* Add **card shuffle animation**
* Implement **multiple players**
* Add **turn-based gameplay**
* Add **drag-and-drop card interaction**
* Track **discard piles**

---

## Purpose

This project demonstrates how a simple **game mechanic (drawing a card)** can be implemented using basic web technologies while maintaining clear and modular logic.
# Trick-Masters-Card-Game-
