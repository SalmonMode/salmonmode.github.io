---
layout: posts
title: "Prisoner's Dilemma in Testing: A Mini-Waterfall Simulation"
excerpt: "A sustainable development process needs checks and balances to ensure we move forward as quickly as we can safely. But what happens when there are none?"
date: 2020-12-16 09:00:00 -0500
permalink: /draft/a-testers-dilemma
---

![Zach Galifianakis trying to do math while math symbols fly around"](/images/lots_of_math.webp){:height="auto" width="100%"}

In my [previous post]({% post_url 2020-08-26-what-would-qa-do-all-day %}), I made a point about mini-waterfall not being sustainable, and the math not adding up. I'd like to expand on this separately, because I feel it needs to be addressed in detail.

So what exactly is "the math" here? Well, to answer that, we need to look at what I would consider a typical mini-waterfall process to be.

# Waterfall

You may have seen certain processes described as "waterfall", especially when juxtaposed with "Agile", and for good reason. Agile came about, in part, because of the prevalence of waterfall-esque processes that were imposed on the software industry, and its progenitors wanted to take back control of how they performed their craft.

Agile is not exactly the antithesis of waterfall, but it is fundamentally different as 1) it's a set of values and principles, rather than a process, and 2) a waterfall process inherently violates those values and principles.

So what is "waterfall"?

In general, it's a process where, a desired change goes through a series of stages. Person A does Stage 1, then passes it to Person B to do Stage 2, and so on. The idea is that changes are done like a factory line.

You can find any number of resources describing it in detail, but I really only want to focus on one element for the time being:

If, in a given process, the testing (or, more specifically, the verification) is done _after_ the development, then that process, by definition, is "waterfall".

The verification I'm referring to here is more than just unit tests. It's all criteria that was asked for, that exist at all levels, be they unit, component, integration, end-to-end, or even UI. This could be done entirely by another person, or only partially (to any degree), but either way, it'd still be waterfall.

This directly conflicts with Agile principles, because it can't be sustained indefinitely. Why this makes a process unsustainable may not be immediately obvious (if it were, I wouldn't be writing this), but I'll go over why down below.

You may also see me refer to "_mini_-waterfall". But that's more or less exactly like normal waterfall, except it's crammed into a smaller time frame, usually in the form of Scrum.

# What Makes a Process Sustainable

A process that's sustainable may seem difficult to establish, and some may even claim that it's impossible. After all, the process would need to meet all of these criteria

* Overtime is never required (assuming good planning and communication)
* No one on the team is required to work longer hours than anyone else
* There is never a need to perform any sort of regression checks by hand
* Writing code doesn't get significantly more difficult as time goes on
* All tickets that would be completed in a given sprint must have all the checks for them (i.e. any form of verification regarding the acceptance criteria that can be written down as a repeatable set of steps), at _all_ necessary levels, fully automated within that same sprint
* No changes that would cause a regression are ever allowed to be merged into the main branch
* No one on the team is forced, through the nature of the process, to be at risk of not taking as much vacation time as anyone else on the team, nor would the timing of their vacation be a problem
* No one needs to work on tickets through meetings, lunch, weekends, vacations, etc to avoid violating the previous things
* This can be kept up indefinitely, without compromise

That seems like a tall order.

But, I believe what makes it seem, to some, like such an insurmountable task, is the assumptions they've made about the constraints they're limited by.

# Asymmetric Prisoner's Dilemma

