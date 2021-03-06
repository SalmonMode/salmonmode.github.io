---
layout: posts
title: '"What would QA do all day?"'
excerpt: "If the developer wrote the tests for their tickets, what would QA do all day? More importantly, what are the implications of that question being asked in the first place?"
date: 2020-08-26 16:00:00 -0500
---

![John C. McGinley's character in Office Space saying "what would you say you do here?"](/images/what_would_you_say_you_do_here.gif){:height="auto" width="100%"}

Whenever I've proposed **having the programmers write the tests for their tickets** in order to follow Agile principles, I almost always get asked, by other developers, management, and even some in _QA_, in one way or another, what QA would do all day if they weren't performing those tests.

The question assumes that the _only_ things a tester is there for are to verify the acceptance criteria of tickets after a programmer's changes for that ticket get through code review, and possibly for the tester to perform a suite of regression tests at the end of each sprint. It assumes that the tester, through this process, will catch any and all problems that might exist. It assumes the tester is the team's quality safety net.

The fact that the question was asked carries many implications, and I'll try to cover the ones I find to be the most concerning.

# Misunderstanding Agile principles

Many places claim to be "Agile", and I believe that they think they are.

Unfortunately, I think many of them conflate Agile and Scrum, and misconstrue [the principles laid out in the Agile manifesto](https://agilemanifesto.org/principles.html) as benefits to be gained, rather than a set of principles that they need to _actively uphold_ and that can't be cherry picked.

I have a feeling they think Scrum is a recipe for success that will help their development to be sustainable and to produce high quality software faster.

It's a noble effort to seek out changes that could help development team(s) move faster and more effectively. But, unfortunately, a process change to Scrum is not going to do that on its own.

Agile requires a _systemic and cultural_ change and takes [discipline](https://youtu.be/ecIWPzGEbFc?t=3817). Part of that discipline is making sure that quality is never sacrificed, particularly [internal software quality](https://twitter.com/GeePawHill/status/1292450480426188802) (ISQ).

## In Agile, _programmers_ write the checks

I know I may be losing some of you already, so as a transparent appeal to authority, [here's the same message from Atlassian](https://www.atlassian.com/agile/software-development/testing) (the folks behind Jira, Confluence, Trello, and Bitbucket).

This may have been enough to convince some of you, and if it did, great! There's no need for you to read through the rest of my long-winded post, unless you still need to convince someone else.

If not, but it was enough to at least get your attention, you might be wondering what else _I_ could add.

I wanted to explore this a bit more than that Atlassian article, and provide some alternate takes as well as some cultural impacts I've seen in places that follow "mini-waterfall" (i.e. waterfall, but in Scrum). I want to provide those that _aren't_ in QA with some insight into not just how these issues can affect the quality of the product, but also how they affect the _people_ in QA. I also want to help others identify where their potential frustrations may be coming from, help them articulate the source of the problem to others, as well as provide a solution to anyone experiencing these problems.

I know this isn't a QA versus programmer issue. I know that the core issue negatively also affects programmers, and I know that having the programmers write the checks, by itself, won't actually solve the core issue. I'll be addressing the core issue, and explaining, at least at a surface level, how to solve it down below. 

I'm primarily focusing on the impact on QA here, because, as someone who comes from both camps, I see it disproportionately impacting QA in a particularly egregious way, and on a much deeper level than just making them work overtime every sprint (although it does that, too).

**Note:** To be clear, this is not an argument in support of TDD or TFD. While I believe those can contribute to overall productivity, this is only meant to highlight and explain the requirement that programmers must write the checks as they make their changes (not necessarily _before_, as per TDD/TFD), before they check them in for code review.
{: .notice--info}

## Why programmers write the checks

> Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.

There's many reasons, but the big hitters (IMO) revolve around **sustainability**, and there's many perspectives to view the issue, so here's a collection of them. Hopefully one or two will hit home. I may also add more to this later.

### Understanding the ask

I recently heard [a mantra that a team was using](https://youtu.be/1XSxrqveWDg?t=1856), and it stuck with me.

> If you don't know how you'll test something, then you have no right to start development.

I've heard programmers many times say something like "that's a skillset we don't have", or "that requires a different mindset".

Yes it is, and no it doesn't.

The automated checks that are being asked of them to write are the ones that testers are doing manually. But the reality is that coming up with all these checks should be the easiest part of development. If a programmer couldn't do this, I wouldn't want them working on the code, because it means they don't actually understand what the ticket is asking for, and that's a massive problem.

The programmer should be asking questions if they don't fully understand the ticket. Ideally, the tickets would be fleshed out enough before they see it so that they wouldn't have to ask questions (the person asking for changes should be making it absolutely clear what they're asking for).

### Accumulation of manual checks

Hopefully we can at least agree that, unless the checks are automated, the manual checking work for QA will quickly become unsustainable. If not, I'll defer to that Atlassian article above.

### The math doesn't add up

Example scenario:
- a dev team consists of 1 tester and 5 programmers
- the tester checks all the changes made by the programmers when they pass their tickets to the tester for QA (after going through code review, of course)
- the sitting cycle is 2 weeks long
- the last 2 days of the sprint are reserved for the testers to do regression checks and for programmers to fix those bugs (if any are found)
- if the programmers aren't fixing any bugs during those last 2 days, they'll continue to work on tickets for the next sprint.

This probably sounds somewhat familiar.

Let's also say that each programmer can complete one ticket and code review another every 2 days, and it takes the tester roughly 1 hour to check each ticket manually.

If work is done by everyone, every day of the sprint, that's 25 tickets each sprint, which means roughly 25 hours of checking the tester has to do each sprint.

If it takes another 1-2 hours to automate the testing of each ticket (to keep things sustainable), then that's a total of 50-75 hours of checking-related work the tester has to do every sprint.

Having 70+ hours of productive work hours available _exclusively_ for new changes every sprint is not a realistic expectation.

Expecting 50 hours _might_ be reasonable, but don't forget about the daily standups, sprint planning/backlog grooming, possible retrospective, and any other inevitable meetings.

Since there's only 8 days available for that type of work, that means there needs to be _at least_ 6-7 hours of free time available every one of those 8 days.

Of course, this is just an example, but it's a realistic scenario that I'm sure many testers can relate to. I've personally worked with systems where developers would _regularly_ make 10-20 line changes in a couple hours and then say those changes required a full regression check run because everything was so tightly coupled to the parts they changed.

This sort of system is _primed_ to make QA a bottleneck, and it's very easy for the development to slow down and for quality to be compromised because of it. You _could_ put more QA folks on each team, but that doesn't entirely eliminate the problem.

If programmers are writing those sorts of checks up front, then the bottleneck is eliminated completely, and QA's time is freed up so they can add much more value to the team (or more specifically, so they can get ahead of potential threats to the product's value).

### Check suite execution time

If the tester is the one writing the checls, they'll likely be writing them at the end-to-end level. That level is _extremely_ expensive to run at, and each check will require a significant amount of time, especially if a browser is involved. Every check added that runs at that level will add a _considerable_ amount of time to the check suite execution time. The checks need to done at lower levels where possible so they only add a negligible amount of time, otherwise, it'll grow out of control very quickly.

### Wasted work

Context switching has a cost, and it's an expensive one. The more times a ticket changes hands, the more times someone had to switch contexts. It's less costly to have the programmer write their own checks, because there's less context switching, especially since there's no chance of a ticket being bounced back and forth between "in progress", "code review", and "QA".

To add to this, testers aren't likely to write their checks at the unit/component level where most could be. Instead, they're likely to write them at a level that goes through the API or browser. Not only is this significantly more expensive in and of itself, but those checks are far more likely to have to change based on unrelated implementation (e.g. the structure of the DOM could change slightly, requiring now locators to be defined).

This all translates to wasted work, i.e. the energy that went into it could have definitely gone into something that would yield a higher ROI.

### Maintaining ISQ

> Continuous attention to technical excellence and good design enhances agility.

"Tech debt" is named that way, because it's borrowing velocity from the future. The part that many seem to forget, is that **debt accrues interest**. By borrowing velocity from the future (whether intentional or not), it can both create an artificially inflated velocity for the current sprint, and increase the overall work that needs to be done to get to the desired end result.

When tech debt is consciously added by sacrificing ISQ in an attempt to get something out the door sooner, it is, in effect, a sort of lie (to management and ourselves) about what the team's capacity is for normal sprints, and it will inevitably lead to release date estimates that are far sooner than is practical, which, of course, leads to crunch time.

Maintaining ISQ is essential for moving forward at a sustainable pace, and [is well worth the investment](https://martinfowler.com/articles/is-quality-worth-cost.html).

Having the programmer write the checks helps them identify problematic areas of the code that need attention, and keeps them mindful of ISQ. The most cost-effective way to have those checks implemented while also maintaining ISQ, is to have the programmer write them (and not just the happy path checks) as they make their changes.

# Disregard for quality (both internal and external)

Programmers have no actual reason to be concerned with quality, either external or internal, if they aren't the ones writing the checks.

It becomes almost impossible to hold them accountable for poor external software quality (e.g. bugs), because they can always say ["why didn't we catch this in QA?"](https://www.developsense.com/blog/2020/08/why-didnt-we-catch-this-in-qa/), which has its own problems.

Internal software quality is something they _are_ accountable to, but they can always brush it off to get by, and lack of it is not something that management can easily identify. So as long as they can get _something_ done that roughly meets the acceptance criteria of a ticket, they can point to someone else (or _something_, e.g. the code itself), since they can say they did their part. They might point at QA to say they should have caught it, or at whoever wrote the ticket for not being explicit enough, or the code base because it has poor internal quality (e.g. "our product is complex, and so is our code").

It's not that they don't care. It's just that they don't have the knowledge and the experience to understand the implications of this, they are highly motivated to move on to the next ticket, and there's a belief that QA will find any and all problems anyway. They may even believe that passing everything off to QA for the checking is what it means to care about QA.

Alternatively, it might be that the programmers are being pressured by management to not maintain ISQ, because management doesn't understand why it's so important, and they think it's a way to get things done sooner. The programmers may be fully aware of the problems, but feel they either can't do something about it, or don't know how.

# Disregard for QA

[I mentioned it already](#the-math-doesnt-add-up), but the math just doesn't work out.

I mentioned it above, but the sorts of things testers are checking in this situation are the functional requirements, and figuring out what these are and how to check them should really be the easiest part of the process. But everyone involved has convinced themselves that doing this somehow requires a special mindset or skill set.

Additionally in this situation, the testers are often expected to be writing the automated checks (as if that'll somehow make this sustainable) at the end-to-end, browser, or API level, which are the most complex, difficult, and expensive levels to check things at. But they've been given the task because we think of it as somehow being easier than normal software development.

They've simultaneously been given an easy task and told it was hard, and a task that is incredibly difficult and told it was easy.

Testers are often too afraid to speak out for fear of seeming weak, incompetent, or disloyal to the company, so they just tough it out. And if they _do_ speak out, they may be brushed off, and be told that they "just need to do what it takes", or that they should manage their time better.

To meet the deadlines set for them, they may often have to cut corners, work through other meetings (when they should be paying attention), skip no-critical (and sometimes culturally-significant) meetings, work through their lunch "break", work overtime, not take vacation, and/or work _through_ their vacation. They may not even be _allowed_ to take vacation (especially at the same time as a deployment).

This isn't healthy, nor is it practical.

This isn't to say that QA wasn't considered initially. They probably were. It's likely that this issue just wasn't forseen because it's how it's been done in waterfall for decades, so there wasn't any reason to believe the process should be any different in that regard.

But be aware that this is often their reality, and is what's being asked of them when the programmers aren't writing the checks.

# Toxic culture

Kent Beck (one of the original signatories of the Agile Manifesto) highlights in their book _Extreme Programming Explained_ that nobody wants to be seen as the bottleneck in a "push" development model where everyone plays one specific role, and they will do whatever they can to not be seen as the constraint.

This encourages a very self-centered (in the literal sense, not necessarily implying greed), and possibly even fearful mentality. People are more concerned with not being a bottleneck, rather than how they can help others for the sake of overall team throughput.

They might also be afraid to ask for help, possibly because they fear their competency will be questioned, or that asking is a sign of weakness. Or they may just feel like they wouldn't get help if they did ask.

Nobody wants to ask how they can help someone because that might slow them down and possibly make them look like a bottleneck.

This mentality encourages the siloing of responsibilities, which, in turn, builds walls between programmers and testers, making testers into outsiders. Even if all members of the team get along well, it becomes, on some level, two teams within one, where the testers are (usually) outnumbered by the programmers, making it more difficult for their voices to be heard.

# Fear from QA

I think Lisa Crispin and Janet Gregory nailed it in their book _Agile Testing_. They said most of it boils down to _fear_. They explained (among other things) that testers might not know what else there is to do, and even if they do, that they might be afraid they don't have the skills to cut it.

If all they've ever known is checking criteria from tickets, there can be a sense of security in that. It has a very clear line where they can say "ok, I did my job. I'm done." If they get that work done, then they have nothing to fear regarding job security. It may not be _fulfilling_ work for them, but it _will_ at least pay the bills.

This fear is entirely understandable, and shouldn't be ignored. It'll take a culture change to make them feel like their job security isn't under constant threat.

But the only thing that should really matter in Agile is whether or not the _team as a whole_ is delivering, and, on an individual level, whether or not a person is adding value to the team, regardless of what they're doing to add that value.

In Agile, the roles are flexible. If there's work to be done, anyone on the team can do it, and if one person actually can't, then it's a great opportunity for pairing.

# What QA _would_ do all day

Anyone can do anything on an Agile team. So long as the tester (or any other team member) is providing sufficient value to the team in one way or another, that's all there is to it.

But I'm sure some reading this are looking for more testing-related activities for the testers to be doing all day. So here's a sampling of things.

## Risk assessment

One of a testers main roles (maybe even _the_ main role) is to inform Product (meaning whomever is in charge of the direction the team moves in) about risks (and possible costs), so that _Product_ can make the call on quality. It's not a tester's place to dictate what is quality and what isn't, but rather to inform on things they feel are a _potential threat_ to quality. This usually includes things about the product itself, but can really be anything. Their goal is to make sure Product is aware of the risks (and potential costs) so that they can be the responsible party and make the necessary business decisions, because it's _Product's_ risk to take, and _their_ price to pay, not testers or programmers.

Keep in mind, having to crunch or having the engineers skip writing the autoamted checks is _not_ Product paying the price of their risks. Nor is it a demonstration of loyalty. It's the engineers and testers paying the price when it wasn't their risks to take.

### Exploratory testing

[There is a difference between "checking" and "testing"](https://www.developsense.com/blog/2009/08/testing-vs-checking/), and I've taken care to only refer to "testing" where appropriate (i.e. "tests", "checks", and "checking" are different than "testing").

Emergent behaviors exist in areas and in ways we didn't originally account for. They exist at the boundaries between the things we've planned for, which is why they're called "_edge_ cases". While exploratory testing is partially about learning, it's this learning that provides new check cases to cover when we find something that goes wrong, or something we feel could be better.

### Performance and load testing

The tester could really try to tax the system in order to see how it handles it. If the tester finds any problems, they can raise them as concerns.

### Metrics

The tester can look for ways to improve team throughput and internal software quality by gathering metrics and looking at the process itself. They can look at things like cyclomatic complexity throughout the code base, or even use tools to see what parts of the code are associated with the most defects to see where the code needs attention before it becomes (more of) a problem.

### Programmer collaboration

If a programmer needs help determining the check cases for a ticket, or possibly needs help tracking down a supposed bug, they can work directly with the tester to get it done.

They can also work with the programmers to help build up their testing mentality/skills, helping them to understand the value in only involving one thing per test and how to control for things they don't want to involve.

### Atlassian's approach

Atlassian switched to this approach a while back, and made [this article](https://www.atlassian.com/agile/software-development/qa-at-speed) going over how they transitioned to it and the benefits they gained from it. They also cover exactly what QA then does all day (in the video, at least).

They even stopped referring to QA as "Quality _Assurance_", and used "Quality _Assistance_" instead.

# Support role

The tester effectively takes on a _support_ role, operating, for the most part, outside the sprint's tickets (unless they have tickets to do themselves). [They'd become "Quality _Assistance_" rather than "Quality _Assurance_"](https://www.developsense.com/blog/2010/05/testers-get-out-of-the-quality-assurance-business/). With the free time they've gained from not having to do the checks of all the tickets, it opens the door to a staggering number of options.

This change will likely be a massive boon to team throughput and quality overall (both internal and external), and it can understandably make QA's responsibilities feel a bit nebulous. But that's because it is, and that's the point. While I've laid out some of those options above, it's ultimately up to the team to determine where the tester's newfound time, energy, and passion can be directed, and that direction can change from day to day.

Remember that, in Agile, teams are _self-organizing_ and need to be _trusted_ to get the job done. So it's up to the team, not management, to figure out where the tester can add the most value.

# A note to management

Your expectations of the team, how you work, and how you believe the development process works, fundamentally need to change if you want to have a remotely predictable process.

You _cannot_ expect to have fixed cost, fixed time, fixed scope, and fixed quality. Something _has_ to be variable. This isn't a factory line, and there _are_ unknowns, so something will have to give.

I recommend scope, because setting dates for things is a normal part of business operations, we want to keep costs low, and scope is the easiest to regulate when you start off knowing that you'll have to regulate it.

Operate as if having the team work overtime, or having the programmers not write the automated checks, are completely off the table as options.

In a pinch, you _can_ ask them to cut out the automated checks, but understand that:
1. it isn't the tester's responsibility to verify functionality for those changes and a lack of regression as a result of them, 
2. it's _very_ likely that some expensive bugs will make it through and this is neither the programmers' nor testers' fault, and that
3. the cost for this is that the programmers will have to spend _more_ than the amount of time you "saved" cleaning up right after that deadline if you ever want to have predictable and _you_ will be on the hook for any bugs that pop up as a result because _you_ chose to take the risks involved.

So unless you're _right_ up against the deadline, this isn't going to be a good choice.

Plan things so that you can take things out if you need to in order to make deadlines.

Work _daily_ with engineers and testers to make sure you always know if something will need to be cut out, and what actually _can_ be cut out (and sometimes, what can be brought _in_).

Work with the testers to find out about the risks that exist and what the costs of those risks are.

If a tester sent you this blog post, then they've done exactly that. They're making you aware of the risks in play, what the costs are, and asking you how you would like to proceed.

If you weren't aware of the risks you were taking, or who was paying their prices, that's entirely understandable. But continuing to operate this way is not just ineffective and costly, it's also _extremely_ harmful to the people on your team.

> Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.

Your goals will be to facilitate the team and the individuals in it. You'll need to not just avoid being an obstacle for them, but also to eliminate obstacles and build team members up where you can.

Leading up to and during this change is probably where your role will be the most important of any member on a team.

Many will likely fear this change, and you will need to assuage those fears by making sure they understand they will _not_ be paying the price for risks that you choose to take.

### Regarding programmers

Programmers may be concerned about having a larger work load, being less productive, or suddenly being responsible for quality. And, as I mentioned above, they will most certainly be concerned about being the bottleneck (e.g. "Writing the tests would just slow me down").

It's important to acknowledge the concerns they bring up. They may be focusing on their own issues, and believe them to be the issues of the team as a whole. Them and their productivity have usually been the driving forces behind decisions for so long that this shouldn't be surprising. It's not necessarily that they're being selfish, and could be because "team productivity" has been conflated with "programmer productivity" by everyone.

They will need help to understand that their pace won't be changing (and more likely will be _slowing down_, or rather, be less frantic), that they will only be expected to move as fast as **maintaining quality** allows them to, and the only difference is that they'll be wasting _far_ less work. They'll also need to understand that quality _truly_ is everyone's responsibility, and they will be expected to hold other team members accountable as well, yourself included.

They'll need to know that they are always free and encouraged to speak out if they feel they won't be able to identify all the ways they'd need to verify functionality (as this usually means the ticket is too vague).

But most importantly, they _need_ to understand that _if_ you choose to take risks by setting tight deadlines or by telling them to throw ISQ out the window for a brief period, that _you_ are the one that'll be paying the price if/when things go wrong, not them, and that more time will be alotted to repair the damage to ISQ.

### Testers

Testers may be nervous because they won't have a defined series of testing stages to fall back on to know whether or not they are performing well. There's not always going to be tickets or strict processes to guide what they do each day. They may be also be concerned that they don't have the skills to cut it, or that they can't point to the number of tickets they've QA'd to show they're being productive.

You can guide them in this transition by helping them understand the areas/metrics/functionality that you're most concerned with, and what the costs might be from things that threaten those things. If they know what you care about and why, they'll understand how to consider risks.

You will need to reassure them that how many bugs they find isn't how they'll be evaluated, because the focus is on _preventing_ bugs in the first place, not _detecting_ them (although detecting them is still valuable). If they're concerned about their abilities, you will need to _actively_ help find them ways to build up their skills. There's many course (e.g. [RST](https://rapid-software-testing.com/)) and books out there (_Agile Testing_ by Lisa Crispin and Janet Gregory is a great start), mentor programs (which can even be offered internally), communities (e.g. The Ministry of Testing [website](https://www.ministryoftesting.com/) and [slack](https://www.ministryoftesting.com/slack_invite)), etc.

## Be _active_

Many may not truly understand the implications of this change, or know what questions to ask, and _many_ will be too afraid to ask questions in the first place because it might indicate incompetence or weakness (it seems irrational, I know, but there's a lot in play).

**Do not wait for them to come to you.**

You may need to seek them out individually (preferably in private), make it clear to them that it's in _your_ best interest to level them up, and possibly provide resources to them without being asked. It can often be easier to accept help when it isn't framed in the context of actually needing it.

Books like _Agile Testing_ by Lisa Crispin and Janet Gregory or _Clean Code_ by Robert C. Martin ("Uncle Bob") are incredible resources, and communities like The Ministry of Testing [website](https://www.ministryoftesting.com/) and [slack](https://www.ministryoftesting.com/slack_invite) can provide them with an outside place for help (where there's less pressure). And if they don't need the help, they're still useful.

## Be _patient_

> Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.

Motivated individuals _will_ try to get the job done on their own. It's the _environment and support_ that they need from you.

_Things_ (e.g. equipment, software, permissions) can always be provided by the company (so long as it's not too expensive), but understand that some might _not_ have the knowledge and skills it takes to get the job done as quickly and effectively as it _could_, in a newly Agile environment. That doesn't mean you can't help them there, though.

You can help them find resources, like the books and communities I mentioned above, and work with them to make sure they're making progress.

If they're already decently skilled and are working hard, then you can look at the process itself to see if there's any changes that could be made to speed things up.

And don't be afraid to jump in and get your hands dirty with team work as well, especially if a deadline is approaching.

You have a vested interest in the team, so your goal is to maximize your ROI by building the team up, and there's plenty of opportunities for that.

# How to get there from here

This is not about having the developers do the general "testing", but that is a good next step as everyone on the team should always be critical of the product. Atlassian went through this already and laid out a general transition plan for that in the video [here](https://www.atlassian.com/agile/software-development/qa-at-speed).

This is just about having the developers write the tests (i.e. "checks" by how they're defined [here](https://www.developsense.com/blog/2009/08/testing-vs-checking/)) for their tickets as part of their development process (i.e. before it goes to code review).

No transition is really necessary, but some programmers may feel uncomfortable having to come up with those checks on their own. If this is the case, then they can always reach out to the tester so they can work together, both in coming up with those checks, and actually writing them out. But eventually, they should be comfortable with testers not being their safety net.
