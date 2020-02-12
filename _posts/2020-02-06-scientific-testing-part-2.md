---
layout: posts
title: "Scientific Testing Part 2: Validity"
excerpt: "The validity of tests helps build our confidence in them and determines the value they add to our test suites. But what does it mean for a test to be 'valid'?"
date: 2020-02-09 14:00:00 -0500
---

If you haven't yet, be sure to check out [Part 1]({% post_url 2020-02-06-scientific-testing-part-1 %}). The gist of it is that we need to treat our tests with the same scrutiny as scientific research, because they _are_ scientific research.
{: .notice--info}

No matter how much time, or how many resources we have, or how smart we are, we can never write every single test that could possibly be written, nor will any of our tests actually _prove_ anything definitively. There will always be room for doubt. We still want to remove as much doubt as we can, though, so we have to make sure our tests are as "valid" as we can make them.

If we ignore validity, then our results can be dismissed for the same reasons that any other scientific research could be dismissed for. We don't want to give anyone any reason to ignore the test results, so we should strive to make our tests as valid as we can

## Validity

There's several types of validity such as internal, external, face, predictive, construct, and many more. I won't be covering these individually, as that would make this post even longer than it already is. But I strongly encourage you to read up on at least a few them as just knowing what they are could give you new perspectives you can use to analyze your tests.

Instead, I'll be giving a few examples and explaining what reduces or eliminates their validity.

## The Test Cases

Let's say you have an e-commerce site with a frontend that does most of its actions and gets most of its data from the backend's web API.

Two behaviors you'll want to check are:
1. That you can see items in your cart on the checkout page of the frontend
2. Given you have an item in your cart, that you can remove the item from your cart on the checkout page of the frontend

So let's build a couple tests around these.

## Solution 1

Your instinct might be to use a browser to do the following:

1. Launch a browser
2. Go to the sign in page
3. Sign in as the test user made for testing
4. Go to the item's page
5. Click the "add to cart" button until the button is disabled and says "item added to cart"
6. Go to the checkout page
7. Check that the cart now shows 1 item in it
8. Remove the item from your cart by clicking the "remove" button on the first item in the cart
9. Asserting that the item in your cart was removed by counting the number of items shown in the cart

This may seem fine, but it has several issues.

<details>
<summary markdown='1'>
### Issue 1: Unnecessary Dependencies
</summary>

The browser is used for several steps where it isn't needed, introducing extra dependencies in the frontend. This makes your test susceptible to confounding variables as any part of steps 2-5 could break purely because of frontend bugs unrelated to this specific test. This reduces confidence in the results, because it will fail more often when it shouldn't, so it means less whenever it fails.

You might say "but if those are broken, I'd _want_ that test to fail." But this test isn't about _those_ behaviors, and shouldn't fail because they have bugs (if it can be avoided). Those behaviors should have their _own_ tests.

If those steps are broken because of unrelated frontend bugs, the test wouldn't pass, but that doesn't mean the behavior we actually want to test is broken. For this test, we want to do what we can to actually perform the test, so if we can avoid those problematic dependencies, we should.

In this case, the test could leverage backend's API itself to make the account, find the item, and make the order, using the browser only to sign in and go to the order status page. Technically speaking, it could sign in through the API as well, and just give it's cookie to the browser.

Hitting the DB directly is another options, but typically this is getting too close to implementation as the schemas are usually less stable than the web API, and it would make your test code much more complicated than it needs to be regardless.

These shortcuts can be taken because most websites use the "stateless page-redraw model", where the client is only given a cookie, and the backend manages the state, so when going from one page to another, the client is not retaining any information about the state of the previous page. This means the state of the previous page doesn't matter because the client doesn't factor it in when getting the resources for and rendering the next page. So as long as the browser has the correct cookie, the next page willl always be rendered in the same way regardless of if it went to the previous page itself or not.

#### Side Note

There may be situations where the client is managing state on its end beyond just storing a cookie, and it's factoring in the previous page(s) in the next page is rendered, for example, SPAs. For SPAs, this is know as "thin server architecture". 

Most SPAs, however, are designed to mimmick the same end result as those using stateless page-redraw model, using the previous page(s)'s state only to optimize by reducing redundant communication with the backend. They also tend to be built using third-party frameworks (e.g. React), and most (not all) of them manage this for you, so it's not something you usually need to worry about testing, and you can test your site with the assumption that it works just like any other site that uses that model.

