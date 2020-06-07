---
layout: posts
title: "Grey Box Testing: Less Is More"
excerpt: "What is grey box testing? How can it benefit us? How is it different from white or black box testing? Are they all required? Do they dictate how we design our tests? Or should they inform how we design them?"
date: 2020-06-07 16:43:00 -0500
---

{% include grey_box_react_redux/styles.html %}

![Brad Pitt in Se7en shouting "what's in the box?"](/images/whats_in_the_box.gif){:height="auto" width="100%"}

## The difference between black, grey, and white box testing

Think of **black box**, **grey box**, and **white box** testing as a gradient.

On the **black box** end, you know nothing about the internal workings of something when you test it. You have no knowledge of the source code or infrastructure, the libraries or frameworks used, or anything about the tech stack beyond what would be absolutely essential (e.g. if it's a website, then it must have a backend server, and the frontend must at least be using HTML). All you see is what you put in, and what it spat out.

On the **white box** end, you are allowed pretty much perfect knowledge of how the system works, and complete access to all source code. You may choose to tap into some internals of the system directly, or only rely on input/output, like with **black box** testing. The difference, i.e. what makes it "white" box testing, is in the information used to engineer the test.

In the middle is **grey box** testing, where you have more knowledge about the system than just input and output, and can even mean having access to some of the source code, but your knowledge of the source code isn't perfect and you aren't diving all the way to the lowest levels of it. The more you know about the source code and infrastructure, the closer you get to **white box** testing until you're allowed complete knowledge of the source code, at which point, it becomes **white box** testing.

**Grey box** testing can be done with as little knowledge as knowing the frontend framework(s) in use, or even as much knowledge as knowing that a particular module depends on a specific service that you know how to crash.

## Adopting a **grey box** testing mentality is necessary and unavoidable

Don't think about them as completely different types of testing that you need to create to have different types of coverage.

It's more a description of how much knowledge you have about the source code and infrastructure when designing a given test.

![Thanos from Avengers Endgame saying 'I am inevitable'](/images/inevitable.gif){:height="auto" width="100%"}

You _will_ learn things about how it functions beyond what is shown at the surface level, and then you can never truly go back to **black box** testing.

You _could_ adopt a **black box** _mentality_ when designing your tests, but that's counterproductive when you do have knowledge about the system. Having increased knowledge about the inner workings of the test subject is a good thing. Let's explore how.

## Using a **black box** mentality can hurt us

If we treat the test subject as a **black box**, we don't get to assume _anything_ about how it works, at all, beyond what can be logically deduced. That means we can't make assumptions about how things like state are managed as we go from step to step.

For something like a website, this is particularly costly, especially nowadays with things like AJAX, the HTML5 history API, and SPAs. We can't assume that any one flow through the website would result in the exact same thing as going through another flow, which means we'd have to cover all possible flows, which gets exponentially worse the more functionality a website provides.

For example, let's say we have an eCommerce site, and we want to test adding an item to a cart by clicking the "add to cart" button on that item's page. 

Well, how we got to the item's page could matter; we can't assume otherwise.

Maybe something different can happen if we went directly to the item's page, than if we went through the search. Or maybe when we signed in matters, so signing in on the item's page before adding it to the cart could be different than had we signed in before going to the item's page.

There's an enormous amount of complexity potentially surrounding this one, simple feature.

To emphasize just how costly this is, take a look at this simplified simulation showing how many test cases you'd have to cover given a set of potential flows, and just how long it would take to run them.

{% include grey_box_react_redux/all_flows_svg.html %}

## **Grey box** testing helps

With **grey box** testing, we're allowed to look at how the system works, and make logical deductions about which tests we actually need to write, and how to best write them.

### Fewer and faster tests

This can _drastically_ reduce not just the number of tests we have to write, but also how long they take to run on their own and collectively.

Here's one potential outcome with just the knowledge that the frontend is a SPA made with React and Redux.

{% include grey_box_react_redux/targeted_flows_svg.html %}

That's an _insane_ reduction!

You can read more about how this can be done [here]({% post_url 2020-04-10-grey-box-react-redux-part-2 %}).

### Faster and easier debugging

**Grey box** testing allows you to target very specific behaviors using only the dependencies you actually need. This means that when a behavior is broken, and a test caught it, the developer will get a _much_ clearer idea about where the bug is, because the test will involve less of the inner workings of the system so the developer has fewer places to look. If a failing test is named `test_tax_calculation`, the developer should immediately know the problem is in the function that calculates tax.

Since the tests are also running _much_ faster, the developer can rapidly iterate allowing them to fix the bug faster, with less frustration.

Remember, the point of automated tests (at any level), is not just to spot when the system is broken, but also to help identify where it's broken, and help verify that a change makes it broken no longer.

## **Grey box** testing from the start is great, but not necessarily expected

It's rare that you'll walk into a new code base and immediately be able to identify how to most effectively optimize your tests, and no one will expect you to.

But as you acquire knowledge about the system, and other systems in general, you can start writing more and more refined tests. It's a process that never really ends, so don't sweat not being able to spot the finish line.

{% include grey_box_react_redux/grey_box_react_redux_js.html %}

## **White box** testing isn't always the best, but it's usually essential

Not necessarily. What most consider unit tests are a form of **white box** tests. The vast majority of most applications' behaviors will be contained entirely at that level, where you'd need access to the source code to be able to test them effectively and directly. Since a good test doesn't involve dependencies it doesn't actually need to depend on, you'll usually find that the vast majority of the tests for your application should be **white box** tests.

However, since **white box** testing means you are aware of all levels of the source code, if you aren't careful, it can sometimes lead to testing implementation, which isn't great. It doesn't always, but it can be quite easy to lose sight of the forest for the trees. It's important to be able to take a step back, but also make sure you aren't taking so far a step back that you can't tell when you're testing the same thing more than once.

You could argue that having complete access to the source code is always the best option. And you'd be right. But if we only considered the source code from that perspective, we might be so focused on testing that a specific custom exception is raised when an object of a certain custom data type is passed as the third argument to a function, that we forget to test the pipeline that exception is being raised to interrupt.

## It's not cheating if it's not against the rules

You'll likely hear others says you should always treat the test subject like a **black box**, and they're mostly right. You _should_ treat it like a **black box** for the most part. That doesn't mean you shouldn't peak inside to get an idea of tests to run it through. It just means you shouldn't do too much _tinkering_ around in the box while testing it. This is more so that 1) you don't bork your own test while it's running, and 2) your test works for longer because it's relying on the external interfaces of the box, which are slower to change than the insides.
