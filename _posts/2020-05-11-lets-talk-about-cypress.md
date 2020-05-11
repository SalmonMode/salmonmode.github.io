---
layout: posts
title: "Let's Talk About Cypress"
excerpt: "There's some fundamental issues with the claims that Cypress makes of themselves that need to be acknowledged. Let's take a look at their claims and see if they're valid."
date: 2020-05-11 08:00:00 -0500
---

Before we dive in, I want to be absolutely clear. This is not meant to be an attack on Cypress, nor those that use it. This is meant to acknowledge the issues that Cypress has, as well as the harmful claims made in its marketing and documentation. I also hope to outline a path that Cypress can take to undo the harm done, help testers in a more meaningful way, and make the testing world a better place.

I know the Cypress team has put an enormous amount of effort into creating their toolset, and I don't believe they are trying to be harmful to testing as a whole. I believe they have good intentions, but didn't realize the effect their claims could have, and didn't fully understand the waiting problem. I believe they, like many others, got frustrated with Selenium and built a toolset that they believed firmly solved the problems they were seeing.

Unfortunately, their solution doesn't work, and in trying to market their tool, they're undermining the hard work done by the Selenium team and the W3C, and leaving the testing world worse than how they found it. Again, that clearly wasn't their intent, but that's the reality.

I also want to note that my comments don't apply to their Dashboard and the features it provides. This is only related to their test runner and their tools that they built the runner around.

## What's the problem?

Not only does Cypress make numerous outright false claims on their website, and in their documentation, but they also take several opportunities to misrepresent Selenium in a negative light. Some of the claims they make also inadvertently encourage engineers to write inherently flaky tests, rely on fundamentally inferior architecture, and write less effective tests. They also further the misconception that tests are somehow "lesser" code and that QA Engineers are somehow less-capable engineers than other developers.

Again, I know this wasn't their intention. But this is the result.

### Let's get some things straight

First, let's establish some things to be true so we can be on the same page moving forward. Many of Cypress's false claims depend on these being false, so establishing them as true makes debunking their claims a bit more straightforward.

#### Selenium is _not_ flaky

I covered this in [my last post]({% post_url 2020-05-10-is-selenium-flaky %}), because it's an important topic to go over, and there's a lot to go over to cover it thoroughly. The TL;DR is this:

