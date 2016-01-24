# Coders Against Humanity

A Node.JS implementation of the famous game
[Cards Against Humanity](http://cardsagainsthumanity.com/).

## Pre-Requisites

* nodejs >= 0.10
* npm >= 1.3.10
* express >= 4.12.4
* mongodb >= 2.4.9

## Installation

    make install

## Load cards data

	make populate

By default, cards are loaded from `data/deck2.json` which is a combination of many
decks from [JSON Against Humanity](http://www.crhallberg.com/cah/json).

## Starting server

	make run

The server will be ready at [http://localhost:3000](http://localhost:3000).
