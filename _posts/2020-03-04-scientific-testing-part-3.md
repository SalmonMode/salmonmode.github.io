---
layout: posts
title: "Scientific Testing Part 3: Leveraging Confidence"
excerpt: "Now we know how to maximize test validity. But how can we leverage that in other ways than just providing test results to someone else?"
date: 2020-03-04 19:00:00 -0500
---

Now that we know how to maximize the confidence a test provides from [Part 2]({% post_url 2020-02-09-scientific-testing-part-2 %}), we can use that confidence in more ways than just telling someone else in a test report. We can optimize our tests using this confidence to build chains of confidence that let us cut out certain dependencies because other tests have them covered.

## An Important Note Before Diving In

These "shortcuts" should _only_ be made when you understand the technologies involved. Even when you _do_ understand them, you must have controls in place to verify the assumptions each shortcut takes. These usually take the form of additional tests that target those assumptions specifically.

Only make these assumptions when you know what the assumptions are, and how to verify them independently of the test that's making them, and have the additional tests written to do so.

You'll still catch the same bugs without the shortcuts (eventually), so don't worry about that. These shortcuts just save on resources, execution time, and debugging time, as well as provide more targeted test (more on this below).

But with that in mind, let's move on.

## It starts with trust

Trust must be earned. In order to trust something, you must have a certain level of confidence in it, and confidence requires evidence. Without evidence, you don't have trust; you have faith.

When we perform tests, it's to create the evidence necessary to trust something. 

Whenever you use a third-party resource, e.g. Selenium, you are required to trust that it works. We may not make the decision to trust it consciously, but if we didn't trust it, we wouldn't (or at least _shouldn't_) be using it. Otherwise, we'd have to test it ourselves in order to build our confidence in it, and it's not our responsibility to test a third-party's resource.

But we don't (or at least _shouldn't_) usually test them, which means we must trust them. So where does the evidence for this trust come from?

It comes from tests that the creator(s) of that resource wrote and performed. If those tests are written well, are comprehensive, and they're passing, then we get to say it's worthy of our trust.

This is true for the parts of our SUT, as well.

A test that makes one of these shortcuts is making an assumption about the step it cut around. When doing so, it assumes 2 things:

1. Going through that step normally works
2. Going through that step normally results in a system state that is no different than when taking the shortcut.

These assumptions _must_ be verified on their own.

The first assumption is fairly straightforward to verify. You just need to have some tests that challenge the skipped step directly. For example, if you skipped doing the sign in process through the browser, you just need some tests for signing in through the browser.

The second assumption is quite a bit more complex, depending on how state is handled, but not at all impossible. In general, all it takes is to go through that step normally, take a snapshot of the state, and then compare it to a snapshot of the state that resulted from taking the shortcut. That's easier said than done, though.

### Quick example

Let's say you have a webpage with a form on it that lets you upload an image. Once the image is uploaded, an image element should be spawned on the page that shows the image that was just uploaded along with a series of buttons that manipulate the uploaded image in one way or another, plus another button that just removes the image from the server. If you go to that page after the image has been uploaded, you should see the same thing.

You'll have to have a test for each one of those buttons, but going through the step of uploading the image through the browser can add up and burn a lot of time.

It may not seem like it would add much, understandably, but this is just a simple example, and uploading an image is just a placeholder for other, more complex and time-consuming steps. So for now, just pretend like uploading it through the browser takes 10 seconds, while uploading it straight through the API would take 1 second.

With this in mind, the shortcut you might take would be just to upload the image through the API and then jump straight to the page. But this assumes 2 things:

1. Uploading the image can be done they the browser
2. Uploading the image through the browser would result in the page having the same state (i.e. showing the image with all the buttons) as it would have if the shortcut was taken.

#### Assumption 1

The first assumption is easy to verify. Just upload the image through the browser and check that it was stored on the server.

#### Assumption 2

The second assumption is a bit more complex to verify, but not too bad. You just have to check tha the client-side state after uploading the image through the browser, lines up with the client-side state you'd have if you'd jumped directly to it.

You can still use the shortcut with confidence, because you have a test that covers the area your assumption would miss. Any bug that would've been found had the shortcut not been taken would be discovered by this new test.

The new test would also tell you more specifically where the problem was, and if there's a problem with how client-side state is managed when going through the normal flow vs jumping straight to the page after the image is uploaded.

NOTE

This all, of course, assumes that the same JS functions are being used to embed these elements in both cases. While this is usually the case, if they weren't, things would get a little more complicated, so for now, let's say that they are. 

/NOTE

#### What if there's a bug in both how state is managed going through the normal flow, as well as with one of the image modifying buttons?

Let's look at a worst case scenario, and say there's 2 bugs:

1. If you upload the image through the browser, it doesn't automatically embed it onto the page with the buttons, but it's fine if you were to refresh the page or go to it directly after uploading the image through the API.
2. Once you get to a working version of the page where the image and buttons are embedded, one of the buttons doesn't manipulate the image like it should.

Now let's look at how each testing approach would handle this. Keep in mind, both approaches would find both bugs. This is about creating targeted tests that make reproduction and debugging easier and faster.

##### Without the shortcut

Without the shortcut, the test would throw an after uploading the image because it wouldn't be able to find the button it wants to click. After investigating, you would find that the image and buttons weren't embedded after uploading the image, so you file a defect.

Once the defect is fixed, the test would run again and fail because the button didn't manipulate the image as it should have. So you file another defect, and once that's fixed, the test now passes.

This requires going through the whole process twice, and, while it works, it isn't very fast and required a bit of effort to debug and find the source of the initial error (as such errors are rarely clear in regards to what exactly caused them). If you've ever had to spend a long time fixing one problem only for it to reveal another once fixed, then you know how frustrating this can be.

##### With the shortcut

If the shortcut is used, that means there's two tests. Both would run and fail. One tells you it failed because the state isn't aligned as the image and buttons weren't embedded. The other tells you that clicking the button didn't modify the image as it should have

Now you can file both defects at the same time. Once both are fixed, you can the the tests again, and they should pass. 

Even if the two defects weren't fixed at the same time, and one took significantly longer than the other (e.g. fixing the embedding took longer than fixing the button), it would still waste day less time. The fixes for them would still be kicked off and ran in parallel, and they could be validated as soon as their respective fix was ready. 

This is where the shortcut approach shines. Problems are discovered as soon as is possible, so fixes can begin as soon as possible.

## Caution

This can be more or less difficult depending on how your website is implemented. But there is always a way. In order to know that the page would attempt to be generated in the same way in both cases, requires either:

1. Looking at the implementation to verify it
2. Using a frontend framework that guarantees this when done from the same exact state (e.g. React/Redux) 

I'll be making another post in the future about how React/Redux make it particularly easy when they're used to make a SPA, because one of the reasons for using them is to guarantee #2. That doesn't mean you don't have such assumptions to validate when using them, though. They just make it _significantly_ easier. But I'll cover the details in that post.

That said, if you aren't sure what aspects of client-side state you should be looking at (e.g. state containers, local/session storage, cookies), then you shouldn't use a shortcut such as this, as it would likely mean missing something crucial.

But it's fine if you don't, and it's better to acknowledge it by not taking the shortcut to make sure everything is covered, even if it means spending more time debugging a failed test. As I mentioned earlier, both approaches would find the same problems. It's better to have caught the failure(s) and had to spend a few hours debugging, rather than missing the bug entirely.