Selenium isn't flaky; your tests are. There is no universal way to determine automatically when a page is ready to be interacted with. It's a form of [the Halting Problem](https://en.wikipedia.org/wiki/Halting_problem), which is an unsolvable problem. Any tool claiming this as a capability is wrong.

When writing end-to-end tests, it's up to us to use "explicit waits" that manage when our tests believe it's safe to move forward. No tool can do this for us automatically. This is exactly what we signed up for when we started writing those tests.

#### Selenium is a thin wrapper around the WebDriver Protocol

Back in the day, Selenium created and used the JSON Wire Protocol. It worked very similarly to how the WebDriver Protocol works today, but it wasn't officially supported by browsers, and it was proprietary.

Since then, the W3C has established the WebDriver Protocol as a standard, and Selenium has been adjusted so that it now wraps that protocol instead of the JSON Wire Protocol.

#### The WebDriver Protocol is engineered by the W3C specifically for the purposes of automated end-to-end testing

The protocol is specifically made so that engineers can write effective automated end-to-end tests. It acts as an entry point for your tests into a part of the browser that lets them do whatever they need to do with the browser to perform the test. The only real limitation with the protocol, is that it's limited to the entire browser, and nothing more, so the fact that it's normally accessed remotely, poses zero limitations on its potential.

It works the way it does, because that's _exactly_ the behavior that was decided on when they wrote up its specification.

That was the chosen behavior because that's what over 400 members, in quite possibly the greatest collection of software engineers ever assembled, decided _together_ would be best for automated tests. 

If the W3C had a new loading strategy (instead of the ones that just wait based on the `document.readyState`), that is to say, a new way to automatically wait for the page to be in a particular state of readiness, they could just include it in the next revision of the spec. The access and control such a strategy would need to work properly doesn't matter (so long as it was contained to what goes on in the browser).

#### The W3C cares about our needs as QA Engineers doing end-to-end tests

The W3C is made up of _hundreds_ of members. This includes Google, Mozilla, Microsof, and Apple, who each make the 4 most popular web browsers. They each have incentive to make the WebDriver protocol (and the behaviors it has access to) the best it can be, and to make sure their browsers fully support the protocol.

If there is a better way to accomplish something, they will always adopt it (even if they weren't the ones to come up with it).

#### The WebDriver protocol has direct access to the JavaScript runtime of the browser it's driving

This may seem obvious, but it's important to note.

WebDriver, having the access that it does to the JavaScript runtime of the browser, can do quite literally everything in that runtime that something running inside it can do, and more. 

## The claims

There's honestly a _lot_ to cover, and I'm going to do my best to cover as much as I can. To keep it as short as possible, I'm gonna go through in a sort of rapid fire approach, providing a claim they made, where they made that claim, why the claim is false, and, if relevant, how that claim is harmful.

### "Cypress is based on a completely new architecture. No more Selenium. Lots more power."

Sources: [1](https://web.archive.org/web/20200424230919/http://www.cypress.io/)

#### How is it false?

For one, it's not exactly "new" architecture. It's actually very similar to how the earlier versions of Selenium worked (before the W3C established the WebDriver protocol as a standard), except that it uses node.js for the standalone server, instead of Java. The other difference is that Cypress, by avoiding the WebDriver protocol, has now created a proprietary solution, which goes against everything the web stands for.

It also makes a false claim of it providing you with more power than Selenium. However, as I mentioned above, WebDriver has direct access to the JavaScript runtime of the browser it's controlling, and it's often used through some language bindings, e.g. Selenium for node.js. This means that not only can it do everything Cypress can do, both in and out of the browser, but it can do even more _because_ it's using the WebDriver protocol (as it has access to more behavior).

By definition, Cypress is a proprietary solution, going against what the web stands for, and is less powerful because it has access to fewer behaviors.

#### How is it harmful?

It clearly takes a jab at Selenium here, implying that Selenium is inherently problematic and those that use it will be free of a burden once they switch away from it. It also suggests that WebDriver is somehow not a good standard, and that their proprietary solution is somehow better. 

They shouldn't have to say false, negative things about the tool that spent over 15 years pushing to create a formalized standard for browser-based testing, just to convince you that their tool is somehow better.

### "What sets Cypress apart/Game Changers: Debuggability"

Sources: [1](https://web.archive.org/web/20200424230919/http://www.cypress.io/) [2](https://web.archive.org/web/20200426195740/https://www.cypress.io/features/)

#### How is it false?

Debuggers have been around for decades. They're nothing new, and Cypress isn't any more debuggable than any other library.

#### How is it harmful?

It again implies that Selenium is the problem by suggesting it has confusing errors and somehow isn't debuggable. It's errors are actually quite clear if you consider the stacktrace provided when it throws one and the context for how it was used, but that's a requirement to understand the errors of any library, including Cypress.

### "What sets Cypress apart/Game Changers: Real Time Reloads"

Sources: [1](https://web.archive.org/web/20200424230919/http://www.cypress.io/) [2](https://web.archive.org/web/20200426195740/https://www.cypress.io/features/)

#### How is it false?

Triggering a rerun of tests on file changes has also been around for decades. It would be false to claim this is somehow unique to Cypress.

#### How is it harmful?

I wouldn't say this is exactly harmful, because, unlike the "debuggability" feature, the phrasing in its description doesn't imply any comparisons to Selenium, and this seems more like just advertising a feature of the IDE it provides (at least, that's how it comes off to me).

### "What sets Cypress apart/Game Changers: Automatic Waiting"

Sources: [1](https://web.archive.org/web/20200424230919/http://www.cypress.io/) [2](https://web.archive.org/web/20200426195740/https://www.cypress.io/features/)

#### How is it false?

I mentioned this in [my previous post]({% post_url 2020-05-10-is-selenium-flaky %}), but basically, this would be impossible, as the waiting problem is a form of [the Halting Problem](https://en.wikipedia.org/wiki/Halting_problem). It can't be solved.

Cypress does some things to make it at least _seem_ like it's doing some automatic waiting, and, technically, it is. But what it's waiting for doesn't do much to actually make your tests not flaky (note: see [my previous post]({% post_url 2020-05-10-is-selenium-flaky %}) for an explanation as to what "flaky" _actually_ means, but a test passing inconsistently is only a _symptom_ of flakiness, not the defining reason).

Claiming it handles all your waiting for you, and that you don't need to write any waits of your own, is absurd. As I said above, if Cypress's method for waiting actually _did_ solve the waiting problem, the W3C wouldn't hesitate to adopt their method. The reason they haven't, is because it's not a valid method.

#### How is it harmful?

This is a particularly egregious claim. Not only is it a ridiculous claim, but it's a dangerous one. It tells engineers to completely ignore a massive part of their responsibilities when writing end-to-end tests, and tells them that being ignorant of the nature of their test subject is fine, when it most definitely isn't. It gives them a fall sense of confidence in their tests, and if they were to believe this claim, it would mean that all their tests are built on the foundation of a lie, meaning their tests can't be trusted.

We simply cannot keep treating QA engineers like they shouldn't be able to handle these sorts of problems. That's not good for them as software engineers, nor is it good for the quality of the products they're responsible for.

We need to be teaching them how to handle these problems, rather than sweeping them under the rug and making things worse. If we are up front with them about the challenges of this line of work, they can be better prepared for it, and won't feel like writing tests is harder than it should be (as the discouraging nature of this makes it feel even more difficult).

### "Game Changers: Spies, stubs, and clocks"

Sources: [1](https://web.archive.org/web/20200426195740/https://www.cypress.io/features/)

#### How is it false?

These are just as old as debuggers. This isn't a "game changer" just because Cypress supports them. Almost every other language has supported them for decades.

#### How is it harmful?

This is just like real time reloads. It seems more like an advertisement rather than a comparison against Selenium.

### "Game Changers: Network traffic control"

Sources: [1](https://web.archive.org/web/20200426195740/https://www.cypress.io/features/)

#### How is it false?

This can be done without Cypress, as well.

#### How is it harmful?

This (incorrectly) implies you can't do this when using Selenium, which is just adding more toxicity to the testing world by attempting to libel Selenium further.

### "Game Changers: Consistent results"

Sources: [1](https://web.archive.org/web/20200426195740/https://www.cypress.io/features/)

#### How is it false?

It can offer no more consistent results than Selenium can. They claim this because they claim they've solved the halting problem, but as I mentioned above, that would be impossible, meaning they can't guarantee consistent results.

#### How is it harmful?

This is yet another attempt to make Selenium look bad in comparison. They even try to throw Selenium under the bus by saying 

> Our architecture doesn’t use Selenium or WebDriver. Say hello to fast, consistent and reliable tests that are flake-free.

Every attempt to make Selenium look bad adds further toxicity to the testing community, and undermines the work that the W3C has been doing.

### "Game Changers: Screenshots and videos"

Sources: [1](https://web.archive.org/web/20200426195740/https://www.cypress.io/features/)

#### How is it false?

This is also not unique to Cypress. This is actually done by plenty of other tools, like Zalenium. While I think Cypress put in effort to make these captures automatic, it being included in a list such as this, suggests it couldn't be done without Cypress, and I find that disingenuous.

#### How is it harmful?

Another non-harmful one. Just marketing.

### "Testing has been broken for too long."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is it false?

"Testing" isn't broken. It was _never_ broken. Testing is a scientific process with a well-defined set of steps (see: the scientific method). There's nothing to fix there. If you aren't following the process properly and controlling for confounding variables, then you can't blame the process. You can only blame yourself.

If you say that "testing" is broken, you're quite literally saying "the scientific method is broken", which is complete nonsense.

#### How is it harmful?

This is what I'm talking about. We can't keep encouraging engineers to disregard proper scientific practices by making excuses for them and telling them to blame their tools. 

 A _tool_ can't fix people that fail to follow the process properly. Only _education_ can fix that. By making excuses for these engineers, we encourage ignorance, and no one wins. We have to do better. We have to educate people, not sell them snake oil.
 
 
### "Until now, end-to-end testing wasn’t easy."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is it false?

Cypress doesn't make it any easier than using Selenium just because it gives you 1 command to install 11 packages. I can do that with Python, too:

```bash
python3 -m  pip install pytest selenium && brew install chromedriver
```

You're still gonna need to make page objects and structure your tests properly so that they're coherent and maintainable.

####  How is it harmful?

It makes more excuses for engineers and coddles them. It tells them they were never supposed to overcome these challenges because they weren't supposed to be part of the job. But that's unfortunately not true. It's a software engineering role and dealing with these challenges comes with the territory.

### "How it works: Before/After Cypress graph"

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is it false?

Cypress pretends it's only one package, but really it's just a bundle of 11 packages plus Cypress itself. All the packages in the "before" part are literally bundled inside itself, and then it pretends in the "after" graph that those are no longer needed.

Those packages are still being installed, and you're still gonna have to know how to use them.

####  How is it harmful?

I wouldn't say this is harmful. Just unnecessarily misleading.

### "7 ways Cypress is different: Cypress does not use Selenium."

> Most end-to-end testing tools are Selenium-based, which is why they all share the same problems. To make Cypress different, we built a new architecture from the ground up. Whereas Selenium executes remote commands through the network, Cypress runs in the same run-loop as your application.

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is it false?

Most end-to-end testing tools are _WebDriver_-based, not Selenium-based.

In addition to this, it falsely suggests that this inherently means they're flawed, and that's why you've had problems. In reality, it's because that's just the nature of the web, and their tool doesn't do anything to solve the problems you'd have either; it just creates the _illusion_ that it does.

#### How is it harmful?

It's more libel against Selenium, and thus, more toxicity and encourages others to _not_ use standards literally engineered foor the purpose of end-to-end testing.

### "7 ways Cypress is different: Cypress focuses on doing end-to-end testing REALLY well."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is it false?

In avoiding the standard that is the WebDriver protocol by creating their own, ineffective proprietary solution, they've undermined any validity their tool has. If they wanted to do end-to-end testing, it would have been much better to just build the tool around the WebDriver protocol.

#### How is it harmful?

This is more just unfortunate for them. Everyone can claim their tool is great for end-to-end testing, and that's fine. But they've managed to build something that is fundamentally less valid than the standard _because_ it's not using the standard. Had they just wrapped the WebDriver protocol, they'd be free to make this claim and it could be chalked up to marketing their product.

### "7 ways Cypress is different: Cypress works on any front-end framework or website."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is it false?

Cypress is directly comparing itself to Selenium and WebDriver with every item in this list. That means they are claiming that Selenium somehow _doesn't_ work on every frontend framework or website, which is completely wrong. Selenium is framework agnostic. A DOM is a DOM.

#### How is it harmful?

I must sound like a broken record by now, but it's more unhelpful jabs at Selenium.

### "7 ways Cypress is different: Cypress tests are only written in JavaScript."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is this false?

You can easily write tests entirely in JavaScript using any number of WebDriver protocol libraries. Nothing is stopping you.

#### How is this harmful?

I'm not sure if it is. It's just a bizarre limitation to make up.

### "7 ways Cypress is different: Cypress is for developers and QA engineers."

> One of our goals was to make test-driven development a reality for end-to-end testing. Cypress is at its best when you use it as you build your application. We give you the power to code as fast as possible.

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is this false?

TDD with end-to-end tests was possible _long_ before Cypress was ever incepted. 

#### How is this harmful?

It makes more excuses for engineers, and pretends that somehow Cypress will magically make all the challenges go away.

### "7 ways Cypress is different: Cypress runs much, much faster."

> These architectural improvements unlock the ability to do TDD with full end-to-end tests for the very first time. Cypress has been built so that testing and development can happen simultaneously. You can develop faster while driving the entire dev process with tests because: you can see your application; you still have access to the developer tools; and changes are reflected in real time. The end result is that you will have developed more, your code will be better, and it will be completely tested. If you opt for our Dashboard Service, parallelization and automated load balancing will further supercharge your test speeds.

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is this false?

Again, TDD with end-to-end tests was possible _long_ before Cypress was ever incepted.

This is actually really easy to prove:

Write any test that you could for TDD using Cypress. Before actually doing the development to get that test passing (as per TDD), convert it to a test that uses Selenium. You now have TDD using Selenium and not using Cypress.

#### How is this harmful?

It makes more excuses for poor tests, and pretends that somehow Cypress will magically make all the challenges go away.

### "Key Differences: Cypress has native access to everything."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is this false?

I said it earlier, but anything using WebDriver _also_ has native access to everything. Cypress isn't special here.

#### How is this harmful?

Yet more negativity towards Selenium.

### "Key Differences: A whole new kind of testing is possible."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is this false?

Literally no new kinds of testing are possible with Cypress. Any kind of testing you could do with Cypress already existed.

#### How is this harmful?

Yet more negativity towards Selenium, and more excuses for poor tests.

### "Key Differences: You can programmatically take shortcuts."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is this false?

You can do this with Selenium as well. Selenium doesn't "force you to act like a user". This just seems like a disingenuous claim to make.

#### How is this harmful?

Yet more negativity towards Selenium, and more excuses for poor tests.

### "Key Differences: Cypress is not flaky."

Sources: [1](https://web.archive.org/web/20200426173416/http://www.cypress.io/how-it-works/)

#### How is this false?

Cypress is just as flaky as Selenium. The difference is that Cypress recommends that you write your tests without waits, which means they're literally recommending that you write inherently flaky tests, despite their ineffective attempts at waiting automatically for you.

#### How is this harmful?

Yet more negativity towards Selenium, and more excuses for poor tests.

You may have noticed me copying and pasting the same critiques over and over again. Well, that's because there's a pretty common theme running through their website and the claims they make about their product, and I didn't see much point in breaking out the thesaurus to see how many ways I could write "they have completely unjustified hate for Selenium and will take every opportunity to attack it".

## That's just a few parts of their main site.

I didn't even get to their documentation, where they make even more negative, and incorrect claims about Selenium, and just incorrect claims about their product. And don't get me started on their "best" practices and "tips" (that'll probably be another post at some point).

But I think you get the point I'm making.

Cypress can not solve your problems of flakiness on its own, just as Selenium can't. But if you follow Cypress's guidelines, you'll _definitely_ be writing flaky tests by definition.

One thing I want to make clear is that, while I'm sure they have good intentions, they're constant and wide-spread defamation of Selenium is inexcusable. It's as if they take every single opportunity they can to take swings at Selenium and WebDriver (often conflating the two).

It's completely unjustified, filled with completely false information, spreads toxicity, and doesn't help anything other than possibly selling their product. I just wanted to put it somewhere so I could have it on the record, as well as provide a convenient reference for anyone that needs it (as is the goal with all my posts).

## So where can Cypress go from here?

Well, first, they should definitely remove all the outright false claims on their site, especially any unjustified negativity towards Selenium or WebDriver (critiques are fine, but don't just say false things), and most definitely the incorrect claim that it can wait automatically for you.

Everyone likes to embellish a little about their product, and that's fine. I tried to stay away from calling any of that out as much as I could because it's usually harmless. But trying to make your product look better by spreading misinformation is not okay. 

With that stuff taken down, I would have Cypress migrate to the WebDriver protocol. As I established above, it doesn't put any limitations on what you can do, and you can even still operate from directly inside the JavaScript runtime while doing it. But using the standard protocol that was literally engineered for the purposes of end-to-end testing is a requirement for valid test results. If done right, users won't even notice the change.

After that's done, Cypress can use its popularity to help spread education on how to _properly_ wait in tests. They can teach their users how to identify what to look for, and how to write waits that check for those things.

I said it before, but to reiterate, we can't keep treating QA automation like it isn't a software engineering role, and that dealing with these waiting issues aren't the exact reason we get paid to do this. We have to stop treating it like it's a burden, and treat it like a challenge that we just have to overcome. Education is the only way to get us there. Selling false promises of impossible solutions will only draw things out and make them worse.
