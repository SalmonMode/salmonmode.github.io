---
layout: posts
title: '"What would QA do all day?"'
excerpt: "If the developer wrote the tests for their tickets before checking their changes in, what would QA do all day? Let's take a look at what leads to this question being asked, and why it's essential for developers to write their own tests in Agile."
date: 2020-08-20 16:00:00 -0500
---

![John C. McGinley's character in Office Space saying "what would you say you do here?"](/images/what_would_you_say_you_do_here.gif){:height="auto" width="100%"}

I've been asked this question, or some variation of it, many times by other developers, management, and even some in _QA_ when I've proposed having the programmers do the tests for tickets in order to follow Agile principles. The question assumes that the _only_ thing a tester is there for, is to verify the acceptance criteria of tickets.

The fact that the question was asked carries many implications, and I'll try to cover the ones I find to be the most concerning.

# Misunderstanding Agile principles

I believe many places conflate Agile and Scrum, and misconstrue [the principles laid out in the Agile manifesto](https://agilemanifesto.org/principles.html) as benefits to be gained, rather than a set of principles that they need to _actively uphold_ and that can't be cherry picked. I believe they think Scrum is a recipe for success that will help their development to be sustainable and to produce high quality software faster.

It's a noble effort to seek out changes they feel will help their development team(s) move faster and more effectively. But, unfortunately, a process change to Scrum is not going to do that. Agile requires a cultural change and takes [discipline](https://youtu.be/ecIWPzGEbFc?t=3817). The Agile manifesto starts of its list of principles by saying:

> We _follow_ these principles

not any of these:
 - We follow _some of_ these principles
 - We follow these principles _when we deem it to be convenient_
 - We think these practices are _great in theory_

The idea that programmers should be writing the tests for the tickets in an Agile development environment isn't exactly a radical one. It's a _fundamental requirement_ of Agile.

The "Waterfall" development model has testing done separately from programming at a later time. But Agile was created to combat waterfall and requires that testing and writing tests be done in tandem with programming.

**Note:** To be clear, this is not an argument in support of TDD or TFD. While I believe those can contribute to overall productivity, this is only meant to highlight and explain the requirement that programmers must write the tests as they make their changes (not necessarily _before_ as per TDD), before they check them in for code review.
{: .notice--info}

## Why exactly Agile requires the programmer writes the tests

> Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.

There's many reasons, but the big hitters revolve around **sustainability**, and there's many perspectives to view the issue, so here's a collection of them. Hopefully one or two will hit home. I may also add more to this later.

### Accumulation of tests

If we assume that nobody writes the automated tests, and everything is tested manually by the tester, then it clearly isn't sustainable. As more behaviors are added in, the testers workload would be increasing every iteration.

Automating regression tests keeps the tester's workload in check.

### The math doesn't add up

A programmer can make a relatively small change that has pretty big implications pretty quickly, especially if complexity is high. Certain large changes can also be made fairly quickly (e.g. using a find & replace tool along with regex to modify a pattern of text in several files).

Those changes can take a while to verify manually by another person, especially if they have to be done through a browser as is often done a tester is manually checking something. It will take even longer if that other person has to write automated end-to-end tests for those checks as well.

If a programmer knows that a tester will be checking all of the criteria for their changes, and can trust them to catch any problems before they go out to production, then the programmer has no reason to check those changes themselves. The programmer wants to go as fast as possible, which is often the reason they opt not to write tests as they make their changes, so after a cursory check of their changes, the be eager to move on to their next ticket.

Without testing and writing tests to slow the programmer down, it's not unreasonable to say that, when done in this way, it can often take testers _longer_ to check the changes than it did for the programmers to make them. This is not always the case, but the possibility for it exists, and it's not even necessary for it to become a problem.

As an example, let's say there's 1 tester and 5 programmers on a team in a two week sprint cycle, and that tester checks all the changes made by the programmers when they pass their tickets to the tester for QA (after going through code review, of course).

Let's also say that each programmer can complete one ticket and code review another every 2 days, and it takes the tester roughly 1 hour to check each ticket manually.

If work is done by everyone, every day of the sprint, that's 25 tickets, which means roughly 25 hours of checking the tester has to do each sprint.

If it takes another 1-2 hours to automate the testing of each ticket (to keep things sustainable), that's a total of 50-75 hours of checking-related work the tester has to do every sprint.

Now what about the ~2 hours worth of daily standups, ~2 hour long sprint planning/grooming being, ~1 hour retro, and all the other meetings that will inevitably happen?

Having 70 hours of productive work hours available _exclusively_ for new changes every sprint is not a realistic expectation.

Expecting 50 _might_ be reasonable if you have a don't have many meetings each week/day, but it's still cutting it close, and still account for any end-of-sprint manual regression testing that might need to be done.

Let's say you reserve the last 2 days of the sprint just for regression tests and fixing any bugs you might find, during which, the programmers will otherwise continue to work on tickets for the next sprint. That leaves you with 8 days to find those 50+ hours to finish all that work, which means _at least_ 6-7 hours of free time each day.

Of course, this is just an example, but it's a realistic scenario that I'm sure many testers can relate to.

This sort of system is primed to make QA a bottleneck, and it's very easy for the development to slow down and for quality to be compromised because of it. You _could_ put more QA folks on each team, but that doesn't entirely eliminate the problem.

If programmers are writing those sorts of tests up front, then the bottleneck is eliminated completely.

### Test suite execution time

If the tester is the one writing the tests, they'll likely be writing them at the end-to-end level. That level is _extremely_ expensive to run at, and each test will require a significant amount of time, especially if a browser is involved. Every test added that runs at that level will add a _considerable_ amount of time to the test suite execution time. The tests need to done at lower levels where possible so they only add a negligible amount of time, otherwise, it'll grow out of control very quickly.

### Prompt programmer feedback

[If the tests take too long to run, the programmer is likely to get frustrated, and possibly even move on to something else](https://www.youtube.com/watch?v=AJ7u_Z-TS-A). If they move on to something else, it means having to switch contexts again back to what they were doing originally once the tests finish, which burns time and mental effort (i.e. there was wasted work).

Programmers need prompt feedback on their changes so they can iterate rapidly. The only way to provide this is to make sure there's sufficient tests, and those tests are operating at as low a level as possible. The only way to make sure those tests are in place, is to make sure the programmers are adding them as they add their changes (because, as mentioned above, adding them in after the fact is basically asking for the test development to be outpaced).

### Wasted work

If we assume that the tester can somehow keep pace with the programmers when it comes to writing automated tests while the programmers make production code changes, there's still for more wasted work than is necessary.

The tester would very likely be writing their tests at the end-to-end level, which means entirely new code structures would have to be made to abstract things like the presentation layer (e.g. page objects), or the web API interactions, and the tester would need to learn what the programmer did and the implications of their changes before they could even begin writing those structures.

On top of this, every single time a ticket has to get passed back to the programmer, the programmer needs to learn what issue the tester found, the context in which they found it, and then they need to investigate it after re-establishing the context of their original changes. Context switching needs to be reduced because it's costly when switching to back to a context the programmer was already in previously.

### Maintaining internal software quality

> Continuous attention to technical excellence and good design enhances agility.

[Internal software quality](https://twitter.com/GeePawHill/status/1292450480426188802) is effectively the quality of the code's changeability. When this is reduced, so is productivity. If productivity declines over time, then it's not sustainable. So if internal software quality is not actively maintained as we move forward, then we're not sustainable.

Having the programmer write the tests helps them identify problematic areas of the code that need attention, so that they can fix them then and there to make future changes easier to make, rather than making the problem worse. The most cost-effective way to have those tests implemented while also maintaining internal software quality, is to have the programmer write the tests (and not just the happy path tests) as they make their changes.

#### Regarding Tech Debt Sprints

In an attempt to maintain internal software quality, some places use "tech debt" sprints where tech debt tickets are planned for that sprint. These seem fine in theory, but aren't very practical and are actively harmful to the bottom line when done at regular intervals.

Technical debt is named that way, because it's borrowing velocity from the future. The part that many seem to forget, is that **debt accrues interest**. By borrowing velocity from the future, it both creates an artificially inflated velocity for the current sprint, and increases the overall work that needs to be done to get to the desired end result. It's an attempt to _lie_ (to management and ourselves) about what the team's capacity is for a given sprint, and it will inevitably lead to release date estimates that are far sooner than is practical, which, of course, leads to crunch time.

[Here's a note from Atlassian](https://www.atlassian.com/agile/software-development/technical-debt) (the makers of Jira) on the importance of eliminating tech debt as you go.

All that said, technical debt _does_ happen. It's not often that we can perfectly foresee what we'll need 3 months from now so that we can determine what the optimal implementation is now. While we should be trying to resolve that debt as we go, sometimes it's difficult to see the bigger problem until it's too late. In order to maintain velocity going forward, it may be necessary to have ad hoc tech debt sprints that revolve around larger refactors.

# Disregard for quality (both internal and external)

When the programmers aren't writing the tests, they don't have to be concerned with quality. It becomes almost impossible to hold them accountable for poor external software quality (e.g. bugs), because they can always say ["why didn't we catch this in QA?"](https://www.developsense.com/blog/2020/08/why-didnt-we-catch-this-in-qa/) which has its own, serious problems.

Internal software quality is something they are accountable to, but they can always brush it off to get by, and lac of it is not something that management can easily identify. So as long as they can get _something_ done that roughly meets the acceptance criteria of a ticket, they can point to someone else (or _something_, e.g. the code itself), since they can say they did their part. They might point to QA to say they should have caught it, or at whoever wrote the ticket for not being explicit enough, or the code base because it has poor internal quality (which they can falsely claim is the nature of writing code).

Programmers have no reason to be concerned with quality, either external or internal, if they aren't the ones writing the tests. It's not that they don't care. It's just that they lack discipline and the experience to understand the implications of this.

Some programmers may say they don't have the skills or mentality for it. But that's a load of bunk.

If the programmer understands the acceptance criteria and can reason about them, then they can figure out how what the general tests should be. If they don't understand the acceptance criteria, then they must not know how to implement it.

# Disregard for QA

When the programmer doesn't write the tests, this responsibility falls on the tester to either write the automated tests or do them manually. But this forces the tester into the position of being a bottleneck for the rest of the team and puts unrealistic (and often impossible) expectations on them.

Often it will take more time to test a ticket at the end-to-end level than it does to make the associated code change, while testing it at the unit/component level (if possible) takes _less_ time (if it doesn't, then there's an issue in the code that needs to be addressed).

**Note:** This doesn't mean the work for QA in this particular context is _harder_ than what the programmers are doing. In fact, it's quite the opposite. This type of work is mind-numbing for a tester, which makes it that much worse to also have them doing such unfulfilling work their whole day.
{: .notice--info}

There's usually multiple programmers and far fewer testers, so, for the sake of simplicity, let's say there's a team with 5 programmers and one QA person. That means that the tester often has more work to do than all of the programmers combined (in terms of hours that it will take to complete that work). If the programmers are all working at full throttle, they can quickly and easily overload the tester.

Programmers aren't always going full throttle, though, and there's also the buffer of code review. But, programmers probably aren't too concerned with quality, so code review also likely isn't a concern to them, meaning it won't be much of a buffer. So the risk of overloading the tester is always there, and very easy to achieve. After all, if the tester _wasn't_ working at 100% capacity, "what would QA be doing?" The assumption is baked in that they will always be operating at least at 100% capacity, and this is assuming they have the entire sprint to do these checks.

This puts enormous pressure on QA to do what they likely don't have the time to do. They'll be pressured to cut corners, work overtime, skip non-critical (and sometimes culturally-significant) meetings, work through critical meetings (not giving them their full attention), work during the weekends, work during their vacation, not take vacation at all, and more. In some cases, they may not even be _allowed_ to take vacation time, and heaven forbid they want to take it at the same time as deployment.

It's incredibly easy to hold QA accountable for issues that they have zero control over. If two programmers send their tickets to QA at the same time, only one can be worked on, but it's very clearly a bottleneck at QA that programmers will voice their concerns about. If bugs get through, it's because QA didn't catch them. The question of "What would QA do all day then?" assumes that checking acceptance criteria of tickets is all QA is meant for, and if they can't do it fast and thoroughly enough, then they must be the problem.

It makes testers into gatekeepers of all things quality, and as such, are held responsible for any quality-related problems, which is... well... most things.

This isn't healthy, nor is it practical.

# Toxic culture

Kent Beck (one of the original signatories of the Agile Manifesto) highlights in their book _Extreme Programming Explained_ that nobody wants to be seen as the bottleneck in a "push" development model where everyone plays one specific role, and they will do whatever they can to not be seen as the constraint.

This encourages a very self-centered, and even fearful mentality. People are more concerned with how others can help them be less of a bottleneck, rather than how they themselves can help others be less of a bottleneck for the sake of overall team throughput.

They might also be afraid to ask for help, possibly because they fear their competency will be questioned (and that's assuming they would be able to get help _in the first place_). They may feel that asking for help is a sign of weakness.

There's no more team-oriented mentality in such a system. Nobody wants to ask "how can I help you" because that would slow them down and possibly make them look like the bottleneck. Nobody wants to be _asked_ this question either, because it might make them feel like they're a constraint. This is partly why programmers want to avoid the responsibility of testing like it's the plague. If QA has to do the testing, it buys them time to crank out more changes for tickets that they can "throw over the wall" to QA.

The programmer likely has no malicious intent in avoiding testing, but they also aren't considering the overall impact it has on the team's throughput, nor how it affects those in QA. Their concern for QA might be limited to something like "all QA has to do is check tickets, and how hard could that be? Sure it might take a long time, but that's what they're here for, right? I'm sure they'll be fine as long as they finish before the end of the sprint." They have no reason to believe anything other than this if they're asking what QA would do all day to begin with.

But this encourages the siloing of responsibilities, which, in turn, builds walls between programmers and testers, making testers into outsiders. Even if all members of the team get along well, it becomes, on some level, two teams within one, where the testers are (usually) vastly outnumbered by the programmers.

# Fear from QA

I think Lisa Crispin and Janet Gregory nailed it in their book _Agile Testing_. They said most of it boils down to _fear_. They explained (among other things) that testers might not know what else there is to do, and even if they do, that they might be afraid they don't have the skills to cut it. If all they've ever known is checking criteria from tickets, there can be a sense of security in that. It has a very clear line where they can say "ok, I did my job. I'm done." If they get that work done, then they have nothing to fear regarding job security. It may not be _fulfilling_ work for them, but it _will_ at least pay the bills.

This fear is entirely understandable, and shouldn't be ignored. It will take a culture change to make them feel like their job security isn't under constant threat.

But the only thing that should really matter in Agile is whether or not the _team as a whole_ is delivering, and, on an individual level, whether or not a person is adding value to the team, regardless of what they're doing to add that value.

If a programmer spent an entire sprint doing technical writing, does it really matter if they wrote no production code that sprint if the technical writing had to be done? Would they be viewed negatively for doing this?

Does it matter if a PM took on some user stories and wrote the production code and tests? Would the programmers on the team be viewed negatively because they didn't do all the programming that sprint?

Probably not.

So why would it matter if the tester didn't do all the checks in a sprint?

In Agile, the roles are flexible. If there's work to be done, anyone on the team can do it.

# What QA _would_ do all day

As I mentioned above, anyone can do anything on an Agile team. So long as the tester is providing sufficient value to the team in one way or another, that's all there is to it.

But I'm sure some reading this are looking for more testing-related activities for the testers to be doing all day. So here's a sampling of things.

### Exploratory testing

[There is a difference between "checking" and "testing"](https://www.developsense.com/blog/2009/08/testing-vs-checking/), and I've taken care to only refer to "testing" where appropriate (i.e. "tests", "checks", and "checking" are different than "testing").

Emergent behaviors exist in areas and in ways we didn't originally account for. They exist at the boundaries between the things we've planned for, which is why they're called "_edge_ cases". While exploratory testing is partially about learning, it's this learning that provides new test cases to cover when we find something that goes wrong, or something we fell could be better.

This is the tester's bread and butter.

### General product critiques

While the tester is _not_ a user (and therefore cannot "accept" things on behalf of the user), that doesn't mean they can't identify things that are technically correct, but could probably be better.

### Performance and load testing

The tester could really try to tax the system in order to see how it handles it. If the tester finds any problems, they can raise them as concerns.

### Security testing

Even though the tester may not be a security expert, they can still try to find areas that are concerning in regards to security. Maybe they try to access parts of the product they shouldn't be able to reach without authenticating.

### Ticket vetting

The tester can go over the backlog of upcoming tickets and figure out if any questions need to be answered before scoring, or look at the test cases provided on the ticket (if documenting them there is part of the team's process) and see if any need to be added/adjusted.

### Metrics

The tester can look for ways to improve team throughput and internal software quality by gathering metrics. They can look at things like cyclomatic complexity throughout the code base, or even use tools to see what parts of the code are associated with the most defects to see where the code needs attention before it becomes (more of) a problem.

### Programmer collaboration

If a programmer needs help determining the test cases for a ticket, or possibly needs help tracking down a supposed bug, they can work directly with the tester to get it done.

### Documentation

This one's pretty self-explanatory.

### Code review

In Agile, everyone should constantly be striving to improve themselves. Some testers may not have programming skills, and may want to learn. Participating in code reviews is an _excellent_ way to learn how to program, especially since asking questions (i.e. the Socratic method) is a good way for professionals to do code review in a way that feels respectful.

This of course requires that there should be a culture where asking even the most repetitive and inane questions is not discouraged. We should all take pride in helping to build each other up, and not criticize someone for asking a question that we feel the answer to is obvious.

Plus, it's a great opportunity for the tester to see if there's any automated tests that were missed and should be added (e.g. "Do we have a test for this that covers X, and if not, why?"), or if the added tests actually test something meaningful.

### Atlassian's approach

Atlassian, the company that makes Jira, Confluence and Trello, switched to this approach a while back, and made [this article](https://www.atlassian.com/agile/software-development/qa-at-speed) going over how they transitioned to it and the benefits they gained from it. They also cover exactly what QA then does all day (in the video, at least). They even stopped referring to QA as "Quality _Assurance_", and used "Quality _Assistance_" instead.

# Support role

The tester effectively takes on a _support_ role, operating, for the most part, outside the sprint's tickets (unless they have tickets to do themselves). [They'd become "Quality _Assistance_" rather than "Quality _Assurance_"](https://www.developsense.com/blog/2010/05/testers-get-out-of-the-quality-assurance-business/). With the free time they've gained from not having to do the checks of all the tickets, it opens the door to a staggering number of options.

This change will likely be a massive boon to team throughput and quality overall (both internal and external), and it can understandably make it feel a bit nebulous as to what QA's responsibilities are exactly after the change has been made. But that's because it is, and that's the point. While I've laid out some of those options above, it's ultimately up to the team to determine where the tester's newfound time, energy, and passion can be directed, and that direction can change from day to day.

Remember that, in Agile, teams are _self-organizing_ that need to be _trusted_ to get the job done. So it's up to the team, not management, to figure out where the tester can add the most value.

# A note to management

> Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.

Your expectations fundamentally need to change if switching to Agile is going to work.

Your goals will be to facilitate the team and the individuals in it. You'll need not just avoid being an obstacle for them, but also to eliminate obstacles where you can. For example, if the team's presence is needed in a meeting only so they can update others, you can attend that meeting on their behalf to maximize the amount of time the team can be working.


Leading up to and during this change is probably where your role will be the most important of any member on a team.

Many will fear this change, and you will need to assuage those fears. A cultural change is needed, and you will need to drive that change.

## Programmers

Programmers may be concerned because they might think that they'll have a larger work load, be less productive, or suddenly be responsible for quality.

They will need help to understand that their pace won't be changing, and the only difference is that they'll be wasting _far_ less work. They'll also need to understand that quality _truly_ is everyone's responsibility, and they will be expected to hold other team members accountable as well (often through code review).

## Testers

Testers may be nervous because they won't have a defined series of testing stages to fall back on to know whether or not they are performing well. There's not always going to be tickets or strict processes to guide what they do each day. They may be also be concerned that they don't have the skills to cut it, or that they can't point to the number of tickets they've QA'd to show they're being productive.

You can guide them in this transition, help them work with the team to find areas they can provide value, or point them to resources that can help build up their skills/knowledge.

You will need to reassure them that how many bugs they find isn't a concern, because the focus is on _preventing_ bugs in the first place, not _detecting_ them. If they're concerned about their abilities, you will need to _actively_ help find them ways to build up their skills. There's many books out there (_Agile Testing_ by Lisa Crispin and Janet Gregory is a great start), online courses for things like critical thinking and logic, mentor programs (which can even be offered internally), communities (e.g. The Ministry of Testing [website](https://www.ministryoftesting.com/) and [slack](https://www.ministryoftesting.com/slack_invite)), etc.

## Be _active_

Many may not truly understand the implications of this change, or know what questions to ask, and _many_ will be too afraid to ask questions in the first place because it might indicate incompetence or weakness (it seems irrational, I know, but there's a lot in play).

**Do not wait for them to come to you.**

You may need to seek them out individually (preferably in private), make it clear to them that it's in _your_ best interest to level them up, and possibly provide resources to them without being asked. It can often be easier to accept help when it isn't framed in the context of actually needing it.

Books like _Agile Testing_ by Lisa Crispin and Janet Gregory or _Clean Code_ by Robert C. Martin ("Uncle Bob") are incredible resources, and communities like The Ministry of Testing [website](https://www.ministryoftesting.com/) and [slack](https://www.ministryoftesting.com/slack_invite) can provide them with an outside place for help (where there's less pressure). And if they don't need the help, they're still useful.

## Be _patient_

> Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.

Motivated individuals _will_ try to get the job done on their own. It's the _environment and support_ that they need from you.

_Things_ (e.g. equipment, software, permissions) can be provided by the company without any significant effort (of course money is a concern though), but some might _not_ have the knowledge and skills it takes to get the job done on time, or effectively, in a newly Agile environment. That doesn't mean you can't help them there, though. You can help them find resources, like the books and communities I mentioned above, and work with them to make sure they're making progress.

Now, obviously, if someone was hired to be a programmer, but can't program, then they can't do the job _at all_. But if someone has proven capable of getting it done (e.g. the programmer had no problems with the technical challenge when they were hired), and they are a motivated individual, then it just comes down to find ways to help them be more productive (assuming they at least mix well in their team).

For example, maybe they could use some lessons on touch typing (there's a _ton_ of free websites for exactly this). Or maybe they don't know how to use tools for performance/load testing. Or maybe knowing about how a certain framework really works under the hood [could save them a ton of time]({% post_url 2020-04-10-grey-box-react-redux-part-2 %}).

Or maybe it's the process itself that's holding them back and you can take a hard look at it to identify ways to make it smoother.

# How to get there from here

This is not about having the developers do the "testing", but that is a good next step, and Atlassian has laid out a general transition plan for that [here](https://www.atlassian.com/agile/software-development/qa-at-speed) (although it's in the video), and even outline what QA does there after that change.

This is just about having the developers write the tests (i.e. "[checks](https://www.developsense.com/blog/2009/08/testing-vs-checking/)", but we call them "tests") for their tickets as part of their development process (i.e. before it goes to code review).

No transition is really necessary, but some programmers may fell uncomfortable having to come up with those tests on their own. If this is the case, then they can always reach out to the tester so they can work together, both in coming up with those tests, and actually writing them out. But eventually, they should be comfortable with testers not being their safety net.
