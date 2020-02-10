---
layout: posts
title: "Scientific Testing Part 1: Getting Back on the Right Track"
date: 2020-02-09 13:00:00 -0500
---

Too often I see tests that more or less invalidate themselves, or otherwise hinder the value they could add. They test too much, don't test anything at all, are vulnerable to unrelated problems because of unnecessary dependencies, can't fail, are non-deterministic, or any number of other avoidable issues. It's incredibly common, despite the source of the problem being quite clear.

![Mr. Incredible meme saying 'Science is Science' instead of 'Math is Math'](/images/science_is_science.jpg)

Put simply, software testing, as a whole, is not treated in a scientific manner, and there's no reason it shouldn't be treated with the same scrutiny as scientific research. Why? Because it's _supposed_ to be scientific research. You've likely heard the term **Computer Science**, and software testing is just how some of the tests for that field are done. The word "test" is just a synonym for "experiment".

This shouldn't seem like some outlandish or ridiculous claim. If you feel it is, then let's review what exactly "science" is.

If no more convincing is needed, feel free to skip ahead to [Part 2]({% post_url 2020-02-06-scientific-testing-part-2 %}).

## What is science?

> **science (n.)**
> : the intellectual and practical activity encompassing the systematic study of the structure and behavior of the physical and natural world through observation and experiment.
> - [Oxford Dictionaries](https://www.lexico.com/en/definition/science)

In other words, science is the process of trying to understand how things behave or are structured.

There's many things that contribute to it being "systematic". The core of it is the scientific method, which is basically a never-ending flowchart that describes how we evolve our understanding through:
1. defining hypotheses
2. performing experiments engineered to support, refute, or validate those hypotheses
3. and drawing conclusions based on the results of those experiments

Those experiment results then inform new hypotheses, and the cycle continues.

The most important aspect of it, is that _anyone_ should be able to come along with their own equipment, completely reproduce the experiments someone else did, get the same results, and draw the same conclusions. While science itself is unbiased and objective, the scientists performing the experiments may not be, and even when they try to be, they are still fallible. Making sure the experiments are reproducible, before research is accepted, helps weed out those biases and mistakes.

### Hypotheses and Theories

A hypothesis is an explanation given for some behavior or structure with little or no evidence to back it up. It's basically a guess that is then put to the test to see if it holds up. If it doesn't, then it's either tossed out, or modified to align with the new evidence.

Theories are hypotheses that hold up after extensive experimentation and align with all the evidence.

### Experiments

When designing an experiment, it must be carefully engineered to support, refute, or validate a hypothesis. They must be repeated by the same researchers to verify the results, and must be thoroughly documented so that other researchers can reproduce the experiment and its results. If another researcher can't perform the same experiment with their own equipment, get the same results, and draw the same conclusions, then the results mean nothing.

But this is not enough. They must also be engineered to avoid any sort of outside influence. When an outside influence affects an experiment or the results of an experiment and it isn't controlled for, it threatens the validity of the experiment. These influences are referred to as "confounding variables". If these aren't accounted for, the results will be invalidated, because it can't be known what actually did what.

In order to account for these influences, we use "controls". There's several types of controls, so I won't cover them, as the specific types aren't as important as the general concept (plus that would make this post significantly longer). They allow scientist to filter out the effects of confounding variables from their results (if they're applied properly). Basically, they answer the question of "how do you know &lt;thing&gt; wasn't a factor?"

Every precaution that can be taken, must be taken to ensure the validity of the experiments, their results, and the conclusions drawn from them, because it's all about building confidence in the results and conclusions. If the validity of the experiment is damaged, the results and conclusions can be called into question, and scientists want to avoid this whenever possible.

#### TL;DR

- "Science" is how we try to understand the behavior or structure of something through experimentation.
- A "hypothesis" is an given for some behavior or structure with little or no evidence to back it up.
- "Theories" are hypotheses that hold up after extensive experimentation and align with all the evidence
- Experiments can have their results invalidated by "confounding variables", not being repeated, and not being reproducible.
- "Controls" are how experiments are protected from confounding variables.

## Bringing it back around

You should start to see a pattern here.

Our tests are how we understand the behavior and structure of our product/code. The goal for software tests and what we think of as "normal" science experiments is the same: to build confidence in our understanding of how something behaves or is structured.

In "normal" science, we try to understand the behavior or structure of something. In our tests, we do the same thing.

The only difference between them, is the perspective we go about it from and the conclusions we draw from the results.

In "normal" science, the conclusions are our attempt to explain how the universe _is_. With our tests, the conclusions are whether or not the "universe" we created happens to line up with what we _want_.

### "If that's true, then why haven't tests always been performed like science experiments?"

That's my point. The vast majority of tests _are_ science experiments, because they're done as part of what we'd consider "normal" scientific research. The word "test" is just a synonym for "experiment". Software testing is just another branch of science, i.e. **Computer Science**. Software tests _should_ be done scientifically, but far too many aren't.

Why software testing has been treated differently than other sciences in the past is complicated, and something I don't have the full answer to. I would guess a large part of it stems from lack of proper training/education, or just the fact that we aren't publishing our tests and test results to the entire scientific community for them to tear apart.

## Why it matters

Hopefully by this point, you can see the connection, and understand that software testing is just another form of science. If not, then your tests must not be trying to build confidence that the behavior or structure of the code aligns with what you want, in which case, they aren't tests.

So what does this understanding do for us?

### Using the same language

It gives us access to an entire lexicon that's clear and well-defined. We can use it to communicate ourselves more effectively, which means we'll be able to understand each other better.

### Being more scientific

We can now write our tests with a more objective and critical eye. Our acceptance criteria are now theories, except instead of trying to explain the behavior or structure that _is_, they explain the behavior or structure we _want_. Our tests now challenge the hypotheses that what _is_, aligns with what we _want_.

**Theories, of course, can never be proven**, so our tests should no longer feel like a guarantee that everything is working as it should. This is a good thing, because they never _were_. If they were, no one would ever release bugs to production.

The reality is that we are not gods, nor are we infallible. We didn't define the rules the universe is governed by, and even if we knew what they were, we wouldn't be able to fully comprehend all their implications.

With software, we may have defined the rules for our "universe" through code, but we still can't fully comprehend all their implications. If we could, we wouldn't need tests in the first place, and no one would ever have any bugs.

This may sound scary, but, like I said, understanding this is good. It means 2 things:
1. We can now treat our test results the way they are meant to be treated; as a means of building _confidence_; not as providing a guarantee.
2. We can know to treat our tests as scientific research and treat them with the same scrutiny that any other scientific research gets treated with, and use the same techniques, refined over centuries, to strengthen the quality of our tests.

With that in mind, let's move on to [Part 2]({% post_url 2020-02-06-scientific-testing-part-2 %}).
