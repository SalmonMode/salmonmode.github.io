---
layout: posts
title: "1 Assert Per Test"
excerpt: "You've heard it before, and probably many times. But why exactly is it the rule that should only have 1 assert per test?"
date: 2020-05-31 08:56:00 -0500
---

To assert something is to answer a question that only has one answer. That answer can only be correct, or incorrect.

A test is an experiment where you establish an initial state, perform a single, state-changing action which triggers a behavior, which then causes a change to that state, and finally, you assert the resulting state aligns with what you expected.

Remember:
1. Arrange
2. Act
3. Assert

*Arrange* the initial state, perform the single *action* that triggers the behavior, *assert* the result aligns with what you expect.

An assertion (in the context of a test) is a statement that claims the result of a specific behavior is as we expect by saying something *empirical*. It's a statement about something we can observe/measure after the fact to verify if it's true or false. It is meant to be designed such that it can only be true if the behavior aligns with what we expect, and can only be false if it doesn't.

There can be no grey area, because that would mean we aren't sure how to evaluate the behavior, in which case, we have nothing to assert.

A single behavior can only result in a single change. If we have more than one assertion, by definition, we are evaluating more than one behavior.

Sometimes that state-changing action can trigger _multiple_ behaviors, and this is normal. It's the definition of complexity.

