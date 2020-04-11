---
layout: posts
title: "Grey Box Testing - React Redux Part 1: A Primer"
excerpt: "Before we can refine our tests to take advantage of React and Redux, we first have to understand what they do for us, and a little bit about how they do it."
date: 2020-04-10 21:00:00 -0500
---

At first glance, Single Page Applications (SPAs) can appear daunting to test, and, if made from scratch, would be quite the challenge. But  if made using a good framework (or set of frameworks), it can actually make testing significantly easier and more efficient. 

React Redux is a set of frameworks that do exactly this (at least, when used appropriately).

Let's go over how things work in traditional websites, and how SPAs make things different so we can better understand the challenge at hand. Then, in the next part, let's go over how React Redux works so we can see where the opportunities are for making refinements, i.e. optimizations, increasing validity, and narrowing down where bugs are before we have to do any debugging.

If you feel you have a decent grasp of how React and Redux work, or just want the TL;DR, then feel free to skip ahead to [Part 2]({% post_url 2020-04-10-grey-box-react-redux-part-2 %}).

## Non-AJAX Websites vs SPAs

### Non-AJAX

AJAX wasn't always around for websites, and when a site doesn't use AJAX, the browser will have no concept of system state other than cookies. For them, system state is handled entirely by the backend.

As the client interacts with such sites, the client is just sending requests to the backend along with its cookie(s), and those requests are only sent to the backend in two scenarios:

1. When the client is going to a new page, either by typing in a URL, clicking a link, or filling out and submitting a form
2. While the page the client went to is doing its initial rendering of that page and needs additional resources to finish rendering it

When the backend receives a request for a new page (as opposed to a request for those additional resources), it sees the request details and the client's cookie (let's assume there's only ever 1 cookie to simplify things). It uses that request and that cookie to determine what response to send back.

The client, upon receiving that response, knows it's getting the information for a new page, and will use that response to start rendering the page (and possibly make more requests for more resources to finish rendering that page, as mentioned above).

The client has no state on its end other than those cookies, and the backend is managing pretty much everything about the SUT's state. Because of this, given the backend's state is consistent, you can be certain about 2 things:

1. A request made using that cookie will always return the same response from the backend (if the request is the same)
2. The client will always render the exact same page using that response (if it has that cookie)

In other words, it means the previous page the browser was at before going to that next page, doesn't really matter. The only things that matters are:

1. The browser must have that cookie before getting to that next page
2. The request must have been made using that cookie (and technically user-agent, but let's ignore that for now, as it doesn't change anything mentioned here)

This is the core of the "stateless page redraw model", and gives us the ability to skip doing several setup steps through the browser for a given test. 

Note: While you technically don't have to make the request through the browser to get the browser to use that response, making this happen is fairly complex and might counterproductive to the test you're trying to run. So I don't recommend making that last request through something other than the browser.
{: .notice--info}

### SPAs

SPAs throw this concept out the window, but for good reason. While the backend is still the ultimate source of truth for confirmed data, the frontend of a SPA manages a lot of that data on its end so it can make judgement calls about what specific data or pieces of HTML it needs to get as the client goes through the app.

SPAs don't navigate from page to page to perform actions through the backend as a traditional site would, despite them often creating the illusion of this. Instead, they use what we can refer to as "views".

Note: A website doesn't need to have a SPA to perform actions through the backend without navigating to a new page. That's just AJAX. But SPAs are getting more common nowadays, and this post is about React Redux.
{: .notice--info}

When you first land on the SPA's page, sure, it works just like a traditional site, fetching those resources it needs to completely finish rendering the page (unless they're using session/local storage, but we'll ignore that for now to keep things simple). But as you perform actions and go to new "views", the SPA is (ideally) only making the requests for the resources it doesn't already have that it needs to finish rendering those "views".

This means there is an accumulation of state as you go from view to view and perform actions through the UI, and as parts of the view are updated that can create problem areas if it's not managed well, while also making testing more complicated in many cases.

Basically, a bug can be caused by discrepancies between what the state would be had you done everything up to a certain point through the UI, versus what it would be if you had just skipped ahead to that point and done everything before it through other means (e.g. through HTTP requests directly).

This can sometimes means that making any refinements, like those mentioned above, is more difficult. But that's where frameworks like React Redux come in.

## React Redux

React Redux is actually two frameworks: React and Redux. But they go together like french fries and milkshakes.

To cover how they work together and the benefits they give us, I'll first cover React to explain how it normally works, and then I'll go over Redux to explain how the two combined get us those benefits.

### React

React is a wonderful frontend framework that breaks things down into "components". These components allow us to compartmentalize how individual chunks of the page behave and are rendered in a **deterministic** way. 

React's [documentation](https://reactjs.org/docs/components-and-props.html) sums up components very well:

> Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.

Basically, each component has a single `render` method[^1] that knows how to determine what HTML should be used to render it, and it does this by defining the structure of the components and HTML elements it wants to use in the way it wants to use them, and then returning the structure. [Here's](https://reactjs.org/docs/components-and-props.html) some simple examples from their docs to help clarify. When components are referenced inside this method, they can be given an initial set of data (i.e. `props`), and that can change how it's rendered.

Components that only work with these "props" are referred to as "stateless components". Here's a quick analogy to explain them a bit better.

Given this function:

```python
def double(num: Union[float, int]):
    return num * 2
```

If you pass it `3`, it will always return `6`. 

Stateless components work just like this, except the argument they take is the `props`, and what they return is a chunk of HTML. If given the same input, they should always return the same output, i.e. render the same HTML.

But React components can go beyond this. They can have `state`, and, as you might expect, are then referred to as "stateful components".

Stateful components work similarly to how stateless components work, in that the props they are given influence what they return. But now, the `props` act as a sort of config for them, and their `state` is used in combination with it to determine what they render.

The `props` of a stateful component are immutable, so they can never be changed (except by their parent component). Instead, to update what a component is rendering, its `state` is changed, and every time this happens, it triggers the component to re-render itself. But every time it re-renders itself, _both_ its `props` and `state` are factored in the exact same way they were when it was initially rendered.

This means that as long as a component's `state` and `props` are the same, it will always render the same HTML, provided none of that component's child components are managing their own `state`. If it _does_ have child components that are managing their own `state`, then those child components could be re-rendering themselves without the parent component having any change in its `state`.

This is _great_ for testing, because it means we can be concerned about fewer, more specific things. Ultimately, we now only need to be concerned about whether or not:

1. Components are being made with the expected `props`
2. Components have the expected `state` after an action is taken (if dealing with stateful components)
3. Components render the expected HTML when made with a given set of `props`, as well as a given `state` (if dealing with stateful components)

Note: Sometimes components can be made to work like wrappers, and aren't in complete control of what they render because another component is supposed to use them and tell them what components/elements they're wrapping. This is called ["containment"](https://reactjs.org/docs/composition-vs-inheritance.html#containment), and isn't something you need to worry about. They still control where those children go, and here still must be some component being used up the chain that has that complete control, so the general principles described here still apply.
{: .notice--info}

It's also important to know that React works usually by having [a single root component for the app](https://reactjs.org/docs/rendering-elements.html#rendering-an-element-into-the-dom). This root component ultimately determines what other components are used, and what their initial `props` are. All the other components that you see being used are put there because their parent component's render logic determined they should be there, and this chains up through the tree of components all the way up to that root component.

Sometimes there can be multiple root React components. But for our purposes, we can just treat those as separate applications.

For frontend unit tests, this can be pretty useful information, but it's currently limited in potential because it means we can only make judgement calls on a component-by-component basis based on `state`s. But this system will be extremely useful for end-to-end tests when combined with Redux.

[^1]: If a React component is just a function (as opposed to a class), then it doesn't need a `render` method, because it serves as its own `render` method. This just means that all the logic for how it should be rendered isn't abstracted through other methods, so it's all in the scope of that function. This doesn't change the principles laid out here, though.

### Redux

Redux, in theory, is actually a really simple addition to React. It doesn't change what React provides for you. It only changes how the `state` of each component is stored and updated, and how props are passed to components.

Basically, Redux allows you to make your components go through its "state container", i.e. the `store`, for all their data, so instead of holding onto state themselves, it's held by the `store` (even though they still think they're holding onto it). Whenever the `store` is updated, components that depended on the data that changed will automatically re-render with the new data, because their `state` has changed. Components can even share data through the `store`.

Even if multiple React apps are used on a page, Redux has to associate a `store` with the root component of an application, so there can only be one `store per application.

Redux eliminates the component-by-component limitation. Since every component's state is now going through a central container, we can now rely on determinism for how the application is rendered as a whole. Now, given the same `props` for the root component, and the same Redux `store`, that root component will render the same HTML every time, and it doesn't matter how the `props` or the `store` got that way.

<div class="notice--warning">
  <h4>Warning:</h4>
  This all assumes React and Redux are being used in the intended manner. Talk to your frontend devs to confirm that this is how they are using those frameworks before using the refinement techniques I'll be describing. 

  If they aren't using the frameworks in the intended way, try working with them to shift to that approach. Maybe even continue to follow along with this post series so you can explain the testing benefits that would be gained from doing so, and then advocate for them.

  <i>Everyone</i> wins when the product is easier to test!
</div>

Now that we have a grasp of the general principles for how React and Redux work, in the next part we can go over the refinements I mentioned.
