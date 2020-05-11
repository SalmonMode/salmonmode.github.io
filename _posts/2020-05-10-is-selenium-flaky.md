---
layout: posts
title: "Is Selenium Actually Flaky?"
excerpt: "We've all gotten frustrated dealing with flakiness once we start involving Selenium in our tests. But is Selenium really the problem? What can we do to solve these issues?"
date: 2020-05-09 22:00:00 -0500
---

We've all gotten frustrated working with Selenium. We've had to deal with our tests failing for seemingly no reason at all, and ended up burning a bunch of time trying to find some fix or workaround.

After some digging, you may have come across claims that Selenium is "flaky", and this seems to explain the issues your tests have been having... at least, on the surface level.

We definitely don't want flaky tests because those are worse than not having the tests in the first place. But what does it _really_ mean for something to be "flaky"? Why is it bad to have flaky tests? And is Selenium _actually_ flaky?

## What makes something "flaky"?

You might have heard that a test is "flaky" if it passes/fails inconsistently. But this is only a _symptom_ of a flaky test, not what actually makes it flaky.

"Flaky" is just another word for "nondeterministic".

Something is "deterministic" if, given the same inputs and initial state, it will always perform the same actions (i.e. behave the same way), result in the same end state, and produce the same outputs.

Something is nondeterministic if, given the same inputs and initial state, it can perform different actions (i.e. behave differently), potentially causing it to result in a different end state, and/or produce different outputs.

Another way to think about it is if something can be made to behave differently because of randomness, it is nondeterministic.

If you feel you got the gist, feel free to skip past the example.

### Examples

Here's a quick example of a deterministic function:

```python
def add_nums(num_1, num_2):
    return num_1 + num_2
```

No matter what, given the same two inputs, it will always perform the same actions, and produce the same output.

Another quick example, this time with state:

```python
class Circle:
    def __init__(self, radius: float):
        self._radius = radius
        self._diameter = None
        self._circumference = None

    def get_radius(self) -> float:
        return self._radius

    def get_diameter(self) -> float:
        if self._diameter is None:
            self._diameter = self.radius * 2
        return self._diameter

    def get_circumference(self) -> float:
        if self._circumference is None:
            self._circumference = self.get_diameter() * math.pi
        return self._circumference
```

If I start with `c = Circle(radius=1.0)`, both `self._diameter` and `self._circumference` will be `None`, so when I call `c.get_circumference()` on any circle starting from this state, it will always calculate the same diameter and circumference, cache them as part of its state, and then return the same circumference. The behavior will always be the same, as will the output and the resulting state.

However, once `c.get_circumference()` has been called, the state of the object will have changed, because it will then have the cached diameter and circumference. If I were to then call `c.get_circunference()` on it again, it would behave differently, simply returning the cached value, rather than calculating it again. But it's still deterministic because it only changed how it behaved because the _initial state_ changed.

If I had set the `self._diameter` and `self._ circumference` back to `None`, and called `c.get_circumference()`, it would behave as it once did. And if I leave those attributes with their cached values, it will always just return the cached values rather than calculating them again

So now, if I keep calling it with it in that state, it will continue to behave the exact same way and produce the exact same result.

Now for a nondeterministic example:

```python
def combine(num_1; int, num_2: int) -> int:
    if (random() > 0.5):
        return num_1 * num_2
    return num_1 + num_2
```

We can see that how this function behaves is affected by randomness. Depending on the random number it generates, it will return either the product or the sum of the two numbers given. For pretty much every combination of numbers you give it, it can result in inconsistent outputs. But if you give it a `2` for `num_1` and a `2` for `num_2`, it will always output a `4`. Even if the function didn't take any inputs and always combined a `2` and a `2` like this, it would still be nondeterministic, because _how_ it gets the output changes randomly.

Now that we've clarified what "flaky" actually means, let's move on.

## Why flaky tests are bad

It's clear that flaky tests are bad, at the very least, because they can produce inconsistent results. This erodes trust in the tests as a whole, and encourages ignoring test results because a failure can be easily dismissed just by saying "oh, that failure doesn't mean anything. That test is just flaky."

Every time a test fails, it should mean something important.

On top of this erosion of trust, it can lead to rerunning the tests multiple times to make sure a failure iis legitimate, in an attempt to restore that trust by hiding results until multiple attempts can be made for a passing result. But this is an enormous waste of resources, and can even hide actual nondeterminism in the test subject, missing real bugs.

But like I said before, inconsistent results are only a _symptom_ of flaky tests. Not all flaky tests will produce inconsistent results.

### So if a flaky test is producing consistent results, why is that still bad?

In order for a test to be valid and worthy of trust, it must be repeatable.

If a test does things inconsistently, then its results can't be verified (even if its producing consistent results), because it isn't really the same test being performed each time, which means the test isn't repeatable. And even if you know if can only be done one of a limited number of ways, you still wouldn't be able to consistently get a specific test to be performed, and you wouldn't know which results to verify against which. If a test's results can't be verified, then they can't be trusted.

If you still aren't sold on this idea, replace the word "test" above with "experiment", and you may feel differently. 

## So is Selenium flaky?

If our tests depend on flaky tools, then our tests will be flaky. If Selenium is flaky, then using it would compromise the validity of our tests.

**So is Selenium the cause of our tests' flakiness?**

**Nope.**