You may have heard of the [prisoner's dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma). I won't go into the details, but I will note that the variant most are familiar with has both prisoners with an equal amount to lose/gain.

On a positive note, it turns out that humans have a bias towards cooperation in that game.

But there's an alternate version of the game where one prisoner has less at stake than the other and/or had a significant advantage over the other. Unfortunately researchers found that when this game is played repeatedly, this almost entirely eliminated long-term cooperation.

## A Tester's Dilemma

Much like the prisoners in the Prisoner's Dilemma, programmers and testers are also engaged in a cooperation conundrum. However, it's fairly one-sided.

If the tester finds bugs, it often doesn't look poorly on the programmer, because there's an assumption that that's how things have to be.

In fact, if the tester _doesn't_ find bugs, not only does this not look positively on the programmer for writing excellent code, it looks poorly on _the tester_, because it's believed there _must_ be bugs, and the tester must not have been doing their job.

It's often believed that programmers will inherently write incredibly buggy, flawed code that doesn't meet the acceptance criteria. If it turns out there were no serious bugs for the tester to find, then it can be seen as pure luck.

Many places even use "number of bugs found" as a metric for gauging a tester's performance.

### Programmer's Advantage

As long as the programmer gives the appearance of productivity by churning out changes that can get passed code review (which could also be rushed, and more focused on finding flaws with implementation, rather than functionality), they have nothing to worry about.

Actively helping the tester could actually be quite difficult in this game, as they'd have to strike a careful balance of writing code ever so sloppily to leave bugs for the tester to find so the tester could also appear productive.

The programmer would gain nothing (or at least, very little) from helping the tester, though, and so, are incentivized to be focused more on not personally losing, rather than helping the team win.

### Tester's Disadvantage

The tester has no means of recourse. Whether or not there are serious bugs in the code are, largely, of inconsequence to the programmer. The tester has no leverage in this process to protect themselves with, and no means to make the programmer care about mutual cooperation, because, in this game, there is no mutual defection since the tester can't actually defect against the programmer.

The tester might be able to send the ticket back over and over again, but they'd need evidence each time, and it could even result in the tester appearing petty.

The testers can't control whether or not they lose, let alone whether or not they can help the team win.

# A System Without Checks and Balances

I've often heard "that would slow the programmers down" in response to suggesting they verify their own work. A waterfall process in software development is often built entirely around freeing up the programmers to "get work done".

It's assumed, in waterfall, that the programmers need to rely on testers to know if they've met the acceptance criteria. So the faster the programmers can crank out changes, the faster the testers can verify them.

But that unfettered speed with no real consequences to the programmers is exactly what makes waterfall unsustainable in software development (at least in this context).

## Regression Checks

Every new acceptance criteria that gets implemented into the product must always be maintained (unless the new criteria is to cancel out an old one). But with every new change, there's a chance for some unrelated feature to be broken unintentionally. This is what's referred to as a "regression", and "regression checks" are those performed to identify any regressions that may have ocurred.

The responsibility for these checks, in a waterfall process, tends to go to the testers. But over time, the list of the checks that must be performed grows, and grows. It should be apparent that, eventually, the testers would have absolutely no time for anything other than just doing regression checks.

### Automation

Automation, to many, seemed to be the answer. If the regression checks could be automated, then the testers wouldn't have to do them by hand.

Of course, having the programmers write the code for these would slow them down when it came to implementing more criteria, so the responsibility for this is often passed on to the testers as well.

So then, in addition to keeping pace with the programmers in regards to the checks the testers must perform manually, they must also keep pace with regards to automating those changes afterwards, and automating them would also likely be done at the most complex, time consuming, and brittle levels possible (i.e. API and UI).

Some companies may go the route of hiring QA Automation Engineers (or another, similar title) so that they can focus on the automation (again, at the most complex, time consuming, and brittle levels possible) of already implemented changes, while the testers focus on verifying the new changes coming in.

But either way, whatever isn't automated, is left to be done by hand during a regression checking phase. This phase, in my experience, often takes the form of a fixed block of time scheduled at the end of each sprint, right before release, and the testers are expected to work within that fixed block of time to complete all the regression checks.

### The Illusion of Balance

Unless there's an army of testers and automation engineers, they just won't be able to keep up with the programmers.

The programmers are free to run through the code, altering it recklessly, because they are never held accountable for doing this. Internal code quality suffers, which slows them down, but they brush it off as a supposedly natural part of the development process. They don't have to worry about unintended side effects of their changes either, because they are told to rely on the testers to find those cases.

If there _were_ enough testers and automation engineers to keep pace with the programmers, it would likely mean that the testers and automation engineers would have a good amount of downtime. I would wager that management would see this downtime as slack that can be taken up, and either 1) more programmers would be hired to eliminate that downtime, or 2) it would look poorly on the programmers for working so slow, which would possibly encourage them to work more recklessly.

Following the Theory of Constraints is a common management approach (whether they would refer to it that way or not), and that's more or less what the theory would suggest the next move is.

A balance would have to be struck somewhere, but all the options are bad.

They only thing testers can do, is make decisions as to where they want to make sure functionality is verified. They have to make hard decisions about where they are ok with regressions occurring, so that they can focus on other areas that they deem to be more important. That's not a choice I feel a tester should be making.

And even when they do make such decisions, they can still be held responsible for letting serious bugs through.

To paraphrase the Agile manifesto:

The testers are irrationally forced, through the imposition of corporate power structures, to make these decisions in the futile pursuit of establishing balance in a fundamentally flawed process.

If those bugs getting through is accepted as just a part of the development process, then some semblance of balance is achieved. But only in the sense that the testers might not necessarily be punished for reasons outside of their control. In reality, though, there is no balance, only waste, recklessness, and a lot of unnecessary bugs (and also, likely fear as the testers are still at a significant disadvantage).

# Quick Sidebar

I don't want to imply the programmers, or even the managers, have any malicious intent, are actually incompetent, or are aware that they are acting recklessly. Nor do I want to imply the programmers would only be interested in giving the appearance of productivity (that would likely be boring for them). In my experience, they are usually just unaware of the consequences of these actions, because the system itself discourages testers from speaking out, and a solution for the problem isn't exactly apparent.

Sure, there's some programmers and managers who aren't cut out for this line of work (to put it lightly), and some who would be apathetic when informed of these issues. But, in my experience, most become genuinely concerned, and want to work with you once informed.

# Restoring Balance

When the programmers are in charge of writing their own, thorough automated checks as part of the work required before sending their changes to code review (instead of having the testers take care of checking things or implementing the automated checks), a few things happen:

