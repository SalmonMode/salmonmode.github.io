---
layout: posts
title: "The Harmful Obsession With DRY"
excerpt: "The intent of DRY is to help us find potential opportunities for abstraction. Many take it to mean we should never repeat a block of code. However, this interpretation comes at great cost."
date: 2020-08-14 08:40:00 -0500
---

![Detailed close-up of SpongeBob dried out.](/images/spongebob_dry.gif){:height="auto" width="100%"}

## Best practices

We hear a lot about "best practices", and that we should always follow them. After all, they are the _"best"_ practices, and we want our code to be the best, so it makes sense to follow them all as closely as possible... right?

For the most part, it's a good idea. You can think of programming "best practices" very much like building codes or other industry regulations. They exist because while operating in the context those practices apply to, either something went wrong or someone foresaw something going wrong, and a lot of research went in to identifying the source of that problem. The resulting practices were made so that, when followed, what went wrong (or could've gone wrong) couldn't happen again.

For example, electrical safety code requires [at least 3 feet of clearance in front of all electrical equipment](https://www.ecmweb.com/national-electrical-code/code-basics/article/20898893/determining-working-clearances), like a fuse box. That might seem odd, but it's meant to make sure electricians have enough space to operate on that equipment safely. Without that clearance, the electrician could easily and accidentally come into contact with something that has a current running through it, and could be electrocuted.

Practices like these aren't just for safety. They can also help with efficiency by providing everyone in that industry a common "format" for what they're walking in to. It allows them to have an expectation that is upheld so when they make assumptions based on those practices, it doesn't set them back, because those assumptions won't be proven wrong.

But when those practices _aren't_ followed, and those assumptions _are_ proven wrong, it's (understandably) frustrating for the professional working on it, because 1) their safety is potentially compromised, and 2) they have to now work backwards to figure out what they're looking at and how it works before they can even begin making any tangible progress.

Best practices in programming are the same thing, just without the safety concerns... unless you consider high blood pressure or anxiety a safety concern.

In programming, they came about because someone saw that a certain pattern (or lack thereof) in a certain context, could lead to more defects, or could make things harder to read, grok, maintain, extend, test, etc. They then spent a good amount of time identifying what the problem actually was, identifying a practice that would prevent it from happening again, and then articulating it in a way that could apply to programming in general.

Unfortunately, the difference between "codes" and "best practices", is that "codes" have a regulating body to both define and enforce them. That regulating body spends a good amount of time "codifying" their practices, and making sure there's no ambiguity. If a professional in a field regulated by that body doesn't follow those practices, their job (and their own safety) would be at risk. They also give the professional recourse if they are terminated for refusing to go against those practices, so there's less fear when saying "no" if pressured to do so.

As software engineers, we don't have a regulating body to do this for us, which leads to these practices being insufficiently defined, applied inappropriately, and cherry picked.

DRY is one such practice that I've seen in _far_ too many places being applied without consideration for other practices that should be followed.

## DRY

"DRY" stands for "Don't Repeat Yourself", which basically means that if there's a large block of code essentially being duplicated in multiple places, it might be best to turn that into a function instead. If it's turned into a function, the code only needs to be maintained in one spot, can be tested directly, and can even be stubbed when testing the functions that use it.

Sounds great, right?

Often it is, but the problem comes in when it goes against other best practices. In particular, I want to focus on KISS and DAMP.

## KISS

