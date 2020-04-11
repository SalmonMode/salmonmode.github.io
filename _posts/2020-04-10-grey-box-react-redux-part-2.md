---
layout: posts
title: "Grey Box Testing - React Redux Part 2: Cutting the Fat"
excerpt: "The usage of React and Redux together creates fantastic opportunities for refining tests. Let's go over one of those opportunities and the benefits it provides for end-to-end testing."
date: 2020-04-10 21:45:00 -0500
---

{% include grey_box_react_redux/styles.html %}

React and Redux are a powerful combo. When used properly, they allow us to make extremely useful refinements to our tests. Let's go over these refinements, and work through how they can help.

## Quick Review

In [Part 1]({% post_url 2020-04-10-grey-box-react-redux-part-1 %}), I went over the general principles of what React and Redux do, and a little bit about how they do it. Without that knowledge, these refinements won't make any sense. So before moving on to, let's go over what was covered. This'll also condense everything into the core details and to provide a quick reference to look back to:

### React

* React components deterministically generate the HTML used to render them based on the `props` provided to them when they were created, and, if they are stateful, the `state` they have at that moment
* Every component (effectively) has a single `render` method which contains the logic used to generate that HTML.
* This `render` method is also how a component can use other components as its child components.
* Every time a component's `state` is changed, its `render` method is automatically used to re-render it.
* Given the same `props` and the same `state` (if it's a stateful component), a component will always generate the same HTML. This is not influenced by how the `state` and `props` got to that point.
* There is always one root component for an application, through which, all components of that page are provided.
* There are now only 3 primary concerns when testing React components:
  1. Components are being made with the expected `props`.
  2. Components have the expected `state` after an action is taken (if dealing with stateful components).
  3. Components render the expected HTML when made with a given set of `props`, as well as a given `state` (if dealing with stateful components).

### Redux

* Redux uses a single state container for an application called the `store`.
* Redux binds the `store` for a React app to the root element of that app.
* All components in the React app use the `store` for their `state` and can even use it for their `props`.
* When the `store` is updated, components that depended on the data that changed will automatically re-render with the new data, because their `state` has changed.
* Given the same `props` on the root component, and the same `store`, that root component will always render the same HTML for that view for that React app. This is not influenced by how the `store` and `props` got that way.

## The Problem

Let's start by looking at the problem we should be trying to solve.

When being given a behavior to cover in your tests, your instinct might be to consider how a user, from start to finish, would trigger that behavior, and then write a test that emulates that entire flow. You might also consider all the other flows through the app that would trigger that behavior, and then write tests that emulate those flows, too.

The instinct to consider all the flows that lead to that behavior being triggered, is good. It helps inform you about so the potential variables in play. But trying to emulate entire flows is neither practical, nor is it as helpful of a solution that it could be. There's just far too many permutations, each one on its own takes far too much time, and they all involve far more than they need to resulting in confounding variables.

The core of this problem is that we need to find ways to make our tests faster, leaner, more targeted, and provide better failure information, and we need to do so without losing coverage of the behaviors we need to test.

## Easier Said, Than Done

In the modern web world of AJAX, we no longer have to rely on navigation from one page to another in order to trigger behavior on the backend. As a result, the frontend can (and often does) become responsible for tracking a bit more about the state of the system. This introduces the potential for bugs that exist purely on the frontend, but they are still tied to behavior in the backend, and this makes testing involving a browser more complicated, because those bugs are tied to how client-side state is accumulated. 

If this is a familiar concept to you, feel free to jump to the TL;DR below. But, rather than talking about it in riddles, let's go over an example to illustrate it.

### Example

Imagine an e-commerce website, but with all the frills stripped out. It's absolutely bare bones, with just a sign in page, product search, and cart/checkout system; the core elements of an e-commerce site.

Imagine the flow for a user that signs in, searches for a product, goes to the product's page, adds it to their cart, goes to their cart page, and then removes it from their cart. There's numerous behaviors along this flow, but for now, let's focus on removing that item from that cart.

#### No AJAX

Imagine how it would function without any AJAX at all. That would be pretty simple to test, because we wouldn't need the browser to sign in, or add the item to the cart, as we can just do those things by hitting the backend with an HTTP client and then embedding the cookie in the browser once we launch it (and there's no need to search if we already know the product's ID).

Once the browser is launched and has the cookie, we can just jump straight to the cart page and try to remove the item from the cart. From there, once the next page loads, we can just check that the item doesn't show up there, and we can query the database to make sure the user actually has nothing in their cart.

This, however, leaves the sign in page, the search page, and the product's page untested. 

Well that's no problem, since we can just make more tests to cover them, and that's really all there is to it. There's no need to be concerned with how we arrived at the cart page, because any notion of client-side state was reset as the browser navigated from each page to the next. If there's a frontend bug on any one page, it will be contained to that page.

#### Now as a SPA

With a SPA, these are no longer separate pages, and are now "views" within the same page. Because the page isn't getting reset between these views as it would between pages when no AJAX is involved, we have to be concerned about how the client-side state was built up, because the behavior of one view could be affected by the state established by a previously used view. Frontend bugs can now traverse multiple views.

As an example using our scenario, let's imagine there could be something done to the client-side state by the search view that then affects how the view for a specific product behaves.

Let's say the search view establishes some data about each product's details, like a product ID and SKU, and it looks something like this:

```json
"searchResults": [
  {
    "productName": "Soft Blanket",
    "id": "93a82616-e134-499b-ad56-8e446d4dae12",
    "sku": "SOF-MED-WHI-COT",
    "price": 19.99
  },
  {
    "productName": "Large Blanket",
    "id": "b5c9eac8-908f-4030-8be8-19148ee6f5e5",
    "sku": "LAR-LAR-WHI-COT",
    "price": 29.99
  }
]
```

Let's say the search view also highlights a featured product, and stores its data like this:

```json
"productDetails": {
  "productName": "Soft Blanket",
  "id": "93a82616-e134-499b-ad56-8e446d4dae12",
  "sku": "SOF-MED-WHI-COT",
  "price": 19.99,
  "description": "A soft, cotten blanket."
}
```

Now let's say when you click on a product in the search results, it loads the product view. By the time it loads, it wants to have another set of data that could look something like this:

```json
"productDetails": {
  "productName": "Large Blanket",
  "id": "b5c9eac8-908f-4030-8be8-19148ee6f5e5",
  "sku": "LAR-LAR-WHI-COT",
  "price": 29.99,
  "description": "A large, cotten blanket."
}
```

Before the product view does anything it first stores the product ID inside `productDetails.id`. Once it does this, it does a check to see what information it has about the product inside `productDetails` so it can fetch the missing data it needs.

If you've worked with React a good amount in the past, you may have already spotted the bug.

Once the view is loaded, this is the data it will have:

```json
"productDetails": {
  "productName": "Soft Blanket",
  "id": "b5c9eac8-908f-4030-8be8-19148ee6f5e5",
  "sku": "SOF-MED-WHI-COT",
  "price": 19.99,
  "description": "A soft, cotten blanket."
}
```

The bug is that both the search view and the product view are using `productDetails` to store product details for potentially different products, but the product view assumed it was cached data for the product it wanted to show.

Notice that only the product ID is correct. This can easily happen because of how React devs tend to handle updating state information (since React's documentation tells them to ). It isn't necessarily wrong, and even after the bug is fixed, this is possibly how it'd still be done. It just means that in this case, the view leapt before it looked.

The result is that the "Add to cart" button could still add the Large Blanket to your cart, because it's tied to the correct product ID, but the view would be showing the product name, SKU, description, and price for the Soft Blanket, instead of the product you clicked on in the search view.

Let's now say that if the product view _didn't_ have that data from search view cached, and only had the ID to go off of. If this was the case, then it would have gone and fetched all the data for the Large Blanket, and the view would show everything correctly.

That means if we had just jumped straight to the Large Blanket's product view, without going through the search view, we wouldn't have spotted the bug in the search view. It also means that if we had gone through the search view, and clicked the "add to cart" button without checking the product view, we wouldn't have seen that all the information shown wasn't correct.

##### TL;DR

There could be bugs caused by assumptions each view is making about what they can store their data as. When transitioning between views, conflicts caused by them using the same names for data can create lots of issues that we would only be able to spot by going through that transition.

## Potential Solution

{% include grey_box_react_redux/single_test_flow_svg.html %}

You might think that this means we have to do every end-to-end test by going through the entire flow through the browser, checking each and every view along the way. But as mentioned above, this just isn't feasible. 

The flows through an app become an enormous spider web of branching paths, and the transitions from any of these branching points to any other connecting point can be a potential spot for similar problems to the one laid out above.

If we don't consider how these views are tied together, and instead treat the application as a magic black box, then we can never say that any one flow to get to a particular view has anything in common (in regards to how state is accumulated) with any other flow, even if they both go through the same previous view. We then have to assume that every possible flow through the app is a unique test scenario that could fail for a different reason than all the other flows that led to that view, and we would only be able to observe that unique problem after going through the entire flow.

Below is a representation of how these tests would work in a simple application. Each one of these would require a browser for more or less the entire duration of the test case.

{% include grey_box_react_redux/all_flows_svg.html %}

The amount of potential flows is inconceivable after a certain point, so trying to test even a fraction of them would be maddening, and probably impossible. There's just far too much noise.

On top of this, it would burn a _lot_ of resources just to run a small amount of them. They would require a lot of computing power to run all the necessary browsers, and take an extremely long amount of time to finish. They would also be rife with confounding variables, and it would be very difficult and time consuming to determine what the failures are actually being caused by. 

### Another Potential Solution

This can encourage some folks to start cramming as many potential failure spots into each test as they can by stringing together those branching points, and focusing only on test cases that are much deeper into that app, hoping that problems in the earlier parts of the flows will still show up.

{% include grey_box_react_redux/end_flows_svg.html %}

But it still doesn't reduce the amount of time the tests take to run to something that can provide the developers with the rapid feedback they need to keep their attention. It also doesn't do much to narrow down where the problems are. Looking at it while it's running, can you narrow down where the problems are?

## The Targeted Solution

We can't possibly test going through all possible flows of the app. But that doesn't mean we can't still cover them to gain sufficient confidence in them, especially when using React and Redux.

Ideally, a test should be as targeted as possible, trying to test only a _single_ behavior, and only involving the absolute bare minimum of what it needs to do this. This cuts out confounding variables, keeping your tests far more trustworthy and stable. It also makes them faster and cheaper to run, and, when they fail, you're told what the problem was so you don't have to spend time debugging it.

Take a look at how that plays out, and compare it to the two examples from above:

{% include grey_box_react_redux/targeted_flows_svg.html %}

It can quite easily be orders of magnitude faster. It's significantly more stable, tells you _exactly_ what the problem behaviors are (or at least significantly narrows it down), and is _much_ easier to maintain because you only need to be concerned about individual behaviors and how to test them, rather than having to also think about every single thing that could've come before them.

You might be thinking "well, if I did that, it would miss a potential problem with <insert behavior here>!" But now that you've identified the behavior that you think it would miss, then you can add a test for that behavior to the web so it's no longer missed.

<div class="notice--warning">
  <h4>Remember:</h4>
  This is the ideal. If you aren't sure how to narrow a test down to the behavior you want to test, it's absolutely fine to include a few of the surrounding nodes in the test so that you can be confident you're testing that behavior.

  This is grey box testing, so it's required that you understand how it works to more effectively test it. If your understanding is limited (and _everyone's_ understanding is limited to some degree), then only leverage the aspects of it that you're confident you understand. Further refinement can always be done later.

</div>

## Applying to React Redux

In the example we went over above, the problem was with how the product view handled updating the product's data, specifically after coming from the search view. So in order for the test to target that specific behavior, we'd have to look at the actual data, not what it was used to render.

Remember from the recap above:

> Given the same `props` on the root component, and the same `store`, that root component will always render the same HTML for that view for that application. This is not influenced by how the `store` and `props` got that way.

Also from the recap above:

> All components in the React app use the `store` for their `state` and can even use it for their `props`.

So all that data for the products must have been in the `store`. Which means that so as long as we can get access to the `store`, we can compare what it was after transitioning from the search view to the product view, to what it would be had we jumped straight the the product view.

With Selenium, this isn't exactly easy because even though it can work with the local JavaScript runtime in that browser, it can't easily access things that are tucked away inside the scopes of the various running functions in that runtime.

Luckily, React and Redux together make this incredibly easy. From the recap:

> Redux binds the `store` for a React app to the root element of that app.

Once you identify the root element for the app, you can use the following JavaScript snippet (pulled from [this answer](https://stackoverflow.com/a/57909332/11808480) on stack overflow <insert link to stack overflow answer>) to get a snapshot of the `store` in JSON format. 

```js
const reactRoot = document.getElementById('react-root');
let base;

try {
    base = reactRoot._reactRootContainer._internalRoot.current;
} catch (e) {
    console.log('Could not get internal root information');
}

var state;
while (base) {
    try {
        state = base.pendingProps.store.getState();
    } catch (e) {
        // no state
        base = base.child;
        continue;
    }
    return state;
}
```

You can parse this and compare all or parts of it to other snapshots of the `store` gotten using the same snippet.

So for the example we were working with above, we can take a snapshot of the `store` after going through the search view to get to the product view, and then a snapshot of the `store` after jumping straight to the product view. We can then strip out anything we know isn't used by the product view and compare them directly.

If they're the same, then we can rule out there being a bug related to going to the product view from the search view. As a result, we no longer have to involve going through the search view if we want to end up at a product view.

If they're different, then we've found a bug, and don't have to do any extra debugging, as we can just point to the discrepancy between the `store`s.

By using this technique, we can save an enormous amount of time and energy by creating known checkpoints for our tests to safely make assumptions about. If the tests don't have to worry about accumulation of state when going from the search view to the product view, then they can just jump straight to the product view if they need to. This cuts down on execution time and processing resources, and even helps eliminate confounding variables from our tests so they can cut straight to the point and more reliably test the behaviors they're meant to test.

The same goes for the tests that are checking those transition bugs. If the transition for a previous part of there flow is covered by another test, then they don't need to be concerned about accumulation and can likely cut that part out.

As an added bonus, it also helps to expose bugs that we _wouldn't_ see if we'd gone through the whole flow, and would only see if we instead jumped straight to the relevant view (e.g. think of a bug you'd only see if you refreshed the page).

{% include grey_box_react_redux/grey_box_react_redux_js.html %}
