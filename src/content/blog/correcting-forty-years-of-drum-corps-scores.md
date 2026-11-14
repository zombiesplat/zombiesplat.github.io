---
title: "Correcting Forty Years of Drum Corps Scores"
description: "How I imported every DCI and DCA season from 1972 to 2012 into DCI Scores, one year at a time, and what I found wrong in the source along the way."
publishedDate: 2026-11-20
author: "Alan Asher"
image: "/images/blog/correcting-forty-years-of-drum-corps-scores.png"
tags: ["drum-corps", "dci-scores", "data", "laravel", "history"]
draft: false
---
# Correcting Forty Years of Drum Corps Scores

[DCI Scores](https://dciscores.com) had a history problem.

The History pages count world titles, champions and records. But until this fall the database had no DCI or DCA scores before 1992, so as far as the site knew, the 70s and 80s never happened. Blue Devils' title count was wrong. The Garfield Cadets' run in the 80s didn't exist. Anyone who marched before 1992 couldn't find their season.

The best record of those years is [From The Pressbox](TODO-link): recap pages and season tables going back to 1972, typed in by hand. Without it, none of this would be possible.

But typed in by hand means typos, and thousands of score sheets means thousands of chances for one.

---

### Rule one: nothing goes in until it's been reviewed

The easy version would have been to scrape everything and load it. That's actually what happened the first time for 1992–2012, and an audit later found about 200 shows stored twice, lower-class champions crowned at the wrong show, and corps names run together.

So for the real import, the rule was: **nothing gets imported until I've ruled on everything that looks wrong, and production imports exactly what was reviewed or nothing.**

The work broke down like this:

* **One generic parser** for every season. No per-year importer code.
* **One correction file per year**, holding my rulings as data: rename this corps, drop this row, move this show a day.
* **Validators with anchor facts.** Every year has facts I know are true, like who won World Championships and by how much. If the import doesn't produce them, the year fails.
* **A hash lock.** Once a year is reviewed, its file is hashed and locked, and a test pins its key facts. Nothing can quietly change a reviewed year again.

Then I went through 1972 to 2012, one season at a time.

---

### Rulings that became rules

The first few years were mostly judgment calls. By the mid-80s, most of them had become rules that apply to every year:

* **No score, no row.** A corps with a zero or missing total didn't perform (usually a rain-out), so it doesn't get a placement, even when the source lists a rank.
* **A renamed corps is one corps.** The Garfield Cadets and the Cadets of Bergen County are the Cadets. The Saint Andrew Bridgemen are the Bayonne Bridgemen. The name each show used is kept for that show.
* **The published total always stands.** If the captions don't add up to the total, the site shows an asterisk instead of "fixing" history.
* **Ties are co-champions.** 1988 DCA (Sunrisers and Bushwackers, 96.4) made me fix the code that picks champions, and that also correctly crowned DCI's real co-champions in 1996, 1999 and 2000.
* **Disqualified means disqualified.** The 1977 Bridgemen stay on the show page with their score, marked DQ, but they don't count in rankings or records.

Some things never became blanket rules. A bare "Crusaders" on a sheet could be one of several corps depending on the region and the score range, so each one was decided show by show.

<!-- TODO: a favorite judgment call or two from your own memory. -->

---

### The copied sheets

The most interesting thing turned up in 1999.

Boise, Idaho, July 13th, 1999: Blue Devils 56.3, Vanguard 55.9.

The next day, both corps scored around 85. Nobody drops 30 points overnight.

When I compared that sheet against every other show that season, it matched a Division III prelims show in DeKalb from three days earlier exactly, every total and every caption score, row for row. Only the corps names had been changed.

Once I knew what to look for, a check for exactly this went into the review for every year. It found:

* **41 recaps** that repeat another show's whole sheet under different corps
* **5 recaps** carrying another show's Total column, while the captions still add up to the real scores
* **21 recap rows** with the wrong corps
* plus shows filed on the wrong date, two shows run together into one, and the occasional "Twighlight Optimists"

When a sheet is a copy, its real scores are unknown, so DCI Scores leaves that show out instead of guessing.

I've written up every one of them, with the evidence, in **[From The Pressbox Errata: Drum Corps Scores, 1973–2012](/blog/from-the-pressbox-errata-1973-2012)**. I've sent it to From The Pressbox too, so the original record can be corrected.

---

### Getting it to production

Production never scrapes anything. Each reviewed season is bundled locally, uploaded through an admin page, and imported with one button: one season per job, with a hash check before anything is written.

That part had its own adventures with memory limits and queue timeouts, but that's a different post.

<!-- TODO: confirm the 1972–2012 import is live on production before publishing. -->

---

### Why bother

Drum corps fans care about this stuff more than almost anyone. People remember exactly where their corps placed at a show in 1987, and they will tell you when you're wrong.

That's the point. If DCI Scores is going to be the place people look up their season, the numbers have to be right, and when the source is wrong, the fix should be on the record for the next person too.

<!-- TODO: your personal connection: did you march? which corps/years? -->
