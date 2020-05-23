---
layout: posts
title: "Should SDETs Write Unit Tests?"
excerpt: "Whose responsibility is it too write unit tests? Should SDETs know how to write effective unit tests?"
date: 2020-05-23 09:15:00 -0500
---

Recently I was asked if SDETs should be expected to write unit test, and I feel the answer I gave at the time wasn't sufficient, so I wanted to write a quick post to provide a better answer.

Sometimes other engineers don't write the best tests. Your job is _not_ to write tests _for_ them. Writing valid, and effective tests at the levels they're responsible for is part of _their_ job. They should be capable of doing that on their own.

As an SDET, or QA Automation Engineer, you're job is to make sure there's sufficient and effective automated tests at every level (be it unit, integration, end-to-end, or any other level) to build enough evidence in the quality of the code to feel confident in pushing it out to production, or to prevent it from going out because there's too many problems.

Your job is to think about how the desired behaviors of the product play out as a whole, and to think about what level a test can be performed at. Your job is to consider how these behaviors will play out when an actual user uses the product. Your job is to consider the big picture.

You're there to make sure the other engineers don't lose sight of the forest for the trees.

Should you be writing API and end-to-end tests? Yes. You are the owner of those tests, and they're your responsibility.

Should _other_ engineers be writing API and end-to-end tests? Yes. Quality is their responsibility too, and if they identify a test that you don't have written, or you don't have the time to write all the necessary tests, they are more than welcome to help add those tests.

Should you be writing unit tests? Yes. For the same reason a developer would write an API or end-to-end test, you should be equally as welcome and comfortable writing unit tests in the code that _they_ own.

It's all about collaboration.

You're a software engineer, and should be comfortable working with someone else's code. You don't have to start off being able to write a backend server or a frontend, though.

If you find it difficult to understand or work with the code other engineers have written, then it's a perfect opportunity to pair program with them. You'll get more exposure to other kinds of code logic and structures, and they'll potentially find out about a test case they may not have considered, and also get some feedback on how to improve their code.

The goal is to speed things up and improve not just the quality of the product, but also the quality of the code itself. Having more eyes on the code means more feedback, and more opportunities to make the code more usable, readable, maintainable, and extensible. This goes for their code and _yours_.

If we work together, everyone wins.