"KISS" stands for "Keep It Simple, Stupid" or "Keep It Stupid Simple" (which is the friendlier of the two). Many interpret this to mean that, if your code _looks_ simple, in that there's not a lot going on _visually_, then it will be easier to grok. But this doesn't consider the nature of programming, which is _logical_. What the acronym _really_ means, is that complexity is the enemy, and that keeping a system logically simple (i.e. with few possible routes for the logic of the code to take) is essential for [internal software quality](https://twitter.com/GeePawHill/status/1292450480426188802) and being able to grok what the code is doing.

One means of measuring code complexity is [cyclomatic complexity](https://en.m.wikipedia.org/wiki/Cyclomatic_complexity), which has been shown to correlate positively with defect rates, suggesting that the more complex the code is, the more likely it is for there to be defects. This measurement is also useful for determining the number of test cases needed to test that system thoroughly, which might help put that correlation into context.

## DAMP

"DAMP" stands for "Descriptive And Meaningful Phrases", which means that the code should read in a self-explanatory manner, while still being idiomatic. The goal is to increase readability, in order to help others (and yourself in a few months) understand the code more efficiently. For example, you might have a function that adds an item to a user's cart that looks something like `assoc_item_pkey_with_user_item_acquisition_container(pkey, container_key, count)`, and that might be technically correct and descriptive, but it's not very meaningful. Instead, it could be `add_item_to_user_cart(item, cart, count)`, or even `user.cart.add(item, count)`.

I often like to say "your code should read like a short story written by C. S. Lewis."

This doesn't just apply to the logic shown, as it also applies to the logic that _should_ be shown but might otherwise not be. If logic is hidden, then it only serves to confuse the reader, and this goes doubly so for side-effects of a function. That's not to say that you shouldn't call other functions in your functions, but if the function for step 1 of a process contains the logic for step 2 as well, then it can't be named in a description and meaningful way.

## Consequences of being too DRY

In the pursuit of following DRY for the sake of it, KISS and DAMP are often forgotten about.

A good example of this is any function that has boolean flags as arguments. If multiple functions existed, instead of everything bring bundled into a single function, there might be chunks of code that are repeated between those functions. By combining them into one function, those flags can be used with if/else flow control statements only for the parts that differ. However, in the effort to avoid repetition of that shared code, readability and maintainability would be sacrificed, while also increasing complexity (which increases the risk if bugs).

I could go more into detail about what the risks and consequences of these types of functions are, but that would be a tangent and I'd really just be repeating what's already covered by a much better article that's dedicated to just that. So instead, I'll just refer you [to that article](https://www.informit.com/articles/article.aspx?p=1392524).

Repeating a complex chunk of code is a potentially missed opportunity for good abstraction. I believe many fall back on DRY because it's one of the easiest to spot opportunities for it, and it's one of the easiest to implement. But, as a result, it's also far too easy to apply it in inappropriate places, and the consequences of that are reduced internal software quality.

I've seen this obsession (or overdependence, depending on your perspective) go so far as to completely separate the core logic out from the code, and place it entirely behind dozens of layers of indirection in combination with a proprietary system that depended entirely on the database to have any meaning. This made it fundamentally impossible to unit test that logic, and incredibly difficult to follow along with. Unsurprisingly, it made development far more difficult and time consuming than it needed to be, and greatly increased the chances of serious bugs being missed.

## Focus on making the code understandable

Following DRY isn't inherently an issue. But it's impossible to apply it effectively, or even just in a way that doesn't actively harm the internal software quality, without considering the other best practices.

However, if we instead focusing on following KISS and DAMP first and foremost, then, more often then not, we'll get a healthy amount of DRY for free, without sacrificing internal software quality.

Making the code understandable—be it by a new dev, a senior dev, or even the one who wrote the code a few months or weeks after they first wrote it—is the top priority when writing code. It means nothing if we can get something out the door now if it makes it harder to do something in the next change or some other change down the line, unless this problem is acknowledged and that next change resolves that problem (although this will rarely be afforded). Otherwise, it will only slow us down going forward, which makes us less effective at our job, which reduces the value we provide; we'd be buying time from the future where the debt incurred will _always_ be greater than the time we got from it.

Focus less on avoiding repetition, and instead focus on providing good, sensible abstractions that make the code easier to follow and make changes to, and the ISQ will be much better off for it (and by extension, so will you).
