---
layout: posts
title: "The Importance of Words: Waterfall vs Agile"
excerpt: "Waterfall methodologies are often seen as the antithesis of Agile, and therefore 'bad'. But what does it really mean for something to be 'waterfall'? Are you actually using a waterfall methodology?"
date: 2022-02-22 15:00:00 -0500
---

!["Niagara falls. Source for the image unknown."](/images/niagara_falls.gif){:height="auto" width="100%"}

What do you think of when you hear the word "waterfall"?

I'm guessing many think of something like Niagara Falls (pictured above), that is, a massive water feature.

But waterfalls come in a variety of shapes and sizes. Waterfalls can be cascading, and have many levels to them, and they can even be just a few inches tall. They can have massive amounts of water flowing through them at varying speeds, or very little. The only real criteria is that water flows over a vertical, or very steep drop. 

But in software development, perhaps this initial mental image of a massive waterfall has biased what we think of when we compare "waterfall methodologies" to "Agile methodologies".

An exceptionally common response I've gotten to "what makes something waterfall?" is:

> Big projects that take a long time

When asked why that's bad, they often say it's bad because large projects take a long time to provide value to the customer. So it seems, to them, the issue is the time scale. Perhaps this is the result of that mental image of the grand waterfall, or maybe it comes from this bit in the Agile manifesto:

> Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.

While this principle is important to Agile methodologies, the time scale is _not_ what characterizes "waterfall" methodologies (at least, not with regards to what the Agile manifesto authors had in mind). But let's run with that definition, if only for a bit, to see if the term then applies to many who believe themselves to _not_ be using a waterfall approach.

### Is your project "big"?

So going by the manifesto, "big" would mean "longer than a couple of months".

You might read that and go "ah! We practice SCRUM, have 2 week sprints, and release at the end of each sprint, providing value to the customer." That might be true, but there's two issues:

The first issue is that it might not be working software. Were defects found after it was released to the customer? How bad were they? Did any of them prevent the customer from doing what they wanted? You may have provided value, which is great, but the manifesto was about discipline and craftsmanship; not moving fast and breaking things (that's why there's also bits about technical excellence and maximizing the amount of work _not_ done).

But that might be burying the lede a bit.

The second issue is that the work for that project likely didn't start when the sprint started, nor did it likely end after that sprint finished.

The requirements and designs likely weren't put together only once the sprint started, and when defects are found once released, it means the work wasn't finished since now "rework" is necessary.

So as a small exercise, try to find a roadmap for your product. Find the item that took the longest time to fully deliver on in working order, and then find the time the roadmap was put together (a "created date" for the roadmap file could work in a pinch). Now, consider how long before the roadmap was put together that work started going into discovering what the customers' requirements were that inspired the things promised in the roadmap. If you don't know, feel free to go and ask the people who came up with the ideas in the roadmap.

What is the duration of that timeline from start to finish?

My guess is it's longer than "a couple of months". A _lot_ longer.

But rest assured, the time scale is a red herring. Long term projects like this are perfectly fine in Agile methodologies (that is, you can go about a long term project while still being "Agile").

### Origins

So what does it really mean for something to be "waterfall"? To answer that, let's take a quick look into the past.