However, if you're defining logic in your frontend that controls what specifically is carried over from one page to another, you'll be responsible for testing that. If your site is meant to operate as though it follows the stateless page-redraw model, then such tests can be performed in the frontend's unit tests.

</details>
<details>
<summary markdown='1'>
### Issue 2: Impatient
</summary>

Whenever using a browser, the potential for race conditions are introduced because the browser largely operates asynchronously from the tests and JavaScript running on the page runs asynchronously as well.

When JavaScript is involved, the browser driver can't automatically know when the page is completely done being changed beyond the `document.readyState` being `complete`, but all that state means is that its initial resources are loaded and the initial DOM is established. But it's quite common for pages to have JavaScript or CSS animations that run after this point. In these cases, the page wouldn't be done changing when the driver lets the tests start interacting with the page. Similarly, even after the page is done being changed initially, more JavaScript can further modify the DOM when the page is interacted with.

If the test doesn't wait for the entire page to "settle" after any change in the DOM is triggered, then anything it does with the page will be non-deterministic because the state of the page (and sometimes even other things) is in flux. The tests should always wait for the page to settle before doing anything with the page or making any judgments against it.

If the tests don't wait, they'll do different things every time they're run because they aren't operating on a consistent state for each step. If the item's page isn't fully loaded when the test tries to click the "add to cart" button, it will throw an error and end the test. If they assert that an item is or isn't in the checkout page's item list before the DOM has "settled", it could result in a false negative or positive.

</details>
<details>
<summary markdown='1'>
### Issue 3: Non-deterministic number of mutations and conditional test logic
</summary>

The test repeatedly clicks the "add to cart" until it can no longer click it any more because it thinks the item has been added to the cart. The problem here isn't just that the test is overeager, but that it isn't making one decisive action only once it knows it can, and is instead making an unknown number of mutations that could have any number of effect on the state of the test subject.

The test should never change what it does based on the state of the test subject, because if the test has to change what it does, then something already isn't happening as expected, so the test can't know what to expect at the end, meaning its results would be meaningless.

The test, in this case, should wait for the page to be completely loaded, then click the button once, and then wait for the button to change before moving on. If the button doesn't change in time, then it means something if wrong and the test can't proceed regardless.

Tests need to be reproducible, which means they need to be deterministic. If you can't reproduce a test the same way every time, then you can't know if the behavior it was meant to test has regressed, because it could be doing something different leading to a different behavior that hasn't regressed.

Even though the driver shouldn't be involved in this step to begin with, I included this because it serves as another good example.

</details>
<details>
<summary markdown='1'>
### Issue 4: Sharing State Over Multiple Independent Variables
</summary>

You can think of test resources (in this context, at least) in terms of 3 categories:

1. Mutable
2. Immutable
3. Pseudo-Immutable

**Mutable resources** are those that are "liable to change". If involved in a test, they should be considered mutated by the test, and thus are tainted or marred by the test. These can result in both false negatives and false positives. As such, they should be discarded after the test.

A resource should be considered "mutable" if it's plausible that any test would modify it. It should be assumed that test order is non-deterministic, so every test should assume that it's responsible for every resource it needs.

That said, it's perfectly fine for multiple tests to share state if:
1. they all would try to reach the exact same state in the exact same way if they were each run individually,
2. none of them would modify it further than any of the others,
3. they could be run in any order without there being any change in the results,
4. and none of them would prevent any of the others from running should they encounter a problem.

Or, to put it more plainly, it's fine when each test would just be checking something different about the same resulting state.

For example, after signing in through the browser, you may be taken to a landing page with numerous things that should be checked independently. All of those checks would meet the criteria above, so we can know that there isn't any risk in allowing them to share state.

**Immutable resources** are those that fundamentally _can't_ be changed, even if you tried to change them. These are completely fine to share between any number of tests, as there's no way for any test to affect any other test through that resource.

**Pseudo-immutable resources** are those which _can_ be changed, but a point is made that they never are. Our tests are perfectly capable of modifying things like database schemas or superuser accounts, but they don't because they have no reason to. These can also be used by any number of tests just like immutable resources, provided they are treated as such.

In this example, both the user and the browser are mutable resources, and are shared between tests. The user has a cart associated with, and the browser has things like history, cookies, caches, etc, and both resources are being modified differently by each test.

Both tests should be using different users and drivers.