The Selenium language bindings for every supported language are basically just a thin wrapper around "The WebDriver Protocol". The protocol itself is deterministic, so there's not really any opportunity for it to do anything nondeterministic.

## So where's the flakiness coming from?

There's clearly _something_ introducing flakiness into the equation, but what?

You may have already guessed it, but it's a combination of the browser's host machine, the network, and the website's servers. These introduce randomness because we don't have complete control over them. Unfortunately, this randomness is something we'll always have to consider, as that's just the nature of the web.

Dealing with this is _exactly_ what we signed up for when we started writing end-to-end tests.

In other words:

**It's not Selenium that's flaky; it's your tests.**

Luckily, it isn't an impossible task. The trick is in waiting so that we step _around_ all the randomness introduced by these factors.

To guarantee that the tests will behave deterministically, if the DOM changes, we just need to wait for the DOM to finish updating before moving on. As long as we do this, we eliminate any race conditions related to that randomness, which is usually the cause of flakiness.

This is where "explicit waits" come in. We just pop in these waits wherever we expect the DOM to start updating and have them look for things that tell us the DOM is finished updating, and we're golden.

## Is there a better way?

You might be thinking that it sounds like quite the task to put those waits in everywhere we'd need them, and _surely_ someone has figured out a way to handle all of that automatically, especially since it's been a problem for at least a decade.

Nope.

Remember, Selenium wraps the WebDriver Protocol. That protocol is made _specifically_ for automated tests so that they can control browsers, and is defined by the W3C, which has hundreds of members, including Google, Mozilla, Microsoft, and Apple. They're all aware of this problem, and would _love_ to have a solution for it.

If there _was_ a way, they'd be the ones to find it and implement it into the WebDriver Protocol. If they had, I wouldn't be writing this blog post, because you wouldn't have flakiness issues with Selenium.

## "But &lt;insert tool here&gt; says they solved it and can handle the waits for me automatically"

They're either lying, or misinformed. I try to assume the latter.

This whole issue with knowing when it's ok to move forward with the test is a prime example of ["The Halting Problem"](https://en.wikipedia.org/wiki/Halting_problem), which is an unsolvable problem.

Basically, the problem is determining, just by looking at a program's code, if the program will run forever, or if it will eventually stop. For our purposes, if you can determine that it _will_ eventually stop, that means you can automatically determine criteria to recognize when it _has_ stopped, and if you can do this, then you can handle waiting automatically.

The implications for someone solving this problem are endless, and if someone _did_ solve it, they would be very rich and famous overnight.

But like I said, this is an unsolvable problem. Any tool claiming to have solved it, is either lying, or doesn't realize that their solution doesn't actually work.

### Further convincing

That may not be enough to convince you (since I pretty much just linked a Wikipedia article and paraphrased its first sentence), so also consider this:

The W3C is open to proposals on all of the specifications they control (including the WebDriver protocol), from anybody at any time. If someone actually managed to solve this problem, the W3C would accept their proposal instantly, and the tech world would likely explode from excitement.

The tools making these claims are usually open source, and you could inspect for yourself what their actual solution is. So it's not like their solution is a secret or anything. They're also confident enough in their solution to claim it as fact in their marketing that they've solved it.

So if these things are true, why haven't the teams behind these tools made any proposals to the W3C?

Maybe they already have, but were rejected. I checked, but couldn't find any (that doesn't mean no one has made those proposals, though). But if they had, they must have been rejected, so why would that be the case?

## "But this tool says they were able to do it because they don't use WebDriver"

If it isn't using the WebDriver Protocol, then it's either running inside the JavaScript runtime of the browser and/or its using the DevTools Protocol. But that wouldn't explain how they were able to do it, because the WebDriver Protocol _transcends_ JavaScript.

The WebDriver protocol's potential is really only limited to the scope of the browser as a whole.

If there's something in the DevTools Protocol that's essential for automated testing through a browser, there's nothing preventing that from being included in the WebDriver Protocol. The WebDriver Protocol also has access to the JavaScript runtime of the browser, so anything any other tool can do from inside that runtime, WebDriver can do it too.

If there was a way to handle waiting automatically, at all, be it through direct access to the JavaScript runtime, or through the DevTools Protocol, it would just become included in the WebDriver Protocol as soon as the W3C got wind of the solution.

## No tool can do this for you

Like I said, handling this problem is _exactly_ what you signed up for when you started writing end-to-end tests.

**There is no universal solution to this waiting problem. Any tool claiming to have the solution is wrong. Full stop.**

There's just no way around it.

We're always going to have to consider each page individually, by watching how it works, and identifying _specific_ things we can check for to determine when it's ready, and then put those into our code as explicit waits.

I know it's not the answer you wanted. But QA Automation is a software engineering role, and that's just the reality of it.

If you treat this problem like something you shouldn't have to deal with, it will just become a burden that eats at you and makes everything harder.

But if you take the challenge head on, you'll find it isn't so bad.

Embrace the software engineering role and treat your code with the same standards as every other software engineer should, and you'll find everything gets easier.

You may think it would be annoying and tedious to have to put explicit waits everywhere, but proper abstraction through page objects make it pretty easy and fast.

## TL;DR

No. Selenium isn't flaky; your tests are. It's [impossible](https://en.wikipedia.org/wiki/Halting_problem) for any tool to handle waiting for you automatically, so it's best to just tackle the problem head on and write some explicit waits inside some page objects. You're a software engineer, so embrace it!