In 1970, a man named Winston Royce [published a paper](http://www-scf.usc.edu/~csci201/lectures/Lecture11/royce1970.pdf) describing and criticizing (although, not _condeming_ a pattern of software development that he observed. He didn't call it "waterfall", but it's clear, looking at the diagrams in the paper, how that term came to be used to describe similar patterns.

I won't go too deep into it, but Martin Fowler did a writeup on it [here](https://martinfowler.com/bliki/WaterfallProcess.html) where he also explains the difference between Waterfall and Agile.

For now, here's one of the key diagrams from the Royce paper that seems to have inspired the notion of "waterfall". But I recommend reading through the paper and looking at the other diagrams as he comments on the problems (the central player being that things can go back to previous phases).

!["A series of boxes, each one placed lower and to the right of the previous box, with arrows going from each box to the box immediately following it, like water flowing down a tiered/staircase waterfall, indicating that the box to the left is the phase that immediately precedes the box to its right. The boxes are labeled, in order: System Requirements; Software Requirements; Analysis; Program Design; Coding; Testing; and Operations. At the bottom of the diagram, it reads: Figure 2. Implementation steps to develop a large computer program for delivery to a customer."](/images/royce_waterfall_figure_2.png){:height="auto" width="100%"}

**TL;DR:** It's specifically the presence of phases in the development lifecycle that characterizes "waterfall" methodologies. It's the fact that there's _handoffs_.

As Fowler notes in his writeup, Agile methodologies have the team collaborate together on sufficiently solving one problem at a time, without anyone going off to do something else for another problem until that first problem is solved. 'Waterfall' methodologies, by contrast, have handoffs, where one person (or a group of persons) does one activity, handing off the results of their work to another person (or group of persons) to do another activity, while the first person can then do their activity on a new problem.

"Waterfall" methodologies mimic how factories work. They operate on the assumption that one work center can do some category of work, and finish it so that the next work center can do another category of work and finish it. This is fine in a factory, where the work is the same every time, and we can iron out the kinks over time to reduce the rate of issues. But in software, the work is new every time. There are certainly lessons to be gained from certain manufacturing methodologies (e.g. Kanban/Lean), but those same methodologies would tell us that things can only be split up like this if you can guarantee the work won't get sent back and disrupt the upstream work centers.

### Why are handoffs a problem?

I've broken this part out into another post that you can find [here]({% post_url 2022-003-04-is-waterfall-so-bad %}). The long and short of it, though, is that handoffs assume things won't go wrong, but if they do, the impact will be minimal, and that's rarely the case. Check out the other post to see some of the ways that can play out.

### The desire for waterfall

A common part of this is that it's all many (I would even venture to say "most") managers have ever known. So many of them have never seen what Agile looks like, or weren't able to recognize it if they have seen it (possibly because the team size was quite small). And when they look at what other companies are doing, they largely see more waterfall methodologies being referred to as "Agile". 

In _Agile Software Development: The Cooperative Game_, Alistair Cockburn notes that people are risk averse when they might stand to gain, but more adventurous when they might lose something. As he put it:

> People prefer to fail conservatively rather than to risk succeeding differently.

He also notes that they may also fear the challenge of building new work habits.

I've seen this firsthand myself, where managers don't want to take the risk themselves of trying out a genuinely Agile approach. And that makes sense, because if it's no better than waterfall, they'd have wasted the effort to build all those new habits and change their mentality.

But I've noticed that even when managers can see for themselves the benefits, they can still often reject it, and still want to refer to themselves as being "Agile".

I suspect part of this, though, is rooted in identity and personality, and that makes this a _much_ harder problem to solve.

### Identity and personality

Our "identity" is how we think about ourselves, and includes our morals and values. Sometimes we attach words to it (e.g. "I'm a software engineer"), but we can never truly capture it with just words.

Personality is about our reactions to things, our thoughts and feelings, and how we actually behave. Our identity plays into this, though, as we'll often ask ourselves what someone in a particular category we would like to identify as do in a situation. For example, "what would a good person / partner / manager do here?"

Changing these about ourselves is one of the hardest things we can do. It requires changing the way we think. It's part of why New Year's resolutions are so difficult to follow through on. We can't just say we'll start exercising if we don't identify as someone who exercises, because we won't be asking ourselves on some subconscious level "what would someone who exercises regularly do on a saturday morning?" We have to literally change our identity to follow through.

But if we go to those that see themselves as "Agile" and tell them they're not, it can feel like a personal attack, regardless of the accuracy of the statement, because their ideal self (i.e. someone who is "Agile") is now less aligned with their perceived self (i.e. how they see themselves). This is what psychologist Carl Rogers referred to as "incongruence".

We attach all sorts of baggage to this, so it can make us feel like we are bad at our jobs, wasted our career, aren't smart, are bad people, and so on.

Perhaps this is why, after pointing out that having handoffs means an organization isn't Agile, and pointing out all the problems a waterfall approach yields, many taking part in it still refer to themselves as "Agile". They may be resorting to defense mechanisms, like denial, to avoid the bad feelings brought about by the incongruence.

To be clear, while the vast majority in the software industry that claim to be "Agile" are actually practicing "waterfall" methodologies, I don't believe they, or even the majority of them, are in denial. I would wager that the vast majority of them genuinely don't know that handoffs mean "waterfall".

There are certainly many who misunderstood the Agile manifesto and the distinction between being "Agile" and being "waterfall" that are contributing to the perpetuation of the misunderstanding. But there are also some who are in denial (and/or using other defense mechanisms) who are contributing to it, as well. The perpetuation of it, of course, only increases the number of people who might potentially have incongruence issues if this information comes their way in the future. It amplifies itself.

### What now?

Words are important, and how we use them can impact how others understand those words. While I can point out that what many people think "Agile" or "Waterfall" means is not what was intended and is only making things worse, that does very little to actually getting people to come around. The issue also doesn't appear to be as simple as just selling an idea really well.

We're talking about a fundamental change in the way people think, and that's an uphill battle. If someone doesn't want to change the way they think, no salesman in the world can convince them to. Unfortunately, this could describe a lot of people in positions of authority.

This does, however, provide some guidance. There certainly are some out there who are open to changing the way they think, but be mindful of their feelings, as well. It would be wise to be careful while trying to figure out who is willing and considerate wherever we can, as incongruence can make us feel threatened, and responses may not be as simple as denial.