</details>
<details>
<summary markdown='1'>
### Issue 5: Insufficient Checks
</summary>

Checking the number of items in the cart does not check that an item was added to the cart. It only checks that you have a certain number of items in the cart. The test should go further and make sure the actual item shown in the cart is the one you tried to add.

Furthermore, simply checking that shopping cart appears empty on the frontend does not actually check that the shopping cart is empty (maybe the frontend assumed it successfully removed the item from the cart through the API). While you should check that the frontend shows no items in the cart, you should also make a request to the API directly to confirm that there's no items in the cart[^1]. This is a good example of where multiple tests can work from the same state.

[^1]: This also doesn't actually check the cart is truly empty because the backend may just not be telling you about it. But this can at least build some confidence that the cart is empty. More tests at multiple levels would be needed to build this confidence further.

</details>
<details>
<summary markdown='1'>
### Issue 6: Blind Actions
</summary>

The second test shouldn't just try to remove the first item it finds in the shopping cart. It should try to find the specific item that was added and remove that one. It's possible the wrong item, or even an extra item, could be in the cart, either because the test performed the wrong actions or because of an actual bug.

If a wrong item is added to the cart, and the test removes that wrong item and then checks that the item it was meant to add isn't in the cart, this would result in a false positive. While this may seem like a valid pass, remember that the test would not have actually achieved its goal of removing the item it wanted to add from the cart, and so it should not pass.

</details>

## Solution 2

OK, so we've seen some of the problems with the first solution. You may think they aren't that serious, but the plausibility of them causing false positives/negatives is very real. Remember, the whole goal of our tests is to build confidence in our code/product, and if it's plausible that the tests could have a false positive/negative, we shouldn't trust them, especially when that chance could've been removed.

So let's look at how we might go about things next, given the issues we've just seen. Instead of doing things in one go, let's break it out into 1 completely separate test and 2 other tests that with from a shared state, involve the browser for only the bits that we need it for, and make sure we're more critical with what exactly we check.

Test 1: Item in the cart shows up on the checkout page

1. Sign in through the API as test user #1 and fake the user agent of the browser
2. Add the item to the cart through the API
3. Launch the browser
4. Embed the cookie from the API requests into the browser
5. Go to the checkout page with the browser
6. Wait for the page to completely "settle"
7. Check that the item is in the cart

Test 2a: Removing item from the cart on checkout page removes item from cart view on checkout page

Test 2b: Removing item from the cart on checkout page removes item from cart

1. Sign in through the API as test user #1 and fake the user agent of the browser
2. Add the item to the cart through the API
3. Launch the browser
4. Embed the cookie from the API requests into the browser
5. Go to the checkout page with the browser
6. Wait for the page to completely "settle"
7. Find item in cart view and click its remove button
8. Wait again for the page to completely "settle"
9. Make an API request to get cart contents
10. (Check for Test 2a) Check cart view on the checkout page shows no contents
11. (Check for Test 2b) Check API response shows no cart contents

That's quite a bit better, but it's still not as good as it can be. There's still some issues that we need to address.

<details>
<summary markdown='1'>
### Issue 1: The tests are not "idempotent"
</summary>

"Idempotent" is a fancy word that sums up quite a lot and is very useful when it comes to talking about test validity. Basically, it means that you can run the same test any number of times, at any point in time, and even run it in parallel with itself without any instance of the step being influenced by any other instance.

That's right! A test shouldn't share state with _itself_.

Even if each test was hard-coded to use a different test user, they would still be using the same user every time they are run. Every time each test gets run, it leaves behind some sort of state, meaning when that test is ran again, it isn't starting from a clean slate. When a test is run in parallel with itself, they could easily step on each other's toes.

The first test is always adding an item to its cart, which means the next time it runs, the item will already be in its cart from the previous iteration. Even if the test was made to try and cleanup the cart after running, something could happen resulting in it not doing so.

If the second test is run in parallel with itself, they could easily wreak havoc on each as they add and remove items from the cart on their own.

The tests need to have a new user every time that was created as that test started. If they are generating their own users every time, they can't possibly share the same cart with another test, even if it's the same test.

</details>
<details>
<summary markdown='1'>
### Issue 2: Insufficient Checks
</summary>

Checking that the item is in the cart is not enough. The expected result is that the cart contains _only_ that item. If there's anything else in the cart, something went wrong and it needs to be investigated.

