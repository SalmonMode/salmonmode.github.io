---
layout: posts
title: "The Importance of Words: Quality"
excerpt: "We care a lot about the word 'quality' in the software industry. But what actually is quality? How do we use the word in our day to day life?"
date: 2022-01-24 10:24:00 -0500
---

!["Ace Ventura looking into the hole in the dolphin's tank"](/images/ace_ventura_looking_close.gif){:height="auto" width="100%"}

"Quality" is a very important word to us in the software industry. Or at least, so it would seem at first glance. But on closer inspection, there's an apparent incongruence. Let's do some exercises to help explain.

Imagine you need to buy a car, but for some weird reason, there's only two models on the market. But both are the same price.

Which would you buy?

Obviously a choice at this point would be arbitrary since there's nothing to distinguish them. So let's add some more information.

Imagine one of the two cars is _better_ in some aspect you can think of. The paint is more scratch resistant, Tighter steering, easier maintenance, longer lasting parts, etc. There's nothing messarily _wrong_ with either car. One of them is just... _better_.

Now which would you buy?

The choice should be obvious: the one that's _better_! But let me ask a few more questions to drive the point home.

Which one is the better "deal"?

Which one is the better "value"?

Think about your answers to these for a moment. I'm guessing your answer to both is the same as the first. But now answer this question:

Which one is higher "quality"?

I imagine this is where there'll be some disagreement amongst readers.

Some might say the "better" car is higher quality.

A second group might infer because there's nothing necessarily _wrong_ with either car, that they are of equal quality.

But a third group might say that because they don't have the designs and can't do a thorough investigation to compare the cars to their respective designs, they can't know which is of higher quality.

## Crosby on "quality"

P.B. Cosby defined "quality" in _Quality is Free_ as:

> "conformance to design"

We care about quality in software development because _quality sells_. And yet, without the design, customers are still able to confidently make a choice about which car to buy.

So Crosby's definition doesn't seem too helpful here. Focusing only on conformance to the design puts the focus on the producer instead of the customer. But is that really a problem?

## Ishikawa on "quality"

For some flavor, Kaoru Ishikawa describes "**quality of design**" and "**quality of conformance**" in _What is Total Quality Control? The Japanese Way_.

"**Quality of design**" is essentially what you would _like_ to produce, or:

> "the targeted quality"

"**Quality of conformance**" then is:

> "how far the actual product conforms to the quality of design"

He describes "**defects**" as:

> "discrepancies between quality of design and quality of conformance"

But Ishikawa made a point to note that "quality of design" is _not_ the same as the customer's _true_ requirements. But as quality of design more closely aligns with those requirements, sales increase.

Interestingly, this is also where he notes that inspection at the end to determine quality of conformance can never yield quality of conformance, and certainly can't do so in a cost-effective manner.

Zero defects is impossible. But keep in mind how Ishikawa defines the word "defect." Defects are about the product's relationship with the design, _not_ its relationship with the customer's true requirements.

As Weinberg says in _Quality Software Management Volume 1: Systems Thinking_:

> Though copious errors guarantees worthlessness, having zero errors guarantees nothing at all about the value of software.

Errors are certainly defects as Ishikawa defines them. But defects are not necessarily errors.

To illustrate why these distinctions are critical, perhaps a story might be helpful.

## Warframe

In 2015 a game called Warfare was still trying to get established when a defect was discovered by its players. Humorously, it was an exploit that allowed players to fling themselves across the map very quickly, and it was referred to by players as "coptering". However, since the game wasn't designed with this exploit in mind, its mechanics fell apart once it was discovered.

It sounds silly, but the players _loved_ the exploit.

Rather than patch out the exploit, the studio behind the game embraced it. They converted the exploit into a mechanic dubbed "bullet jumping" and completely redesigned the game around it. The continued success of the game with its thriving player base can be largely attributed to this decision.

So while it wasn't an "error" in the software sense, it was certainly a discrepancy between what was designed, and what was produced.

Quality sells. So how is it that a defect—something that completely undermined the design of the product—could bring so much success? Copious errors guarantees worthlessness because they are the result of a significant lack of effective control. But when there is a sufficient amount (that is, not 100%, but certainly in that direction) of effective control, sometimes small mistakes can reveal grand opportunities for value. Or, as Bob Ross liked to say:

> Happy little accidents

If quality sells, then we need to figure out what will sell. We need to figure out what people will pay for, and people pay for what they value.

A helpful definition at "quality" should be able to bring all these ideas together, which sounds like a tall order. But, thankfully, others far more articulate than I have done the leg work already.

## Weinberg on "quality"

Weinberg defines "quality" as:

> "value to some person(s)"

That goes a long way to getting us there, but I think we can get a bit further. Some might want a minivan, while others might want a sports car. As John Lydgate said:

> You can please some of the people all of the time, you can please all of the people some of the time, but you can’t please all of the people all of the time.

We need context for where to focus our efforts.

## Michael Bolton and James Bach on "quality"

Michael Bolton and James Bach extended Weinberg's definition to provide this focus. They define quality as:

> "value to some person(s) who matter(s)"

Crosby's definition implies the only thing that matters is the design and conformance to it. But the way we use the word—why we _care_ about the word—often conflicts with his definition.

I personally find Bolton and Bach's definition to be the most helpful. It guides us as makers of software without betraying the way we use the word in day to day life, like in the car examples.

It brings that necessary context to the table. Who matters? Who matters more than others? Who matters the most?

Who matters most, of course, could be a choice between different consumers. But many times, the consumer is not who matters most. So it's crucial that if we are to try and _assess_ quality (let alone _assure_ it), we must find out who actually matters.