1. The changes are automatically validated, and done so quickly
2. The checks can be repeated and the results reproduced by anyone else, including the CI/CD pipeline, giving the checks themselves additional validity
3. The changes are forever protected from regressions, because requiring all checks to pass before the changes can be merged in would prevent that
4. Progress is actually locked to the rate it can sustainably be verified at

### This isn't a silver bullet

This doesn't _guarantee_ the process will be sustainable, but at least one of the things preventing sustainability would be solved.

However, [internal software quality (ISQ)](https://martinfowler.com/articles/is-quality-worth-cost.html) is also essential to operating sustainably, as well.

Having the programmers write the automated checks in general is a step in the right direction, and does prevent things from getting out of hand for the testers. But having the programmers do it properly, at appropriate levels (instead of having them rely on the API or UI when those aren't necessary) is essential for encouraging them to maintain ISQ, which will also be needed to be sustainable.

# Real software development is complicated

The information above should be able to stand on its own, but I wanted to make sure I verified this logic.

There's a lot that goes on during something like mini-waterfall. Methodologies like Scrum have a number of ceremonies, there's consequences for context switching, ticket priorities need to be accounted for, tester and programmer ratios play a factor, and so on. On top of this, every ticket is unique and full of unknowns.

I wanted to see how mini-waterfall would play out when mixing up these factors, and applying a fairly common set of logic for how testers and programmers would proceed through a sprint, minute by minute.

To do this, I created a [Monte Carlo simulation](https://en.wikipedia.org/wiki/Monte_Carlo_method) to play out 10,000 mini-waterfall sprints.

I'll go over the fine details of how it works, the assumptions it makes, and so on in a technical writeup ([here](/waterfall_simulation_results). But for now, I'll go over some general details, and then the results.

### Sprint Configurations

Each sprint that gets simulated starts off with the following settings set randomly (within a specific range):

* Sprint day count (range: 1 to 4 weeks, i.e. 5, 10, 15, or 20 days)
* Initial regression check time (range: 1 day to half the length of the sprint)
* Day start time (range: 8am to 11am, increment: 15 minutes)
* Number of programmers (range: 1 to 6)
* Number of testers (range: 1 to the number of programmers)
* Max initial programming time (range: 2.5 hours to 20 hours, increment 2.5 hours)
* Max full check time (range: 2.5 hours to 20 hours, increment: 2.5 hours)
* Max QA automation time (range: 2.5 hours to 20 hours, increment: 2.5 hours)
* Average ticket passback rate (range: 0 to 4)
* Check refinement (range: 10% to 90%, increment: 10%)

#### Some Quick Notes

Tickets get generated on the fly as the sprint progresses with all the information needed to find out how the work for that ticket would be scheduled, and how much progress would actually be made on the ticket.

For the "Max ... time" settings, these set an upper bound for what is considered a reasonable maximum amount of time one would expect a ticket to take for that particular phase. The times for each ticket for these phases are chosen randomly, accounting for those times as the upper bounds.

Some ticket will have multiple iterations (because the tester would have passed them back), and the times for the other iterations are chosen based off of the initially chosen times for that ticket.

Code review itself maxes out at about an hour.

"Check refinement" is the percentage of the full check time for a given ticket that a tester is able to reduce when those checks must be performed during the regression checking phase.

You can find more info on the assumptions the model makes, exactly how it work, the decisions behind those implementation details, in the [technical writeup](/waterfall_simulation_writeup).

## Results

{% include mini_waterfall/results_svg.html %}

{% include mini_waterfall/results_js.html %}

# Conclusions

**Note:** The graphs here only show the first 1000 results, because the graphs were causing some performance issues, and they were pretty visually dense. The full set of data from those runs can be found [here](/assets/data/waterfall/fullSimData.csv) (and the limited data set used for the graphs can be found [here]([here](/assets/data/waterfall/sim.csv))), if you're curious, though.
{: .notice--info}

The primary metric tracked is the "growth rate" of the sprint, which represents the percentage of time the testers would lose each sprint due to having to either catch up on previous check work, and/or having to perform new regression checks that couldn't be automated in time. If the rate is above 0, then the process used wasn't sustainable.

Out of all 10,000 runs, only _two_ were deemed theoretically sustainable, and I spotted two things they had in common.

First, was that there were just as many testers as there were programmers, which would basically mean that every programmer would need their own personal tester in order for the process to even have a chance of being sustainable.

Second, was that the ratio between the time it would take to program, versus the time it would take to automate all of the checks was incredibly skewed. It required that the programming work would take roughly 7 times as long, at least, as the time it would take to automate.

Neither of these seem reasonable to me, with the latter seeming to either be impossible or a sign that it's already too late in regards to ISQ.

But even aside from those, there's still the issue of ISQ. If, for whatever reason, it took 7 times as long to implement a change, as it did to automate the checks for it at the most complex, time consuming, brittle levels possible, then I think it's safe to say the ISQ would already be in a bad spot, and probably isn't going to get better.