However unlikely this scenario may seem, consider the issue identified earlier where the test was repeatedly clicking the "add to cart" button. That could've easily caused numerous items to be added to the cart, and it's not unheard of for there to be similar issues caused by the backend.

While we don't want the tests to fail for any old reason, they should still be looking for specific reasons to fail. Tests should expect what is correct; nothing more, nothing less.

</details>

<details>
<summary markdown='1'>
### Issue 3: No cleanup
</summary>

Unless you're dealing with functional processing, tests inherently have to change the state of their test subject. This means there's always the possibility of affecting other tests if they don't clean up after themselves. When dealing with what most consider to be unit tests, this is often taken care of for us by the garbage collection process (assuming the language you're using does automatic garbage collection). But if the tests are doing anything that would leave stuff behind once they're done, then they need to take care to return the system back to a state that's as if they never ran.

Ideally, for every change they make, they should have logic that always allows them to undo it, even in the event of the test failing or a later step throwing an error.

You might be concerned because this means the state will be reset by the time you see the error/failure so you won't be able to dig around to see what caused it. But this shouldn't be a problem for 2 reasons:

1. There should be sufficient logging that allows you to piece together what happened without needing the actual state the error/failure occurred in.
2. The tests should be deterministic, allowing you to just run the test again and jump into a debugger right before/after the error/failure occurs..

It's also easier to do this during the teardown phase, rather than the setup phase, as you can have the tests themselves "track" the actions they've taken as they went, so they can know what needs to be undone. If the tests attempted to cleanup before they run, it could be extremely difficult (requiring complex logic) or even impossible for them to know what they need to do to clean up what other test runs did.

Some frameworks make tracking these actions easier than others (e.g. pytest's yield fixtures or mocha's before/after all/each with nested describes), but the capability is always there.

</details>

## Solution 3

We're getting closer. Now let's combine everything mentioned above and come up with a final, significantly more valid set of tests.

To keep things simple, I'm going to pretend that there's an admin API and the tests have access to admin credentials to access it. The admin API can be used to insert records into and remove them from the database. This is just to keep this example simple, and the actual solution you should use will depend on what you use.

Test 1: Item in the cart shows up on the checkout page

1. Create new test user with unique credentials through the admin API
2. Sign in through the API as this test user and fake the user agent of the browser
3. Add the item to the cart through the API
4. Launch the browser
5. Embed the cookie from the API requests into the browser
6. Go to the checkout page with the browser
7. Wait for the page to completely "settle"
8. Check that the item is the only item in the cart
9. (teardown) Delete new user through admin API

Test 2a: Removing item from the cart on checkout page removes item from cart view on checkout page

Test 2b: Removing item from the cart on checkout page removes item from cart

1. Create new test user with unique credentials through the admin API
2. Sign in through the API as this test user and fake the user agent of the browser
3. Add the item to the cart through the API
4. Launch the browser
5. Embed the cookie from the API requests into the browser
6. Go to the checkout page with the browser
7. Wait for the page to completely "settle"
8. Find item in cart view and click its remove button
9. Wait again for the page to completely "settle"
10. Make an API request to get cart contents
11. (Check for Test 2a) Check cart view on the checkout page shows no contents
12. (Check for Test 2b) Check API response shows no cart contents
13. (teardown) Delete new user through admin API

That's _much_ better! The tests have pretty much eliminated all the issues mentioned before. They're idempotent, atomic, deterministic, are thorough with their checks, and even clean up after themselves.

Not only does this give them more validity and keep our test environment clean, but it also makes them _significantly_ faster. This was a rather simple set of tests, but had we been tackling much more complex tests, the speed improvements would have been even greater. Plus, the less time a test is using the browser, the more time it's available for other tests to use.

You might think that these are too narrow in scope and that they don't cover enough; you might even call them "atomic". Yes, that's the point. A single test should only check a single behavior, and a single behavior should only need a single assert to "assert" that it lines up with what's expected. That's why you should only have one assert per test.

You might then say that Test 2a and Test 2b are multiple asserts for the same test, but that isn't the case here. They are both separate tests that happen to share a common state that their checks run against. They both pass or fail on their own, though.

## Go and be Scientific!

Hopefully this gave you some idea of the role validity plays and how to increase a tests validity. Nothing in science is perfectly valid, but that doesn't mean we should set the bar low. We should always strive to make our tests as valid as possible so that the results mean that much more.

*[SPA]: Single Page Application
