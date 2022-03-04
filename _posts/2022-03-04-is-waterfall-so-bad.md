---
layout: posts
title: "Is Waterfall So Bad?"
excerpt: "Waterfall methodologies have a negative connotation. But why is that? Is it how they were executed? Or is it inherent to what makes them 'waterfall'?"
date: 2022-03-04 09:41:00 -0500
---

!["A tiny waterfall, with water flowing over several small rocks in sequence. Source for the image here: https://giphy.com/livingstills."](/images/small_waterfall.gif){:height="auto" width="100%"}

In my [previous post]({% post_url 2022-02-22-importance-of-words-waterfall-vs-agile %}), I went into what defines a methodology as "waterfall", but I also went into how problems arise from them, so I wanted to break that out into its own post for easier reading.

But for a quick recap:

The defining characteristic of waterfall methodologies is the handoff from one stage to the next (time scale isn't a factor).

You many be reading this and thinking, "but we use SCRUM/Kanban, so it's Agile even if we have handoffs." But unfortunately, waterfall and Agile methodologies are mutually exclusive. And with regards to Kanban, if there's handoffs, there's something wrong (at least in a software context). But I think that'll have to be another post. 

### Why are handoffs a problem?

Certainly on the surface they might not seem so bad. In fact, many believe handoffs to be unavoidable and _expect_ things to come back. But for those that expect things to come back, they also believe that _if_ things come back, it won't be much of a problem. So it'll take some convincing to shine some light on the 'badness'.

Let's dig into how exactly this becomes a problem.

With phased development, it's often set up so that different people are responsible for the different phases. But what happens in this case, when the people responsible for one of those earlier phases, hand off their stuff to the next phase? Do they just sit around doing nothing and wait for the later phases to tell them when they're done or come back with issues? Or do they start on something else?

Typically, it's the latter. Why? Because even without management telling them they need to be constantly working, people will assume that expectation is there.

So what happens when those in an earlier phase start on something else, but those in a later phase need to pass something back upstream because an issue was found? They'll either interrupt the earlier phase to get the issue resolved immediately, or they'll try to pass it back upstream but have to wait until the earlier phase is "finished" with their new work.

Many organizations wouldn't want those in the later phase sitting around doing nothing either, so they often respond to this scenario by pushing more things down the pipeline to "saturate" it.

It's natural to assume that if this is the only way of going about managing software engineering projects, then maxing out everyone in the pipeline would achieve maximum productivity. But this presents a whole new set of problems.

I'm going to provide a few examples, but as I go through them, I want you to consider how each one plays off the others. Keep an eye out for feedback loops, and try to articulate how those dynamics work. For example, consider how some of these affect:

* how many meetings there are overall
* how difficult it becomes to schedule new meetings
* how long meetings are
* how often meetings are interrupted
* the types of people in those meetings
* how many people are in those meetings
* how much time is lost in the buildup to each meeting (people don't want to start on something new if they're going into a meeting in 30 minutes)
* how much time is lost after each meeting to rebuild context on what they were doing before

#### Time lost to context switching

Context switching is _expensive_, and it adds up quickly. Every time a task comes to a worker, they spend some non-zero amount of time building or re-building the context necessary to understand and do that work. If a piece of work keeps bouncing back and forth between phases, each bounce adds more onto the total time spent context switching just for that one piece of work.

#### Additional meetings

In order to facilitate handoffs, more meetings are necessary. Handoffs require coordination ahead of time to avoid a good amount of waste.

For example, less effort/time would be wasted if the designers brought their initial idea to the implementers to find out if it's even possible before investing in fleshing out the idea, lest they have to go back to the drawing board after all that.

As the aversion to this kind of waste increases, so too does the desire for increased coordination ahead of time in order to better facilitate the handoffs and decrease the risk of things going back upstream.

#### Priority ambiguity

Handoffs invite ambiguity regarding priority and make it unclear what the top priority actually is, unless only one thing is allowed to be in a phase at any given time (which would require a lack of passbacks). Even if you always drop what you're doing when the true top priority comes through, you still have to context switch back to it, and then again after you finish back to whatever it was you were doing before.

#### Power dynamics

The power dynamics change, favoring those upstream over those downstream. Since the whole system is based on the notion that work is to either make it through without issue, or go back upstream if issues are found, there's a built-in excuse for those upstream when their work is revealed to be less than perfect. This lets them push subpar work downstream to whatever end they desire. For example, "isn't that what QA is for?" or "this is why we asked the engineer if this made sense before they started implementing it."

It's simply easier for those upstream to come up with excuses, than those downstream.

Some organizations try to combat this by encouraging those downstream to push back and say "no", but they also often undercut this directive with competing directives. For example, "I'm not looking for something perfect. We need something just good enough." or "we have to hit these deadlines." They may also undermine it by using KPIs or rewarding workers for "getting it done" rather than saying "no". Or it could simply be undercut by giving everyone the impression that everyone should always be working.

#### Increased pressure

Regardless of the nature of the dynamics, the fact remains that in a phased development process, where work flows downstream but can also feed back upstream, the pressure will continue to increase over time on those downstream.

This in turn leads to higher rates of stress, burnout, and depression as people struggle more and more to keep up.

Some organizations might try to hire more people and place them downstream to compensate, but this only slows down the inevitable in a best case scenario, and accelerates it in a worst case scenario. It also doesn't scale linearly, even if management is willing to accept the increase in turnover it leads to.

Increased stress also means increased cortisol levels, which means people also literally get less creative, as their brains resort to old habits, rather than trying new things.

Consider how this might affect the care developers take with their implementation, the quality of meetings, or the quality of communication overall. 

#### Increased fault rate

As the pressure increases, stress increases as a result, and as stress increases, developers and testers are less careful. As the flow of incoming work requests increases, there's also less time for them to work on things. As a result, more faults are bound to get through.

Consider the effect this has upstream. Reports of faults from the customers would increase, and so too would demand on the developers to fix those faults. But consider how that might affect deadlines that were already committed to. What effect might missing a deadline have on the pressure applied to those downstream?

Consider how many of those faults are emergencies. How might this affect meetings for other things? Would they be interrupted, thus wasting the time spent on that meeting? Would they need to be rescheduled, thus impacting the project's estimated timeline?

#### Try to come up with your own

I can think of several more things that are impacted by this dynamic in a harmful way, but this blog post is getting quite long, and I think it'd be a good exercise for you to try and come up with some other ones. Think about the feedback loops that those things are a part of. Do they come back around to amplify the problem?

### Equilibrium?

This system has no manageable checks and balances. It has to grow exponentially in order to relieve pressure in the areas that need it most, but that's not sustainable. If an organization is struggling in the verification phase, they might hire more people to do that. But that means there'll be another area that's seen as the bottleneck.

However, what's more common in my experience, is people develop means of having their respective phase not appear as the bottleneck, obfuscating where the most strained part of the process is. Unable to tell which area the squeaky wheel is, management may resort to the more general approach of hiring additional people across the board.

Or they may notice the increase in faults and try to hire additional developers just to write automated checks to prevent them from getting out the door. Or they could try to find some magic tool that will help them deal with the problems they believe are the source of their frustrations (e.g. "our automated checks keep needing to be updated because the locators keep changing, so let's get a tool that promises to automatically update the locators").

For some, this works out to an extent. But for others, it just amplifies the problems.

Equilibrium is _technically_ possible in a waterfall approach, but it requires setting up a system that halts water coming in from upstream. This was the intention behind 'pull' models of work like Kanban. But the distinction with Kanban, is that there's a focus on work centers (something can only be a distinct work center if it can guarantee its work won't come back), not phases per se, and each one has a WIP limit.

But I'm now thinking I should definitely be planning a future Kanban post.
