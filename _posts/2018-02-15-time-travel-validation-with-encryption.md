---
layout: post
title: Time Travel Validation with Encryption
date: 2018-02-15 12:13:00 -0700
tags: [ideas]
current: post
cover:  assets/images/tags.jpg
navigation: True
class: post-template
subclass: 'post tag-ideas'
---

I was learning about blockchain technology in the not too distant past and I became fascinated with encryption and
coincidentally, also was binge watching Doctor Who. Without getting too deep in the different possible types of time
lines, let's just assume for this article that time travel is possible and that causality is continuous such that the
"interference" of people from the future actually shaped their own past to the degree of preventing the grandfather
paradox and all events stack nicely on a single timeline.

If that doesn't make any sense, hang in there and just think about how Marty McFly went to the past and changed things
which changed everything when he went back to his present. I'm suggesting that time travel does not work that way.
However we can take a look at Back to the Future as an example of the common problems faced with time travelers of
how do you prove you are from the future? Simply put, a person from the future must know things that only can be known
about by someone from the future.

### Proof by knowledge

In the movie X-Men: Days of Future Past, Professor Xavier from the future tells Wolverine that in order for past Xavier
to trust him, he must reveal a dark secret past Xavier is currently hiding. If you're like me, you immediately see a
flaw in this plan where mutants can read minds. In particular, that specific mutant can read and manipulate minds.
Regardless of supernatural powers we can prove that any body's memories can be manipulated with subliminal programming
as demonstrated by Derren Brown.

<figure>
    <div class="videoWrapper"> 
        <!-- Copy & Pasted from YouTube -->
        <iframe width="1468" height="705" src="https://www.youtube.com/embed/sEmCQzueyEQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <figcaption>
        How To Hypnotise Simon Pegg - Derren Brown
    </figcaption>
</figure>

To say the least, we cannot trust a time traveler based on our own memories of the past and possibly our secrets as our
memory is fallable. I simply would not trust a person claiming to be a time traveller based on this method at all.

### Proof by physical evidence

In the movie Back to the Future Part 2, we see Biff Tannen travel to his past self with a book from the future, a sports
almanac. To prove the legitimacy to his younger self, he turns on the radio and validates the claims in the book against
a live broadcast. Personally speaking, I can think of ways to spoof a radio broadcast and if you have the ability to
travel backwards through time, I would tend to believe you might be able to fake some information to prove your own
claims.

If someone handed me a book with dates, times, and events as a way of proving that I should trust they are from the
future, it would take several validations before I began to trust the validity of the traveller's claims. This seems
like it could be a good way of building a rapport with an individual, but it does not build a solid proof as again,
I could probably find elaborate, yet possible ways of spoofing the information contained in the book to match the events
happening around me.


### Proof by self generated physical evidence

As I pondered the scenarios from movies and television about time travel and knowing whether or not I should trust any
one who claims to be from the future, I came up with a solution to know in a reliable way based on public key encryption.

I will attempt to forgo the gritty details about why the current implementation of AES 256 bit encryption is a great
candidate for this task, just know that at there is a 1 in 2^256 chance of 2 computers creating the same key. Or another
way to say that is 1 in 1.1579209e+77 which is 1 with 77 zeros after it That's pretty close to a googol. Keep reading
on the subject [here](https://en.wikipedia.org/wiki/Power_of_10) and
[here](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)

Here's the flow of events in chronological order. 

1. Current you meets future someone who hands you an encrypted file.
2. Current you creates a brand new encryption key in order to decode the encrypted file.
3. File decodes successfully and you read the contents.
4. You publish the public key somewhere for the future author to compose an encrypted message for you.
5. Future someone composes a message and encrypts it using the public key he or she discovered.
6. Future someone travels to his or her past and delivers message to the key originator in step 1

This is a closed loop system and like I said, the causality is self fulfilling.

So then let's talk about spoofing this and other security threats. Just like with memory being manipulated in the first
example, so too could your memory be manipulated about the chain of events. In this regard, I would only trust the
contents of the message in the immediacy of the moment I decrypted the message. Any time after that would be subject to
tampering.

Also, I still assume that if you're from the future that you could have some kind of technology that manipulates
computers, so I would want to be able to introduce some manual random intervention to the process in order to mitigate
those risks.

If you are feeling like handing me some encrypted messages from my future, please feel free to say hello this weekend.
I will be at the Tech Stars Startup Weekend in Downtown Phoenix. I'll let you know in a future post how to introduce
yourself so that I know you're not just handing me a virus filled USB stick.
