---
layout: posts
title: "Mini-waterfall Simulation"
excerpt: "The results of a Monte Carlo simulation designed to reflect real world Scrum-oriented sprints, in order to gauge whether or not a mini-waterfall approach is sustainable."
date: 2020-12-05 17:00:00 -0500
permalink: /waterfall_simulation_writeup/
---

The source of the simulation can be found [here](https://github.com/SalmonMode/mini-waterfall-simulation-model), and the script that runs it can be found [here](https://github.com/SalmonMode/mini-waterfall-simulation).
{: .notice--info}

My goal with this Monte Carlo simulation was to identify if there were any reasonable ways to go about a mini-waterfall approach that could be sustainable, or if they would eventually end up in a deadlock, regardless of any issues with things like proper sprint planning or internal software quality. If some were found to be sustainable, I also wanted to identify if they had anything in common that might indicate what made them sustainable.

The results indicate that, in order for the process to even have a chance of being sustainable, two things must happen:

1. The team must consist of the same number of testers as there are programmers. This would suggest that testers could not operate across multiple teams.
2. The programming work must take roughly 7 times as long as the automation work, at least.

### Sprint Configurations

The simulation starts with the following configurable variables for each iteration, being chosen at random from a specified range, with particular increments:

#### Sprint Day Count (Range: 1 to 4 weeks (i.e. 5, 10, 15, or 20 days))

The number of days in a sprint.

#### Initial Regression Check Time (Range: 1 day to half the length of the sprint)

Because there's already some build up of checks that must be done by hand, the simulation can be told how many days that amount of time is.

#### Day Start Time (Range: 8AM to 11AM, Increment: 15 minutes)

The time the day starts at.

#### Programmer Count (Range: 1 to 6)

The number of programmers on the team.

#### Tester Count (Range: 1 to the number of programmers)

The number of testers on the team.

#### Max Initial Programming Time (Range: 2.5 hours to 20 hours, Increment 2.5 hours)

This is the upper bound for time allowed for the first iteration of programming work for a ticket (there may be multiple iterations). If it is set to 20 hours, then the programmer's initial attempt at the ticket will not exceed 20 hours. There is, however, a minimum of 30 minutes of programming work required for each ticket.

#### Max Full Check Time (Range: 2.5 hours to 20 hours, Increment: 2.5 hours)

This is the upper bound for time allowed for the final iteration of check work on a ticket (there may be multiple iterations). If it is set to 20 hours, then the tester's final attempt at checking the ticket will not exceed 20 hours. There is, however, a minimum of 30 minutes of checking work required for each ticket.

#### Max QA Automation Time (Range: 2.5 hours to 20 hours, Increment: 2.5 hours)

This is the upper bound for time allowed for the iteration of automation work on a ticket. If it is set to 20 hours, then the tester will not take more than 20 hours to automate the checking of that ticket. There is, however, a minimum of 30 minutes of checking work required for each ticket.

This particular type of work only has one iteration. This is because the testers, at least in this simulation, verify that their work behaves as expected before calling it done.

#### Average Ticket Passback Rate (Range: 0 to 4)

This is a baseline for the average numbers of times a ticket will be passed back to the programmer from the tester, should the tester find a problem. Each ticket will be given its own passback count based off of this number, and it can both be less and greater than the average. If the average is 2, one ticket could easily have a passback rate of 0 or 4.

#### Check Refinement (Range: 10% to 90%, Increment: 10%)

If a ticket is "done" in a sprint, but not automated, the checks would have to be done by hand again in the next sprint. The check refinement is a percentage that represents how much the testers can reduce the time needed to perform those checks by hand. If there would be 10 hours of new regression check time needed, but the refinement is 90%, it would be reduced to 1 hour.

## Monte Carlo simulation

To quickly cover it, a [Monte Carlo simulation](https://en.wikipedia.org/wiki/Monte_Carlo_method) takes a set of rules, and applies them, over and over again, to a newly randomized set of data each time, to see what the outcomes are.

I'll run through the details, and explain the rules, and its limitations before jumping into the results. But the configurable values mentioned above are only a part of what is randomized. They are used in combination with other randomized values, which I'll be getting into details about further down, to determine things like how long a particular work iteration would take for a particular ticket.

## "Deadlock"

A "deadlock", in this context, is reached when the testers have to spent so much time during the sprint doing regression checks by hand that they don't have any time left over to check any new tickets. The amount of time they have to spend doing regression checks grows when tickets from a previous sprint weren't automated, which means that they must be re-verified by hand during the regression checking of every sprint after.

It's important to note, that the simulation also considers the time testers would have to spend in following sprints to "catch up" on their work. This time would directly reduce the amount of time in future sprints, just like new regression checks would, and so is factored in the same way (without multiplying by the check refinement rate, that is).

## Definition of "done" vs "automated"

For the purposes of talking about certain states, I'll define a ticket as being "done", when the changes for it have gotten passed code review and the tester approved it. A ticket can be "done" without being "automated". But if it's "automated", that means it will be unnecessary for it to be checked by hand in future sprints.

## Limitations

There's a number of factors that go in to how a sprint plays out. It would be impractical to attempt to account for everything, so the simulation I've come up with makes a few assumptions.

### Internal Software Quality (ISQ)

This simulation does not account for the decreases in ISQ that would likely occur from the programmers not writing the automated checks themselves, and doing so at the appropriate levels. So it assumes the programmers are never slowed down by the code having low quality.

This is unrealistic, but this was an intentional decision to see how events played out without this being a factor.

### Not The First Sprint

This simulation assumes that the sprint it will be simulating is not the first. It also simulates a small portion of the previous sprint to prepare work for testers in advance, as would normally happen in such a system.

### Regression Checking

The simulation assumes that there were some things _not_ automated in previous sprints, and that there is already some amount of time that must be spent at the end of each sprint by testers checking things by hand to make sure that everything that was "done" in that sprint didn't break anything from previous sprints. This starts out as a static number of days, where all time, other than that spent in meetings or on lunch, is spent performing those regression checks.

It also assumes that all tickets that were "done" in the most recent sprint were automated, and thus won't increase the amount of time needed to be spent on regression checking in the "current" sprint.

### Automation Maintenance

The simulation does not account for any time that would have to be spent doing maintenance to keep the automated checks working as desired.

### Previous Regression Check Automation

The simulation does not attempt to have the testers automate regression checks for tickets "done" during from previous sprints. This shouldn't affect the outcome though, as a sustainable process would be able to prevent the list of unautomated regression checks from growing further.

### Ambiguous Priority

Priorities are determined at the time each ticket is generated, and used to determine what a player (i.e. programmer or tester) should work on if presented with a choice. If one were to look at the priority of the tickets and where they show up in the generated schedule, they may see some oddities. However, the priorities could be changed retroactively so that the schedule and choice making makes sense, so it's largely moot.

### Ambiguous Ticket Dependencies

The tickets do not dictate any dependencies with each other, and one might also see some oddities in the schedule because higher priority tickets might be worked on after lower priority tickets.

I could have made a ticket pool of a size large enough to guarantee there'd be enough for the sprint, sorted by priority and worked from that instead of creating tickets as needed, but that would mean likely generating more tickets than is actually necessary. Since the priorities could be modified after the fact to make sense, as mentioned above, or dependencies could be established to make the schedule make sense, this issue is also largely moot.

### Perfect Time Management

The simulation assumes that everyone is perfect at time management. Everyone knows they won't be able to get anything done in the 30 minutes or fewer before their next meeting (or end of day). No one works on tickets through lunch, so they can enjoy the break, and no one works on tickets through meetings so they can give the meeting the attention it requires.

Work also begins and ends at the exact same times every day, with no one working overtime. Working overtime wouldn't be necessary in a sustainable process, so a process being sustainable should be evident even when no overtime is allowed.

### Effective Code Review and Change Size

According to a [study](https://dphu.org/uploads/attachements/books/books_1713_0.pdf) performed by SmartBear Software, code review should be limited to about 1 hour, and, within that constraint, changes should be no more than 1500 lines in size (with less than 500 lines being optimal). Because of this, the simulation assumes that code review is limited to no more than one hour, with a possible max of 30 minutes to context switch.

### No Problems Found in Code Review

The simulation assumes that either no problems are found during code review, meaning they wouldn't have to be sent back to the programmer. In the real world this could cause interrupts for the original programmer, or delay the ticket from getting through to the checking phase. This can play a real factor in sustainability, but this simulation does not account for them.

Had this simulation accounted for them though, it would only serve to make certain process configurations seem _less_ sustainable, and the goal of this simulation is to see if it's possible _at all_ for any process configurations following mini-waterfall to be sustainable.

### Effect of Weekends and Sprint Start Day

The simulation assumes that weekends won't have an impact on things like context switching, and that the day a sprint starts on doesn't matter. These things may have an impact, but this simulation does not account for them.

### Fixes Take Less Time (Usually)

This simulation assumes that however long the initial iteration of work a programmer put in to a ticket, subsequent iterations, where they are attempting to fix bugs found by the tester, will usually take less time than the initial iteration. In the real world, it's perfectly possible for a bug fix to take much longer than the original work iteration. This simulation allows for that, but makes it an extremely rare occurrence.

### Regression Are Not Found

While regressions do occur in the real world, and might be detected during the regression check phase of a mini-waterfall development process, it's not guaranteed they will be found. This simulation assumes that the testers won't find any regressions in this, or the previous sprint. This does not imply that regression checking isn't necessary, just that the programmers happened to get lucky in these 2 particular sprints.

However, even if programmers had to be interrupted from their work on tickets for the next sprint to fix regressions for the current sprint, they're still capable of making progress on the tickets for the next sprint while the testers are doing regression checks. It would also mean the testers would have to spend additional time re-checking what regressed. So accounting for this would only potentially delay an estimated "deadlock", but it would not affect whether or not there was a deadlock at all, i.e. whether or not the process can be considered sustainable.

### Complexities of High Scopes Regarding Automation

Testers often write automated checks at the end-to-end, or API level, and often using a browser (or even mobile devices).

If this is the level that they're writing their checks at, then, by definition, the complexity of doing so _must_ be greater than had the programmer done it at a lower level where less things would be involved that need to be controlled for. As a result, it should be expected that it will usually take the tester longer to write the automated checks for a ticket, than it took the programmer to write the changes.

However, this simulation assumes that is not the case, for 2 reasons:

1. It is often assumed that this is not the case in the real world, and this may be why some perceive the mini-waterfall model to be sustainable, and some at least use this as justification for not having the programmers do it at a lower level.
2. Accounting for this would show how automation at these scopes is not as viable, but is still not necessary to demonstrate the unsustainability of mini-waterfall.

### Testers Verify Their Automation

The simulation assumes that testers will not consider their automation to be done until they verify it behaves as expected. As a result, automation will only ever have a single iteration of work, unlike programming, checking, or code review.

## Per Ticket Randomization

Each ticket is generated whenever a programmer is available for work and there is are no changes from other programmers to code review. When it's generated, some of the configurations mentioned above are used to determine various aspects about the ticket and the work that will need to go into it.

### Passback Count

First a "passback count" is randomly generated using the **Poisson distribution** with the config value passed for the average passback count. This dictates the number of times a ticket will have to go through from programming, to code review, to checking, before it can be passed on to "done". Whatever number is generated is the number of work iterations that must be generated for each of those work types.

### Primary Distributions

There's two distributions that are used for the remaining generated values:

#### Distribution A:

A **Gamma distribution** with a shape of 3 and a rate of 0.1. This is always capped at 100.

{% include mini_waterfall/dist_a_svg.html %}

(Note: the generated values are normally between 1 and 100, so they are divided by 100 in order to be used as percentages.)

#### Distribution B:

A **Gamma distribution** with a shape of 1 and a rate of 5. This is usually uncapped, except when used in regards to code review iterations, where it's capped at 100 just like Distribution A.

{% include mini_waterfall/dist_b_svg.html %}

{% include mini_waterfall/dist_svg_js.html %}

(Note: the generated values are normally between 0 and 1, so they are _aren't_ divided by 100 in order to be used as percentages.)

### Programming Work Iteration

The initial programming work iteration for a ticket is generated using **Distribution A**.

The generated value is divided by 100 (to make it into a percentage), and multiplied by the maximum initial programming time provided in the configuration.

Later iterations are based off of the initial iteration time, using **Distribution B**. As mentioned above, the lack of a cap is meant to allow for very rare iterations where they are longer in duration than the initial iteration, which represents when tracking down and fixing a particular issue proves to be tricky. The values are different from the original distribution, as these values lean much more heavily to the lower end of the range, meaning it's much more likely for these iterations to be much smaller in duration.

### Checking Work Iteration

The final checking work iteration for a ticket is generated using **Distribution A**.

The generated value is divided by 100 (to make it into a percentage), and multiplied by the maximum full check time provided in the configuration.

Earlier iterations are based off of the final iteration time, using **Distribution B**. As mentioned above, the lack of a cap is meant to allow for very rare iterations where they are longer in duration than the initial iteration, which represents when coming up with reproducible steps for the programmer proves to be tricky. The values are different from the original distribution, as these values lean much more heavily to the lower end of the range, meaning it's much more likely for these iterations to be much smaller in duration.

The reason the _final_ iteration is the longest, is because that is the iteration where the tester would've checked everything in the list of things that needed to be checked. Prior iterations wouldn't have completed everything, as they would've found a problem at some point before completing the list, and this would result in the iteration being shorter.

### Code Review Work Iteration

Iterations of this type are generated exactly the same way as programming iterations, except with a cap of 100 for the generated value on later iterations, and a hard-coded maximum time of 1 hour.

### Check Automation Work Iteration

Iterations of this type are generated only using **Distribution A**, and there's only ever one of these generated per ticket. The reason for this, is because the testers are assumed to be verifying that their automated checks are operating as expected before they are being committed.

## Procedural Logic

This section goes into the nitty gritty logic of how the simulation figures out how the schedule plays out, and how things are calculated/estimated.

### Given Events

The simulation starts with a few events that every worker has in common:

* **lunch** is always scheduled from noon to 1 PM
* the first 15 minutes of every day is spent doing a **standup** meeting
* the last hour of the last day of each sprint is spent doing a **sprint retro**
* the first 2 available hours of the first day of the sprint is spent doing **sprint planning** (it gets broken up if interrupted by lunch)
* testers have all remaining time of the first and last N number of days in the simulated time occupied by **regression checking** (where N is the number of initial regression check days per the iteration's configuration)

With these in place, everything operates around them.

### Scheduling work

Before diving into the logic loop, I want to first go over how a worker schedules work, as there's some nuances in there that I don't want to skip over.

When a worker is given a ticket, it grabs the appropriate work iteration, and lays out the time necessary to work on it in advance in its schedule. This does not progress the time of the simulation forward. It only schedules things which helps the simulation figure out what time to check in at next to process what work was completed, and what work needs to be handed out.

Whenever the worker begins work on that iteration, or resumes work on it after being interrupted (e.g. by the end of the day, or a meeting), a **context switching** event is generated with a random amount of time between 10 and 30 minutes, is it would normally play out ([source](https://www.researchgate.net/publication/220093595_Interrupts_Just_a_Minute_Never_Is), [source](https://www.nytimes.com/2005/10/16/magazine/meet-the-life-hackers.html_)).

If a worker has just become available (perhaps after finishing a work iteration, or a meeting), but there's another interruption (like lunch, the end of the day, or another meeting) coming up within 30 minutes, the worker will hold off and not do anything, instead scheduling a "Nothing Event" for that time. The reason for this, is because workers can see interruptions coming up, and if they feel there's not enough time to actually get anything done, they won't bother investing in trying to context switch ([source](https://www.brightdevelopers.com/the-cost-of-interruption-for-software-developers/)). For the purposes of this simulation, I've made that amount of time 30 minutes, as it aligns with the necessary amount of time for context switching.

### Logic Loop

With those hard-coded events (mentioned above) in place, the simulation goes to the first available "check in" time, which is the 15-minute mark of the very first day (which is the first day of regression checks for the previous sprint). At this point in time, no programmer has any work on their plate, so the simulation goes through each of them, generating a new ticket for each of them to begin work on (using the distributions and logic mentioned above), and they each schedule the initial programming work iteration from their respective tickets.

From that point on, the simulation steps forward to the next "check in time", which is either when a worker has finished an iteration of work, or has just become available for more work.

Whenever the simulation steps forward to these times, it does 5 things in a specific order.

First, it looks at all the programmers that have just completed a work iteration at that time (if any), and moves their tickets to the appropriate pools.

Second, it does the same for the testers.

Third, it hands out new programmer work, by having them code review another programmer's work or fix any tickets that were sent back to them (whichever the highest priority ticket relevant to them requires), and, if neither of those are relevant, then a new ticket is generated for them to work on.

Fourth, because it is possible for testers to have had nothing to do at certain points, their schedules are backfilled with "Nothing Events" up until the current time wherever there are gaps. This is necessary to easily identify the next check in time to step forward to.

Fifth, work is handed out to the testers. Testers will always prioritize checking things by hand over automating them, so a given tester will try to grab the highest priority ticket from the "Needs QA" pool, of the tickets that they can grab (i.e. the tickets that haven't already been checked out in a previous iteration by a different tester). If there's no tickets that need to be checked by hand, but there are tickets that are "done" but not automated, they will try to automate those. However, if neither options are available, the tester will do "nothing".

It will then look for the next check in time, proceed to that, and repeat the 5 steps again until no one can do anything else in the sprint.

### Ticket Transitions

Tickets typically go from programming, to code review, to checking, and then are considered done, assuming they went through all phases successfully. If they didn't get through all phases successfully, then they are sent back to the first phase. Once they make it through all of these phases, they'll be a potential candidate for being automated. The testers, however, are only allowed to automate tickets that they themselves checked initially.

### Deadlock Estimation

Once an iteration concludes, and all workers have had their schedules completely filled, the simulation attempts to project how many sprints it would take for that configuration to reach a deadlock. Its calculations revolve around one question:

How well can the testers keep up with the programmers in regards to their respective work iterations, in addition to the necessary automation work?

Deadlocks are caused by an imbalance between how much work the programmers must do collectively, versus how much the tester(s) must do collectively, specifically when the testers have more to do.

There are two separate things the tester(s) must do to "keep up" with the programmers:

1. They must do an amount of checking in proportion to the amount of programming and code review the programmers do, with regards to the most recently progressed programming/code review work iteration set, for each ticket.
2. They must also do an amount of automation in proportion to the amount of overall programming and code review the programmers do, for each ticket.

If the programmers have completed 100% of all of the programming and code review work work iterations for a given ticket, the tester must also complete 100% of the checking work iterations for that ticket, along with 100% of the automation work iteration for that ticket. If they do not, they will fall behind.

Since the tester(s) can't move on to the next iteration for a ticket, until the programmers begin it, only the progress of the automation iteration will be weighed against the _overall_ progress the programmers have made for that ticket. The checking iteration associated with the programming/code review iteration set that was most recently progressed (by any amount) will only be weighed against that programming/code review iteration set, in terms of percent completed.

#### Example

Let's say there's a ticket with the following work iterations:

* Programming: 127 Minutes, 70 Minutes, and 86 Minutes
* Code Review: 55 Minutes, 50 Minutes, and 45 Minutes
* Checking: 50 Minutes, 150 Minutes, and 240 Minutes
* Automation: 315 Minutes

If this ticket gets passed back to the original programmer once, and only makes it 80% of the way through the second programming and code review iteration before the sprint ends, then that means the tester would have to catch up by first doing 80% of their second checking iteration, which is ~120 minutes out of 150 minutes, and then doing about 52% of the automation iteration (52% because that's how much overall programming/code review work was completed, i.e. 223 minutes out of 433 minutes), which is about 163 minutes.

Here's a visual aid, to help explain:

{% include mini_waterfall/catchup_svg.html %}

### How the Testers "Catch Up"

Throughout the sprint, the testers, for one reason or another, have likely had blocks of time where they did nothing (the same is true for programmers). If these blocks of "nothing" existed in this sprint, it would be reasonable to expect that things would play out in a similar way in the next sprint, resulting in similar blocks of "nothing".

If these blocks of time are greater than 30 minutes in duration, then it could be expected that they could try to "catch up" during these times on the work they missed in the previous sprint.

Of course, they may be interrupted, and might not be able to fit the end of one iteration and the start of another in a single block (because there wasn't enough time remaining). So normal scheduling rules would still apply.

But the question is whether or not there's enough "nothing" time for them to reasonably get the catch up work done. If they can't, what's left is considered "leftovers".

## Leftovers Are How Regression Grows

The leftovers represent how much the testers are falling behind. If there's no leftovers, then it's possible (but not guaranteed) for the process to be sustainable. But there are some leftovers, then it means the process will likely slowly have the period of time reserved for regression checks grow each sprint, until deadlock is reached.

There's two types of leftovers: check leftovers; and automation leftovers. Both affect how the regression checking period grows in different ways.

### Checking Leftovers

If the tester has fallen behind in actually checking the tickets themselves, then that's time that will have to be spent next sprint, as is, and this directly removes time that would normally have been available for other things. There's no refinement here. It just gets subtracted from the cumulative practical tester time (i.e. the number of minutes they actually spent on checking things and writing automated checks).

However, this number is used to determine the _percentage_ of practical tester time that will reduces each iterative sprint. So it will be based off of how much time, including during the catch up phase, that the tester(s) spent either doing checks or automation. This is because the leftover time itself is only as long as it is, because of the progress made on tickets during the sprint. If there's less progress made on tickets each sprint, then there would be less leftover minutes.

### Automation Leftovers

Automation (at least in the context of this simulation) is the means by which testers are able to reduce how much checking they need to do by hand each regression checking phase. When they automate checking something completely, they no longer need to check it for a regression in future sprints.

The percentage of what was automated (including partial progress), reflects the percentage of all the potential new regression checking time that was added by new tickets which no longer needs to be done in future regression checking phases. The simulation finds the percentage of automation work that the tester(s) wouldn't have finished, and then uses that along with the total new regression check minutes that would have been added (including the percentage of those minutes for tickets that weren't "done"), and the check refinement rate

This is used to find out how much of the practical tester time the regression checking phase increases by each sprint.

### Together

Those two rates are added together, and then the simulation, starting with the total amount of practical tester minutes so far, reduces the practical tester minutes by that percentage (this, representing the regression check phase growing by that amount), counting how many times it has to do this, until the remaining time is too short to do anything productive.

The number of times it has to do this, is the number of sprints it would take to reach a deadlock.

The initial (unrefined) growth rate is really just the total number of leftover minutes divided by

The testers will need to "catch up" to the programmers by 1)

To determine this, it finds the percentage of programmer time spent on tickets that weren't automated, and then, gets that percentage of time the testers spent checking things in minutes.

Those minutes represent potential additional time needed for regression checks for the next sprint.

It will also look at the number of viable "Nothing" blocks (i.e. those longer than 30 minutes long), and how much time would actually be available through these blocks of time, to see how much of that potential regression check time can be reduced. To do this, it plays out the automation work iterations for those unautomated tickets through those blocks of "Nothing" time, context switching, and adding new "Nothing" events (for when an iteration is finished but the time block has 30 minutes or less time remaining) as needed.

It will, of course, still restrict this, so the nothing blocks for a specific tester can't be used with a ticket, if another tester checked that ticket originally.

This is to see if the testers would normally have enough free time to be able to automate those tickets in the next sprint, as this would nullify their impact on increasing the time needed for regression checks each sprint.

The number of minutes left (if any) is multiplied by the check refinement percentage. Then it finds the percentage of regression time that number of minutes is, so it can tell by what percentage the time necessary for regression checking grows each sprint.

## When an Iteration is Considered Potentially Sustainable

An iteration is considered "potentially sustainable", when there's no leftovers. If there's no leftovers, then there's nothing to accumulate one sprint after another, and the growth rate will be 0 percent.

## Results

{% include mini_waterfall/results_svg.html %}

{% include mini_waterfall/results_js.html %}

**Note:** The graphs here only show the first 1000 results, because the graphs were causing some performance issues, and they were pretty visually dense. The full set of data from those runs can be found [here](/assets/data/waterfall/fullSimData.csv) (and the limited data set used for the graphs can be found [here]([here](/assets/data/waterfall/sim.csv))), if you're curious, though.
{: .notice--info}


# Conclusions

The primary metric tracked is the "growth rate" of the sprint, which represents the percentage of time the testers would lose each sprint due to having to either catch up on previous check work, and/or having to perform new regression checks that couldn't be automated in time. If the rate is above 0, then the process used wasn't sustainable.

Out of all 10,000 runs, only _two_ were deemed theoretically sustainable, and I spotted two things they had in common.

First, was that there were just as many testers as there were programmers, which would basically mean that every programmer would need their own personal tester in order for the process to even have a chance of being sustainable.

Second, was that the ratio between the time it would take to program, versus the time it would take to automate all of the checks was incredibly skewed. It required that the programming work would take roughly 7 times as long, at least, as the time it would take to automate.

Neither of these seem reasonable to me, with the latter seeming to either be impossible or a sign that it's already too late in regards to ISQ.

But even aside from those, there's still the issue of ISQ. If, for whatever reason, it took 7 times as long to implement a change, as it did to automate the checks for it at the most complex, time consuming, brittle levels possible, then I think it's safe to say the ISQ would already be in a bad spot, and probably isn't going to get better.
