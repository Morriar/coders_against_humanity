# Coders Against Humanity

A Node.JS implementation of the famous game
[Cards Against Humanity](http://cardsagainsthumanity.com/).

<table>
	<tr>
		<td><img src='https://raw.githubusercontent.com/Morriar/coders_against_humanity/master/doc/example1.png'></td>
		<td><img src='https://raw.githubusercontent.com/Morriar/coders_against_humanity/master/doc/example2.png'></td>
	</tr>
</table>

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