But a single test can still only evaluate a single behavior (more on this [below](#longer-to-run)).

## The Benefits of Abstraction

It can be difficult to spot the different behaviors you're trying to test, which is why it's so easy to fall into the trap of putting multiple asserts into a single test.

To combat this, consider how you would phrase a given test, and the asserts you would write for it. Then look at your asserts and ask what specific behavior each one is testing and how you would phrase that assertion.

Keep in mind, if you see a cluster of asserts that can be summed up more coherently than phrasing each assert individually, without making what you're asserting and how you're asserting it more vague, then it's likely you've found a good candidate for abstraction.

Let's look at an example that might help explain a bit better.

Let's say that you're testing logging in on a website, and after a successful login, you're taken to a landing page where it shows your profile info in the header, a sign out button in the header, and a main body that says "Welcome, <User's Name>".

You want to test that logging in works, so you start writing a test called `test_successful_login`, and you assert the following:
• The user's profile pic references the user's profile pic (checks the referenced image location)
• The user's profile pic data is correct (compares the date of the image to the local copy)
• The user's name is correct in the profile info
• The sign out button is in the header
• The main body says "Welcome, <User's Name>"

Each one of those asserts is about the result of a different behavior. But there's some great potential for abstraction.

It's not quite enough to say "after performing these steps, I am logged in". That's not *empirical*, since there's no mention of what we can look at to say it's true or not.

But you _can_ say "after performing these steps, the sign out button will be in the header". It's something we can definitively point to and say whether it's true or false. It's something we can measure without any ambiguity.

The same goes for that welcome text.

But what about the other assertions?

## Something Straightforward

First, let's go for something simple: the user's name in the profile info.

Page and component objects are _great_ for creating abstracted interfaces that make tests cleaner and more effective. With them, we can make convenient spaces for our logic, like creating a `header` component object and a ,`profile` component object within it, letting us compartmentalize the things related to them. Then we could do something like `page.header` to access the header stuff, or `page.header.profile` to access the profile stuff within the header.

We could then make another component object for the profile name, letting us reference it with `page.header.profile.name`, and that might be fine, since we could probably get the actual name shown as a string with `page.header.profile.name.text`, depending on how your page component object framework works. But that's boring.

Instead, we can just have `page.header.profile.name` return the name as a string, since that's all we'd need from it anyway.

Now we can write a test like this:

```python
class TestLogin:
    def test_profile_name(self, page, user):
        assert page.header.profile.name == user.name
```

If the name, profile, or even the header itself isn't there, then it'll throw an error, letting us know the test couldn't be performed (i.e. the assertion couldn't be evaluated) because something else went wrong. If the name is there, but not correct, it'll fail. If it's there and correct, it'll pass.

## Something More Advanced

Let's look at the profile picture ones.

It _is_ empirical to say "after performing these steps, the profile pic's src in the profile info points to a certain URL", and also "after performing these steps, the profile picture data is the same as the expected local copy". Although, that's quite verbose.

But we can also say "after performing these steps, the image shown for the user's profile pic is the same as the expected local copy". This sums up both of those asserts and doesn't make it more vague. That means this is probably a good candidate for abstraction.

In order to abstract it, we have to get fancy.

Alongside that `name` attribute in the `profile` component, we can also make an `avatar` component. But instead of returning a string, it could grab the actual data for that image and return an `Image` object that has logic inside it allowing it to compare its image data to that of other `Image` objects.

Then we could make another `Image` object for our local copy of that image file, and comparing them becomes a cinch!

We could then write a test like this:

```python
class TestLogin:
    def test_profile_pic(self, page):
        assert page.header.profile.avatar == Image(local_image)
```

If the image isn't present on the page, it will throw an error. If the image is there but using the wrong image data, it will fail. If it's there and all is good, it will pass.

## Can We Go Even Further?

We can!

Page Component Object frameworks are typically very flexible and allow you to insert logic in convenient places. For example, even if `page.header.profile` is a component object, we likely can still teach it how to compare itself to other forms of similar date. Or perhaps, we can go the other way around, and teach other forms of similar data to compare themselves to _it_.

There's many approaches, and this would best be done depends on your language, and the framework you're using.

For example, if using Python, I would have to give the `profile` component an `__eq__` method to teach it how to compare itself with other forms of similar date. To teach it that, I would just have to tell it to compare its `name` and `avatar` to those of the object I'm comparing it to.

For reference that would look something like this:

```python
    def __eq__(self, other):
        return self.name == other.name && self.avatar == other.avatar
```

But to make that other form of data, we could create a `Profile` class that represents the data for a user profile, and it would have a `name` attribute that returns a string, and an `avatar` attribute that returns an `Image` object. It might have other things, but for now, let's pretend that it.

If it's all put together well enough, our test could look like this:

```python
class TestLogin:
    @pytest.fixture(scope="class")
    def profile(self, user):
        return Profile(name=user.name, avatar=Image(local_image))

    def test_profile(self, page, profile):
        assert page.header.profile == profile
```

Everything works the same as the other two tests. If stuff isn't there, it errors. If stuff is wrong, it fails. If stuff is good, it passes.

## _Should_ We Go Even Further?

![Ian Malcom from Jurassic Park saying 'Your scientists were so preoccupied with whether or not they could, they didn't stop to think if they should.'](/images/Ian_Malcom_ask_if_they_should.gif){:height="auto" width="100%"}

There comes a point when it just complicates things and makes it harder to debug.

In the last example, our assertion became "after performing these steps, the profile info in the header will align with the user profile I intended to create".

Does that sound empirical? 

Well, at first glance, it might seem so.

The `Profile` object we created contains all the data we would expect to see in the profile info in the header. But it's tucked away inside that `__eq__` method.

What if that `Profile` object starts to contain more info about their profile, like a bio? Suddenly it's not a one-to-one comparison with what's in the header anymore, so that can make the test misleading. The comparison logic is tucked away inside the `profile` component, and `page.header.profile == profile` would no longer get you the same result as `profile == page.header.profile`.

Maybe it would have been better to create a `ProfileSummary` object just for this case instead? But does having all these classes make things way more complicated and defeat the point of using custom data types?

In the context of software engineering, the purpose of a test's failure report is to help narrow down where a defect is by being as atomic as possible, which is why it should only have 1 reason to fail (reasons to error is another story, though).

If an engineer doesn't know where to look to find the problem when they see a test fail, and they only have a vague idea of where the problem could be, then there could've been a more specific test to point them to the right area of code, saving all the time they'd have burned narrowing it down themselves. Only having the broadly scoped test usually ends up costing an enormous of amount of time with debugging, and causing a lot of frustration in the process.

I'm not saying comparing at the profile level is bad per se. But it's necessary to use discretion and think about the bigger picture of how everything goes together. If we bundle everything together into one big assert, it's more difficult to pull out what's wrong from a failure message, because it can be significantly longer, and prevents a developer from knowing where they need to look at a quick glance, because there's more components involved in that test.

## Addressing Concerns

### "They'll take longer to run because they'll be doing the same setup multiple times" {#longer-to-run}

I know a big concern about a hard and fast rule like "1 assert per test", is that you'll have to repeat the exact same arrange and act steps for multiple asserts when testing an action that triggers multiple behaviors, as this would exponentially increase how long your tests take to run.

But that isn't the case.

Many generic test frameworks provide a means to run multiple tests against a common set of arrange and act steps without having to re-run everything each time.

Pytest allows this through using a larger scope to house your asserts, e.g. a test class, and targeting the larger scope with your fixtures, rather than individual functions. Then you're free to use multiple test methods in that class for each assert.

In mocha, they let you nest `describe` context layers, where you can use `beforeEach` at every level except the layer that represents your "act", where you can then use a `before` fixture. You can even nest more `describe` layers inside if you want, and can have as many `it`s as you need.

The key is to make sure that once you perform your "act", you no longer make any state-changing commands, and only make non-state-changing queries. This preserves the state of the SUT, so order of the tests doesn't matter, no test is dependent on any other, and every test can be run in isolation.

### "My code is too complex for this to work"

Another large concern with this rule, is that it means you'll have to change your code to accommodate it.

Yes, you likely will. And that's a good thing.

If you can't already do this easily, it means your code can't be tested easily. If your code can't be tested easily, it means your code is difficult to work with. If your code is difficult to work with, it means it's difficult to maintain. 

If your code can't be tested easily, is difficult to work with, and is difficult to maintain, it means you're far more likely to have bugs (especially serious ones), and far more likely to miss them during testing.

This should also be a warning sign that your code is tightly coupled where it shouldn't be.

Code only becomes too complex if you let it. A software engineer doesn't just _make_ software; they _engineer_ it.

Following this rule forces you to write better code; code that's significantly easier to use, maintain, and extend going forward, and far less likely to have bugs.

### "That'll take too long"

I've heard some voice concerns about writing such tests taking too long to accomplish. They have deadlines after all, and they don't have the time to get it perfect the first time around.

I'm not saying you need to get it perfect the first time around. That's pretty much impossible.

Following this rule helps you keep things decoupled, easy to read, and easy to adapt, which means you can keep moving forward at a sustainable rate. It ends up being faster overall.

If you keep writing code without considering how you'll have to test it, you'll eventually hit a wall where it becomes incredibly difficult to adapt your code and to write tests for it.

If you've ever felt like writing tests took to long, or was too difficult, then you've hit that wall.

That's not sustainable, and it will only take longer and get harder from there unless you refactor.

Writing tests should be a straightforward and quick process. If it isn't, there's a problem. The amount a developer dreads writing tests is actually a pretty solid metric for gauging when it's a good time to refactor.

### "The order of my asserts matters, because the latter ones don't need to be run if the earlier ones fail."

This can be an easy trap to fall into.

Usually, when you have a sequence of assertions where order matters, it's because you're testing different behaviors. These behaviors can almost always be tested individually, so there's no need to run assertions in sequence like this.

Something like a loading screen with a sequence of messages that appear as different stages of loading are reached, can seem like the exact scenario for this use case.

But even in this case, there's a better way.

An assertion is a statement about what the resulting state is _after_ something happened.

In this case, you can store the messages into a list in the other they appeared until the loading sequence is done, and then compare that list against the list of messages you expected to see.

This could also be another example of where abstraction is useful.

If you're verifying the shape on screen is a green circle on, you might first assert it's a circle, and then assert that it's green. It might not matter if it's green if it's not a circle, so there'd be no need to run the latter assert. But abstraction can be used to assert the state of that shape in one shot (i.e. "the shape on screen is a green circle").
